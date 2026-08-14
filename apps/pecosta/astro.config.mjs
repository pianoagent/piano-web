// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://pecosta.cz',
  integrations: [
    sitemap(),
    icon({ iconDir: 'src/icons' }),
  ],
});
