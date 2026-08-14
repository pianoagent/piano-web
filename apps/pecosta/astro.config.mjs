// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://pecosta.cz',
  integrations: [
    // /styleguide je interni katalog komponent, do sitemapy nepatri
    sitemap({ filter: (page) => !page.includes('/styleguide') }),
    icon({ iconDir: 'src/icons' }),
  ],
});
