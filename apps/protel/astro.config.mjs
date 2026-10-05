// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import purgeLiveCss from './integrations/purge-live-css.mjs';

/* Protel: kopie živého www.protelsystems.cz 1:1 (URL, obsah, vzhled), CZ + SK.
   URL bez koncového lomítka a bez .html, stejně jako na Solid Pixels:
   build.format 'file' → /produkty/kiosek.html, Cloudflare Pages ji servíruje jako /produkty/kiosek.
   Staré adresy živého webu přesměrovává public/_redirects. */
export default defineConfig({
  site: 'https://www.protelsystems.cz',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  trailingSlash: 'never',
  server: { port: Number(process.env.PORT) || 4381 },
  build: { format: 'file' },
  i18n: {
    locales: ['cs', 'sk'],
    defaultLocale: 'cs',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // mimo sitemapu: děkovací stránky, 404 a právní stránky, které mají noindex i na živém webu
      filter: (page) => !/\/(dekujeme|dakujeme|404|informace-o-zpracovani-cookies|podminky-o-zpracovani-osobnich-udaju-formular|informacie-o-spracovani-cookies|podmienky-spracovania-osobnych-udajov-formular)(\.html)?$/.test(page),
      serialize: (item) => ({ ...item, url: item.url.replace(/\.html$/, '').replace(/\/$/, '') || item.url }),
    }),
    // zmenšení převzatého CSS Solid Pixels na pravidla, která stránky opravdu používají
    purgeLiveCss(),
  ],
});
