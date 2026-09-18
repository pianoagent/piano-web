// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://piano.cz',
  output: 'static',          // stránky statické; /api/lead je on-demand (prerender=false)
  adapter: cloudflare(),
  // Vícejazyčnost: čeština v rootu (/), angličtina pod /en/ (stránky v src/pages/en/).
  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // Stránky s noindex vynechat ze sitemapy, ať si signály neodporují:
    // kalkulačka pro obchodníky, děkovací stránka, rezervace (nespuštěný produkt)
    // a 404. České /404 vynechá Astro samo, /en/404 ne, proto je tu taky.
    sitemap({
      filter: (page) => !/\/(kalkulacka-terminal|dekujeme|kukatko-vseobecne-obchodni-podminky|rezervace|404)\/?$/.test(page),
    }),
    // Lokální brandové SVG: src/icons/nazev.svg → name="nazev"
    // Sada Lucide jako zásoba → name="lucide:check"
    icon({ iconDir: 'src/icons' }),
  ],
});
