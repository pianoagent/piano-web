// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://pecosta.cz',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  // Pojistka k 301 v public/.htaccess (segmenty přeskládané 30. 9. 2026)
  redirects: {
    '/pro-koho/jidelny-a-kantyny': '/pro-koho/jidelny-kantyny-a-skoly',
    '/pro-koho/skoly-a-nemocnice': '/pro-koho/socialni-sluzby-a-nemocnice',
  },
  integrations: [
    sitemap(),
    icon({ iconDir: 'src/icons' }),
  ],
});
