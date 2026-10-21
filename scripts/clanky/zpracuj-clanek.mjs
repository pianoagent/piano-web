#!/usr/bin/env node
/**
 * Článek z Google Docu → blog webu (content collection). Používá ho rutina
 * `publikace-clanku` (převod) i GitHub Action `publikovat-clanek` (validace, cesty).
 *
 *   node scripts/clanky/zpracuj-clanek.mjs prevod --web piano --vstup doc.md --meta meta.json [--cover obr.jpg] [--prepsat]
 *       doc.md   = export Docu přes Drive (exportMimeType text/markdown), obrázky v něm jsou base64
 *       meta.json = { title, seoTitle?, description?, pubDate: "RRRR-MM-DD", categories: [], slug? }
 *       Zapíše apps/<web>/src/content/blog/<slug>.md a obrázky do apps/<web>/src/assets/images/blog/.
 *       Na stdout vypíše JSON { slug, soubory, varovani }.
 *
 *   node scripts/clanky/zpracuj-clanek.mjs validace [soubory.md…]
 *       Bez argumentů vezme články změněné proti origin/main. exit 1 při chybě.
 *
 *   node scripts/clanky/zpracuj-clanek.mjs cesty <base-ref>
 *       Pojistka pro automerge: exit 1, pokud se proti <base-ref> změnilo cokoli mimo obsah blogu.
 *
 * Text článku se přebírá doslovně (texty od klienta neupravujeme). Mění se jen forma:
 * H1 z Docu se zahodí (titulek je z tabulky), tučný samostatný řádek → nadpis ##,
 * obrázky → WebP soubory, em-pomlčka → en-pomlčka (pre-commit hook by ji blokoval).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
/* Znak se skládá z kódu úmyslně: jinak by pre-commit hook blokoval tenhle skript. */
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
const MAX_SIRKA = 1600;
const KVALITA = 82;
/* Jediné cesty, které smí článkové PR měnit (pojistka automerge). */
const POVOLENE = [/^apps\/[^/]+\/src\/content\/blog\/[^/]+\.md$/, /^apps\/[^/]+\/src\/assets\/images\/blog\/[^/]+\.webp$/];

const [, , prikaz, ...rest] = process.argv;
const chyba = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };

function argumenty(list) {
  const out = { _: [] };
  for (let i = 0; i < list.length; i++) {
    if (!list[i].startsWith('--')) { out._.push(list[i]); continue; }
    const key = list[i].slice(2);
    const next = list[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}

export function slugify(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
}

/** Názvy kategorií z apps/<web>/src/blog-categories.ts (pole `name`). */
function kategorieWebu(web) {
  const f = join(ROOT, 'apps', web, 'src/blog-categories.ts');
  if (!existsSync(f)) return null;
  return [...readFileSync(f, 'utf8').matchAll(/\bname:\s*(['"])(.+?)\1/g)].map((m) => m[2]);
}

const blogDir = (web) => join(ROOT, 'apps', web, 'src/content/blog');
const obrDir = (web) => join(ROOT, 'apps', web, 'src/assets/images/blog');

async function doWebp(buffer, cil) {
  const sharp = (await import('sharp')).default;
  await sharp(buffer).rotate().resize({ width: MAX_SIRKA, withoutEnlargement: true }).webp({ quality: KVALITA }).toFile(cil);
}

/* ---------------- převod ---------------- */
async function prevod(a) {
  const web = a.web;
  if (!web || !a.vstup || !a.meta) chyba('Použití: prevod --web <web> --vstup doc.md --meta meta.json [--cover obr] [--prepsat]');
  if (!existsSync(blogDir(web))) chyba(`Web „${web}" nemá blog (chybí apps/${web}/src/content/blog).`);
  const meta = JSON.parse(readFileSync(a.meta, 'utf8'));
  const varovani = [];

  if (!meta.title?.trim()) chyba('V meta chybí title.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.pubDate || '')) chyba(`pubDate musí být RRRR-MM-DD, je „${meta.pubDate}".`);
  const slug = meta.slug?.trim() || slugify(meta.title);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) chyba(`Neplatný slug „${slug}".`);

  const mdCil = join(blogDir(web), `${slug}.md`);
  if (existsSync(mdCil) && !a.prepsat) chyba(`Článek ${slug} už existuje. Pro přepsání (stav Aktualizovat) použij --prepsat.`);

  let md = readFileSync(a.vstup, 'utf8').replace(/\r\n/g, '\n');

  /* 1) obrázky: definice [imageN]: <data:...;base64,...> z konce exportu */
  const data = new Map();
  md = md.replace(/^\[([^\]]+)\]:\s*<data:image\/[a-z+]+;base64,([^>]+)>\s*$/gm, (_, id, b64) => {
    data.set(id, Buffer.from(b64, 'base64'));
    return '';
  });

  /* 2) H1 pryč (titulek je z tabulky) */
  md = md.replace(/^# +(.+)$/gm, (_, t) => { varovani.push(`Vynechán nadpis H1 z Docu: „${t.trim()}"`); return ''; });

  /* 3) tučný samostatný řádek → ##, tučné uvnitř nadpisů pryč */
  md = md.replace(/^\*\*([^*\n]{1,150})\*\*[ \t]*$/gm, '## $1');
  md = md.replace(/^(#{2,6}) +\*\*(.+?)\*\* *$/gm, '$1 $2');

  /* 4) odkazy na obrázky → soubory WebP. Při přepisu nejdřív staré obrázky článku pryč,
        nepoužité soubory v src/assets by Astro přibalilo do buildu. */
  const soubory = [];
  mkdirSync(obrDir(web), { recursive: true });
  if (a.prepsat) for (const f of readdirSync(obrDir(web))) if (f === `${slug}.webp` || f.startsWith(`${slug}-obrazek-`)) rmSync(join(obrDir(web), f));
  let n = 0;
  const nahrady = [];
  md = md.replace(/!\[([^\]]*)\]\[([^\]]+)\]/g, (cely, alt, id) => {
    const buf = data.get(id);
    if (!buf) { varovani.push(`Obrázek ${id} v exportu chybí, odkaz vynechán.`); return ''; }
    n++;
    const nazev = `${slug}-obrazek-${n}.webp`;
    nahrady.push(doWebp(buf, join(obrDir(web), nazev)));
    soubory.push(`apps/${web}/src/assets/images/blog/${nazev}`);
    if (!alt.trim()) varovani.push(`Obrázek ${n} nemá alt text (doplň v Docu: pravý klik → Alternativní text).`);
    return `![${alt}](/images/blog/${nazev})`;
  });
  await Promise.all(nahrady);

  /* 5) em-pomlčky */
  const em = md.split(EM).length - 1;
  if (em) { md = md.split(EM).join(EN); varovani.push(`Nahrazeno ${em}× „${EM}" za „${EN}".`); }

  /* 6) úklid prázdných řádků */
  md = md.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  if (!md.trim()) chyba('Text článku je po převodu prázdný.');

  /* titulní obrázek */
  let image;
  if (a.cover) {
    const nazev = `${slug}.webp`;
    await doWebp(readFileSync(a.cover), join(obrDir(web), nazev));
    soubory.push(`apps/${web}/src/assets/images/blog/${nazev}`);
    image = `/images/blog/${nazev}`;
  } else varovani.push('Chybí titulní obrázek, článek bude bez obrázku v přehledu a bez og:image.');

  const fm = ['---', `title: ${JSON.stringify(meta.title.trim().split(EM).join(EN))}`];
  if (meta.seoTitle?.trim()) fm.push(`seoTitle: ${JSON.stringify(meta.seoTitle.trim().split(EM).join(EN))}`);
  if (meta.description?.trim()) fm.push(`description: ${JSON.stringify(meta.description.trim().split(EM).join(EN))}`);
  fm.push(`pubDate: ${meta.pubDate}`);
  if (image) fm.push(`image: ${JSON.stringify(image)}`);
  if (meta.categories?.length) fm.push(`categories: ${JSON.stringify(meta.categories)}`);
  fm.push('---', '');

  writeFileSync(mdCil, fm.join('\n') + '\n' + md);
  soubory.unshift(`apps/${web}/src/content/blog/${slug}.md`);

  const { chyby, varovani: v2 } = zkontroluj(`apps/${web}/src/content/blog/${slug}.md`);
  console.log(JSON.stringify({ slug, web, soubory, chyby, varovani: [...varovani, ...v2] }, null, 2));
  if (chyby.length) process.exit(1);
}

/* ---------------- validace ---------------- */
function frontmatter(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const ln of m[1].split('\n')) {
    const kv = ln.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^["[]/.test(v)) { try { v = JSON.parse(v); } catch { /* YAML s apostrofy apod. */ } }
    else if (/^'.*'$/.test(v)) v = v.slice(1, -1);
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

function zkontroluj(rel) {
  const chyby = [], varovani = [];
  const web = (rel.match(/^apps\/([^/]+)\//) || [])[1];
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return { chyby: [`${rel}: soubor neexistuje`], varovani };
  const txt = readFileSync(abs, 'utf8');
  const fm = frontmatter(txt);
  if (!fm) return { chyby: [`${rel}: chybí frontmatter`], varovani };
  const { data: d, body } = fm;

  if (!d.title) chyby.push(`${rel}: chybí title`);
  if (!d.pubDate || Number.isNaN(Date.parse(d.pubDate))) chyby.push(`${rel}: chybí nebo neplatné pubDate`);
  const kat = kategorieWebu(web);
  if (d.categories !== undefined) {
    if (!Array.isArray(d.categories)) chyby.push(`${rel}: categories musí být pole`);
    else if (kat) for (const c of d.categories) if (!kat.includes(c)) chyby.push(`${rel}: neznámá kategorie „${c}" (povolené: ${kat.join(', ')})`);
  }
  const obrazky = [d.image, ...[...body.matchAll(/!\[[^\]]*\]\((\/images\/[^)\s]+)\)|<img[^>]*\bsrc="(\/images\/[^"]+)"/g)].map((m) => m[1] || m[2])].filter(Boolean);
  for (const p of obrazky) if (!existsSync(join(ROOT, 'apps', web, 'src/assets', p)) && !existsSync(join(ROOT, 'apps', web, 'public', p))) chyby.push(`${rel}: obrázek ${p} neexistuje`);
  if (txt.includes(EM)) chyby.push(`${rel}: obsahuje em-pomlčku „${EM}"`);
  if (/data:image\//.test(body)) chyby.push(`${rel}: v textu zůstal base64 obrázek`);
  if (/^\[image\d+\]|\]\[image\d+\]/m.test(body)) chyby.push(`${rel}: v textu zůstal nepřevedený odkaz na obrázek`);
  if (/^# /m.test(body)) chyby.push(`${rel}: text obsahuje H1 (titulek je jen jeden, z frontmatteru)`);

  const metaTitle = d.seoTitle || d.title || '';
  if (metaTitle.length > 60) varovani.push(`${rel}: ${d.seoTitle ? 'seoTitle' : 'title'} má ${metaTitle.length} znaků (cíl max. 60, zvaž SEO titulek)`);
  if (!d.description) varovani.push(`${rel}: chybí description (perex)`);
  else if (d.description.length < 110 || d.description.length > 160) varovani.push(`${rel}: description má ${d.description.length} znaků (cíl 110–160)`);
  if (!d.image) varovani.push(`${rel}: chybí titulní obrázek`);
  if (/!\[\]\(/.test(body)) varovani.push(`${rel}: obrázek bez alt textu`);
  if (!/^##+ /m.test(body)) varovani.push(`${rel}: text nemá žádný mezititulek (##)`);
  return { chyby, varovani };
}

function zmeneneProti(base) {
  return execSync(`git diff --name-only --diff-filter=ACMRD ${base}...HEAD`, { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
}

function validace(soubory) {
  if (!soubory.length) soubory = zmeneneProti('origin/main').filter((f) => /^apps\/[^/]+\/src\/content\/blog\/[^/]+\.md$/.test(f) && existsSync(join(ROOT, f)));
  if (!soubory.length) { console.log('Žádné články ke kontrole.'); return; }
  let chyb = 0;
  for (const f of soubory) {
    const { chyby, varovani } = zkontroluj(f.replace(`${ROOT}/`, ''));
    chyby.forEach((c) => console.error(`  ✗ ${c}`));
    varovani.forEach((v) => console.log(`  ⚠ ${v}`));
    chyb += chyby.length;
  }
  if (chyb) chyba(`Validace: ${chyb} chyb v ${soubory.length} článcích.`);
  console.log(`✓ Validace OK (${soubory.length} článků).`);
}

function cesty(base) {
  if (!base) chyba('Použití: cesty <base-ref>');
  const zmeny = execSync(`git diff --name-only ${base}...HEAD`, { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  const mimo = zmeny.filter((f) => !POVOLENE.some((re) => re.test(f)));
  if (!zmeny.length) chyba('PR nic nemění.');
  if (mimo.length) chyba(`PR mění soubory mimo obsah blogu, automerge zamítnut:\n  ${mimo.join('\n  ')}`);
  console.log(`✓ Cesty OK (${zmeny.length} souborů, jen obsah blogu).`);
}

const a = argumenty(rest);
if (prikaz === 'prevod') await prevod(a);
else if (prikaz === 'validace') validace(a._);
else if (prikaz === 'cesty') cesty(a._[0]);
else chyba('Příkazy: prevod | validace | cesty. Detail v hlavičce skriptu.');
