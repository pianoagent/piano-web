// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/* Septim: kopie živého www.septim.cz 1:1 (URL, obsah, vzhled).
   URL bez koncového lomítka a bez .html, stejně jako na Solid Pixels:
   build.format 'file' → /produkty/pokladna.html, Cloudflare Pages ji servíruje jako /produkty/pokladna. */
export default defineConfig({
  site: 'https://www.septim.cz',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  trailingSlash: 'never',
  server: { port: Number(process.env.PORT) || 4351 },
  build: { format: 'file' },
  i18n: {
    locales: ['cs', 'en', 'sk'],
    defaultLocale: 'cs',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // mimo sitemapu: děkovací stránka, 404 a případovky, které jsou i na živém webu noindex
      filter: (page) => !/\/(dekujeme|404|kolkovna\/1x-jidelna|kolkovna\/2x-bistro)(\.html)?$/.test(page),
      serialize: (item) => ({ ...item, url: item.url.replace(/\.html$/, '').replace(/\/$/, '') || item.url }),
    }),
  ],
});
