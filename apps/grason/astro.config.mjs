// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://grason.cz',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  integrations: [
    sitemap({ filter: (page) => !page.endsWith('/stahnout/') && !page.endsWith('/nabidky-zamestnani/detail/') }),
    icon({ iconDir: 'src/icons' }),
  ],
});
