// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://hugopos.eu',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  integrations: [
    sitemap({ filter: (page) => !page.includes('/dekujeme') }),
    icon({ iconDir: 'src/icons' }),
  ],
});
