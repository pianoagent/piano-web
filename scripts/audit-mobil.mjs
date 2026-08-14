/**
 * Mobilní audit všech webů. Projede každou postavenou stránku v headless Chrome
 * na zadaných šířkách a hlásí, co se nevejde nebo se nedá pohodlně kliknout.
 *
 *   node scripts/audit-mobil.mjs                    všechny weby, 375 + 768 + 1024
 *   node scripts/audit-mobil.mjs --apps pecosta     jen vybrané
 *   node scripts/audit-mobil.mjs --w 375            jen jedna šířka
 *   node scripts/audit-mobil.mjs --json cesta.json  kam uložit surová data
 *
 * Proč vlastní skript a ne jen oko: přetečení do strany máme v base.css
 * zaslepené (overflow-x: clip), takže se nijak neprojeví, obsah se tiše uřízne
 * a pozná se to jen tím, že něco chybí. Audit se proto ptá po jednotlivých
 * prvcích, jestli leží za okrajem a nemají nad sebou posuvný rám. Vedle toho
 * měří velikost klikacích ploch a písmo ve formulářích.
 *
 * Potřebuje puppeteer-core a lokální Chrome. Instaluje se mimo repozitář:
 *   npm i puppeteer-core --no-save
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// ---------- argumenty ----------
const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const WIDTHS = arg('w', '375,768,1024').split(',').map(Number);
const ONLY = arg('apps', '').split(',').filter(Boolean);
const JSON_OUT = arg('json', '');

// ---------- seznam stránek z buildu ----------
function routesOf(app) {
  const dist = path.join(ROOT, 'apps', app, 'dist');
  if (!existsSync(dist)) return [];
  const out = [];
  const walk = (dir, base = '') => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (e.name === '_astro' || e.name.startsWith('.')) continue;
        walk(path.join(dir, e.name), `${base}/${e.name}`);
      } else if (e.name === 'index.html') {
        out.push(base === '' ? '/' : `${base}/`);
      }
    }
  };
  walk(dist);
  return out.sort();
}

const APPS = readdirSync(path.join(ROOT, 'apps'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .filter((a) => (ONLY.length ? ONLY.includes(a) : true))
  .filter((a) => routesOf(a).length);

// ---------- statický server, jeden port na web ----------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.xml': 'application/xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};
async function serve(root, port) {
  const srv = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let f = path.join(root, p);
      if ((await stat(f).catch(() => null))?.isDirectory()) f = path.join(f, 'index.html');
      if (!existsSync(f) && !path.extname(f)) f = path.join(root, p, 'index.html');
      const body = await readFile(f);
      res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('404');
    }
  });
  await new Promise((r) => srv.listen(port, '127.0.0.1', r));
  return srv;
}

// ---------- měření v prohlížeči ----------
/* eslint-disable */
/**
 * Uvést stránku do stavu, který uživatel skutečně vidí, jinak se měří něco
 * jiného, než co je na obrazovce:
 *  - scroll reveal drží nezobrazený obsah na opacity 0 a posunutý o 30px,
 *    takže bez tohohle se měří jen to nad ohybem a k tomu falešná přetečení,
 *  - obrázky s loading="lazy" se pod ohybem vůbec nenačtou a mají nulovou výšku,
 *  - běžící animace (log marquee) dělají z každého měření jiné číslo.
 */
async function settleInPage() {
  const s = document.createElement('style');
  s.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
  document.head.appendChild(s);
  document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible'));
  document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
  await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((res) => {
    i.addEventListener('load', res, { once: true });
    i.addEventListener('error', res, { once: true });
    setTimeout(res, 2000);
  })));
  if (document.fonts) await document.fonts.ready.catch(() => {});
}

function auditInPage(TAP_MIN) {
  const de = document.documentElement;
  const vw = de.clientWidth;

  /* Přetečení se MĚŘÍ PO PRVCÍCH, ne přes scrollWidth stránky.
     Dvě pasti, do kterých jsem cestou spadl:
     1) base.css má overflow-x: clip na html i body, takže scrollWidth stránky
        je vždycky rovný šířce okna a nic neprozradí,
     2) když tu pojistku pro měření vypnu, začne se hlásit i obsah, který má
        vlastní posuvný rám (srovnávací ceníková tabulka v .ptb__scroll).
        Ten za okraj kouká schválně a uživatel v něm swipuje.
     Platí tedy jediné měřítko: prvek, který leží za okrajem obsahu a NEMÁ nad
     sebou žádný posuvný ani zařezávající rodič. Takový obsah je nedostupný. */

  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    if (el.closest('[hidden], [aria-hidden="true"]')) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // Obsah, který je schválně zaříznutý nebo posouvatelný (log marquee, karusel,
  // tabulka v posuvném rámu), za okraj kouká záměrně a uživatel to nepozná.
  // Bez tohohle filtru hlásí audit stovky fantomů.
  const klipnuty = (el) => {
    let n = el.parentElement;
    while (n && n !== document.body) {
      if (getComputedStyle(n).overflowX !== 'visible') return true;
      n = n.parentElement;
    }
    return false;
  };
  const sel = (el) => {
    const c = (el.className || '').toString().trim().split(/\s+/).filter((x) => x && !x.startsWith('astro-') && !x.startsWith('data-')).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (c ? '.' + c : '');
  };

  // 1) co kouká za pravý okraj (nebo doleva mimo)
  const over = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    const right = Math.round(r.right - vw);
    const left = Math.round(r.left);
    if (right > 1 || left < -1) {
      if (klipnuty(el)) continue;
      // zajímá mě nejhlubší viník, ne celý řetěz rodičů
      const childAlsoOver = [...el.children].some((ch) => {
        if (!vis(ch)) return false;
        const cr = ch.getBoundingClientRect();
        return cr.right - vw > 1 || cr.left < -1;
      });
      if (childAlsoOver) continue;
      over.push({
        sel: sel(el), presah: Math.max(right, left < -1 ? -left : 0),
        vlevo: left < -1, sirka: Math.round(r.width),
        nowrap: getComputedStyle(el).whiteSpace.includes('nowrap'),
        text: (el.textContent || '').trim().slice(0, 40),
      });
    }
  }

  // 2) klikací plochy.
  // Měřítko je WCAG 2.5.8 (AA): nejmenší strana pod 24px je vada. 24 až 44 je
  // jen doporučení (Apple HIG a WCAG 2.5.5 AAA chtějí 44), hlásí se zvlášť,
  // ať se skutečné vady neutopí v preferencích. Logo a odkaz uvnitř odstavce
  // se neposuzují, výška textu není klikací plocha.
  const taps = [];
  for (const el of document.querySelectorAll('a, button, summary, input, select, textarea, [role="button"]')) {
    if (!vis(el)) continue;
    if (el.closest('.header__logo, .footer__logo')) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'inline' && el.closest('p, li, .prose, label')) continue;
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width), h = Math.round(r.height);
    const min = Math.min(w, h);
    if (min >= TAP_MIN) continue;
    taps.push({
      sel: sel(el), w, h, vada: min < 24,
      text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
    });
  }

  // 3) písmo. Formulářové pole pod 16px si iOS Safari sám přizoomuje a rozhodí
  // rozvržení, to je skutečná vada. Běžný text pod 12px je moc malý.
  const small = [];
  for (const el of document.querySelectorAll('input, select, textarea')) {
    if (!vis(el) || el.type === 'hidden') continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 16) small.push({ sel: sel(el), px: Math.round(fs * 10) / 10, vada: true, text: 'pole, iOS zoom' });
  }
  for (const el of document.querySelectorAll('p, li, td, th, label')) {
    if (!vis(el)) continue;
    const t = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 12);
    if (!t) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) small.push({ sel: sel(el), px: Math.round(fs * 10) / 10, vada: true, text: (el.textContent || '').trim().slice(0, 30) });
  }

  // 4) tabulky bez možnosti posunu
  const tables = [];
  for (const t of document.querySelectorAll('table')) {
    if (!vis(t)) continue;
    const holder = t.parentElement;
    const ox = holder ? getComputedStyle(holder).overflowX : 'visible';
    const potreba = Math.round(t.scrollWidth);
    if (potreba > vw + 1 && !['auto', 'scroll'].includes(ox)) tables.push({ sel: sel(t), potreba, ox });
  }

  const dedup = (arr, key) => {
    const m = new Map();
    for (const x of arr) { const k = key(x); if (!m.has(k)) m.set(k, { ...x, kolik: 1 }); else m.get(k).kolik++; }
    return [...m.values()];
  };
  const presahStranky = over.reduce((m, o) => Math.max(m, o.presah), 0);
  return {
    vw, docOverflow: presahStranky,
    over: dedup(over, (x) => x.sel + x.presah).sort((a, b) => b.presah - a.presah).slice(0, 12),
    taps: dedup(taps, (x) => x.sel + x.w + 'x' + x.h).slice(0, 20),
    small: dedup(small, (x) => x.sel + x.px).slice(0, 8),
    tables,
  };
}
/* eslint-enable */

// ---------- běh ----------
const puppeteer = (await import('puppeteer-core')).default;
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
});

const results = [];
let port = 4500;
for (const app of APPS) {
  const routes = routesOf(app);
  const p = port++;
  const srv = await serve(path.join(ROOT, 'apps', app, 'dist'), p);
  const page = await browser.newPage();
  page.on('pageerror', () => {});
  for (const w of WIDTHS) {
    const mobil = w < 768;
    await page.setViewport({ width: w, height: mobil ? 812 : 900, deviceScaleFactor: 2, isMobile: mobil, hasTouch: mobil });
    let i = 0;
    for (const r of routes) {
      // /styleguide je vnitřní katalog s noindex, schválně na něm stojí demo
      // vedle sebe. Do hodnocení webu nepatří.
      if (r.startsWith('/styleguide')) continue;
      await page.goto(`http://127.0.0.1:${p}${r}`, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
      await page.evaluate(settleInPage).catch(() => {});
      const res = await page.evaluate(auditInPage, mobil ? 44 : 32).catch((e) => ({ err: String(e) }));
      results.push({ app, route: r, w, ...res });
      i++;
      if (i % 10 === 0) process.stderr.write(`  ${app} @${w}: ${i}/${routes.length}\r`);
    }
    process.stderr.write(`  ${app} @${w}: ${routes.length}/${routes.length} hotovo\n`);
  }
  await page.close();
  srv.close();
}
await browser.close();

// ---------- výpis ----------
const bad = results.filter((r) => r.docOverflow > 1 || r.over?.length || r.taps?.length || r.small?.length || r.tables?.length);
console.log(`\nProjito ${results.length} měření (${APPS.length} webů, šířky ${WIDTHS.join(', ')}).`);
console.log(`Nálezy na ${bad.length} z nich.\n`);

const skupiny = new Map();
for (const r of bad) {
  for (const o of r.over ?? []) push(1, `PŘETEČENÍ ${o.presah}px  ${o.sel}${o.nowrap ? ' [nowrap]' : ''}`, r, o.text);
  for (const t of r.taps ?? []) push(t.vada ? 1 : 2, `PLOCHA ${t.w}x${t.h}  ${t.sel}`, r, t.text);
  for (const s of r.small ?? []) push(1, `PÍSMO ${s.px}px  ${s.sel}`, r, s.text);
  for (const t of r.tables ?? []) push(1, `TABULKA ${t.potreba}px bez posunu  ${t.sel}`, r, '');
  if (r.docOverflow > 1) push(1, `STRÁNKA PŘETÉKÁ o ${r.docOverflow}px`, r, '');
}
function push(vaha, key, r, text) {
  const k = `${r.w}|${key}`;
  if (!skupiny.has(k)) skupiny.set(k, { w: r.w, vaha, key, kde: [], text });
  skupiny.get(k).kde.push(`${r.app}${r.route}`);
}
for (const w of WIDTHS) {
  for (const [vaha, nazev] of [[1, 'VADY'], [2, 'DOPORUČENÍ (24 až 44px, WCAG 2.5.5 AAA)']]) {
    const g = [...skupiny.values()].filter((x) => x.w === w && x.vaha === vaha).sort((a, b) => b.kde.length - a.kde.length);
    if (!g.length) { console.log(`### ${w}px ${nazev}: nic\n`); continue; }
    console.log(`### ${w}px ${nazev} (${g.length} typů)`);
    for (const x of g) {
      console.log(`  ${x.key}  ${x.kde.length}x`);
      console.log(`      ${x.kde.slice(0, 5).join(' · ')}${x.kde.length > 5 ? ` … +${x.kde.length - 5}` : ''}`);
      if (x.text) console.log(`      text: "${x.text}"`);
    }
    console.log('');
  }
}
if (JSON_OUT) {
  const { writeFile } = await import('node:fs/promises');
  await writeFile(JSON_OUT, JSON.stringify(results, null, 1));
  console.log(`Surová data: ${JSON_OUT}`);
}
