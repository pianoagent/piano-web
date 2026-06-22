// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://piano.cz',
  integrations: [
    sitemap(),
    // Lokální brandové SVG: src/icons/nazev.svg → name="nazev"
    // Sada Lucide jako zásoba → name="lucide:check"
    icon({ iconDir: 'src/icons' }),
  ],
});
