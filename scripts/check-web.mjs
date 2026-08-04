#!/usr/bin/env node
/**
 * Piano web check.
 *   node scripts/check-web.mjs <soubor…>   BLOKUJÍCÍ: tvrdá pravidla (em-pomlčky). exit 1 při nálezu.
 *   node scripts/check-web.mjs --audit [cesty]  PORADNÍ: SEO/copy heuristiky. exit 0 (jen report).
 * Blokující pravidla mají nulovou míru falešných poplachů, proto jimi gateujeme commit.
 * Úsudkové věci (tón, mobil, síla propojení) řeší agentní review, ne tento skript.
 *
 * Pozn. k audit části: stránky nemají literální <title>, ale předávají title
 * jako prop layoutu (<Base title="…" description="…">). Meta se proto vytahuje
 * z volání layoutu, ne z HTML tagu.
 */
import { readFileSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const EXT = /\.(astro|md|mdx|ts|tsx|js|mjs|cjs|vue|json|ya?ml|html|css|scss)$/i;
/* Znak se skládá z kódu úmyslně: jinak by skript blokoval sám sebe. */
const EM = String.fromCharCode(0x2014);
const audit = process.argv[2] === '--audit';
let args = process.argv.slice(audit ? 3 : 2);

/* Cíle délek (Google zobrazuje cca 580 px title / 920 px desc) */
const TITLE_MIN = 30, TITLE_MAX = 60;
const DESC_MIN = 110, DESC_MAX = 160;

function list(paths) {
  if (paths.length) return paths;
  return execSync('git ls-files apps packages', { encoding: 'utf8' }).split('\n').filter(Boolean);
}
const read = (f) => { try { return statSync(f).isFile() ? readFileSync(f, 'utf8') : null; } catch { return null; } };

/* ---------- BLOKUJÍCÍ: em-pomlčky ---------- */
function blocking(files) {
  let hits = 0;
  for (const f of files.filter((f) => EXT.test(f))) {
    const txt = read(f); if (txt == null) continue;
    txt.split('\n').forEach((ln, i) => {
      if (ln.includes(EM)) { hits++; console.error(`  ${f}:${i + 1}  ${ln.trim().slice(0, 100)}`); }
    });
  }
  if (hits) {
    console.error(`\n✗ Nalezeno ${hits}× em-pomlčka „${EM}". Nahraď čárkou, dvojtečkou nebo rozděl větu.`);
    process.exit(1);
  }
  console.log('✓ Blokující kontrola OK (žádné em-pomlčky).');
}

/* ---------- pomocné: název webu a meta ze zdroje stránky ---------- */

/** Vytáhne SITE_NAME z layoutu appky (apps/<web>/src/layouts/Base.astro). */
const siteNameCache = new Map();
function siteNameFor(file) {
  const app = (file.match(/(^|\/)apps\/([^/]+)\//) || [])[2];
  if (!app) return null;
  if (siteNameCache.has(app)) return siteNameCache.get(app);
  const base = read(`apps/${app}/src/layouts/Base.astro`) || '';
  const name = (base.match(/SITE_NAME\s*=\s*['"`]([^'"`]+)['"`]/) || [])[1] || null;
  siteNameCache.set(app, name);
  return name;
}

/** Hodnota atributu z úryvku značky: podporuje foo="…", foo='…', foo={'…'}, foo={`…`}. */
function attr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*['"\`]([^'"\`]*)['"\`]\\s*\\})`, 'i');
  const m = tag.match(re);
  if (!m) return null;
  const v = (m[1] ?? m[2] ?? m[3] ?? '').replace(/\s+/g, ' ').trim();
  /* Sablonovy literal (`${post.data.title} | Pecosta`) se sklada az za behu,
     jeho delku nema smysl merit. */
  return v.includes('${') ? null : v;
}

/**
 * Meta stránky. Bere první výskyt layoutu (Base/Layout/BaseHead) a čte jeho propy.
 * Fallback: literální <title> a <meta name="description"> (statické HTML v dist).
 */
function pageMeta(txt) {
  /* Obalova komponenta stranky je prvni tag na zacatku radku bez odsazeni:
     <Base>, ale i wrappery jako <SegmentPage>, <IntegracePage>, <LegalPage>. */
  const open = txt.match(/^<[A-Z][A-Za-z0-9]*\b[\s\S]*?>/m);
  if (open) {
    const tag = open[0];
    const title = attr(tag, 'title');
    const description = attr(tag, 'description');
    /* Prop je pritomny, ale hodnota se sklada za behu (sablonovy literal
       nebo vyraz) -> delku ani tvar nelze staticky posoudit, nehlasit. */
    const dyn = (name) => new RegExp(`\\b${name}\\s*=\\s*\\{`).test(tag) || new RegExp(`\\b${name}\\s*=\\s*"[^"]*\\$\\{`).test(tag);
    if (title || description || dyn('title')) {
      return { title, description, dynTitle: !title && dyn('title'), dynDesc: !description && dyn('description') };
    }
  }
  const title = (txt.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const description = (txt.match(/name=["']description["']\s+content=["']([\s\S]*?)["']/i) || [])[1];
  return { title: title?.replace(/\s+/g, ' ').trim() || null, description: description?.trim() || null, dynTitle: false, dynDesc: false };
}

/* ---------- PORADNÍ: SEO/copy heuristiky ---------- */
function auditReport(files) {
  const warn = [];
  const pages = files.filter((f) => /\.(astro|html)$/i.test(f) && /\/pages?\//.test(f));

  for (const f of pages) {
    const t = read(f); if (t == null) continue;
    const { title, description, dynTitle, dynDesc } = pageMeta(t);
    const site = siteNameFor(f);

    if (!title && !dynTitle) warn.push(`${f}: chybí title`);
    if (title) {
      const len = title.length;
      /* U servisnich stranek je kratky title v poradku (Kontakt, Děkujeme…) */
      const utility = /\/(kontakt|dekujeme|cookies|ochrana-udaju|ochrana-osobnich-udaju|obchodni-podminky|kariera)\b/.test(f);
      if (len > TITLE_MAX || (len < TITLE_MIN && !utility)) warn.push(`${f}: délka title ${len} zn. (cíl ${TITLE_MIN}–${TITLE_MAX}): „${title}"`);
      /* CLAUDE.md: meta title ve tvaru „Text | Název webu" */
      if (site && !title.endsWith(`| ${site}`)) warn.push(`${f}: title není ve tvaru „Text | ${site}": „${title}"`);
    }

    if (!description) {
      if (!dynDesc) warn.push(`${f}: chybí meta description`);
    } else {
      const l = description.length;
      if (l < DESC_MIN || l > DESC_MAX) warn.push(`${f}: meta description ${l} zn. (cíl ${DESC_MIN}–${DESC_MAX})`);
    }

    const h1 = (t.match(/<h1[\s>]/gi) || []).length;
    if (h1 > 1) warn.push(`${f}: ${h1}× <h1> (má být 1)`);
  }

  /* OG obrázek: layout na něj odkazuje, ale soubor nemusí existovat */
  const apps = new Set(files.map((f) => (f.match(/(^|\/)apps\/([^/]+)\//) || [])[2]).filter(Boolean));
  for (const app of apps) {
    const base = read(`apps/${app}/src/layouts/Base.astro`);
    if (!base) continue;
    const og = (base.match(/image\s*=\s*['"`](\/[^'"`]+)['"`]/) || [])[1];
    if (og && !existsSync(`apps/${app}/public${og}`)) warn.push(`apps/${app}: výchozí OG obrázek ${og} v public/ neexistuje`);
  }

  for (const f of files.filter((f) => /\.(astro|html|vue|md|mdx)$/i.test(f))) {
    const t = read(f); if (t == null) continue;
    t.split('\n').forEach((ln, i) => {
      const imgs = ln.match(/<img\b[^>]*>/gi) || [];
      for (const img of imgs) if (!/\balt=/.test(img)) warn.push(`${f}:${i + 1}: <img> bez alt`);
      if (/<img\b[^>]*src=["'][^"']+\.(png|jpe?g)["']/i.test(ln)) warn.push(`${f}:${i + 1}: raw PNG/JPG v <img> (preferuj WebP/AVIF)`);
    });
  }

  if (warn.length) { console.log(`\n⚠ Poradní SEO/copy nálezy (${warn.length}):`); warn.forEach((w) => console.log('  - ' + w)); }
  else console.log('✓ Poradní SEO/copy audit: bez nálezů.');
}

const files = list(args);
if (audit) auditReport(files); else blocking(files);
