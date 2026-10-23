#!/usr/bin/env node
/**
 * Kontrola měření po buildu (BLOKUJÍCÍ).
 *   node scripts/check-gtm.mjs [dist…]   bez argumentu kontroluje ./dist
 *
 * Každá HTML stránka v buildu musí načítat GTM kontejner skupiny. Bez něj web nesmí jít
 * na produkci: 26. 9. 2026 šel live nový pecosta.cz a 8. 10. grason.cz bez GTM a GA4 je
 * týdny skoro neviděla. Proto běží v každém deploy-<web>.yml mezi buildem a FTP a při
 * nálezu deploy zastaví. Nový deploy workflow ho musí mít taky.
 *
 * Výjimka: čistě přesměrovací stránky (meta refresh nebo location.replace) se nekontrolují,
 * nic se na nich nezobrazí a měřit je nemá smysl.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const GTM_ID = 'GTM-NC3PW2KC';
const GTM_SRC = 'googletagmanager.com/gtm.js';
const REDIRECT = /http-equiv=["']?refresh|location\.replace\(/i;

const roots = (process.argv.length > 2 ? process.argv.slice(2) : ['dist']).map((d) => resolve(d));

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === '_worker.js' || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

let checked = 0;
const missing = [];
for (const root of roots) {
  if (!existsSync(root)) {
    console.error(`✗ Kontrola GTM: složka ${root} neexistuje.`);
    process.exit(1);
  }
  for (const f of htmlFiles(root)) {
    const html = readFileSync(f, 'utf8');
    if (REDIRECT.test(html) && !html.includes(GTM_SRC)) continue;
    checked++;
    if (!html.includes(GTM_SRC) || !html.includes(GTM_ID)) missing.push(relative(process.cwd(), f));
  }
}

if (missing.length) {
  console.error(`✗ Kontrola GTM: ${missing.length} z ${checked} stránek nenačítá ${GTM_ID}. Web bez měření nesmí jít live.`);
  for (const f of missing.slice(0, 20)) console.error(`  ${f}`);
  if (missing.length > 20) console.error(`  … a dalších ${missing.length - 20}`);
  console.error('  Oprava: GTM snippet do <head> a noscript do <body> v layoutu webu (vzor: apps/piano/src/layouts/Base.astro).');
  process.exit(1);
}
if (!checked) {
  console.error('✗ Kontrola GTM: v buildu není žádná HTML stránka.');
  process.exit(1);
}
console.log(`✓ Kontrola GTM: všech ${checked} stránek načítá ${GTM_ID}.`);
