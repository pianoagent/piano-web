// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://eet2027.cz',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  integrations: [
    // Dekovaci stranky jsou noindex, do sitemapy nepatri.
    sitemap({ filter: (page) => !page.includes('/dekujeme') }),
    icon({ iconDir: 'src/icons' }),
  ],
});
