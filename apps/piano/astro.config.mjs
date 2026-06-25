// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://piano.cz',
  output: 'static',          // stránky statické; /api/lead je on-demand (prerender=false)
  adapter: cloudflare(),
  integrations: [
    sitemap(),
    // Lokální brandové SVG: src/icons/nazev.svg → name="nazev"
    // Sada Lucide jako zásoba → name="lucide:check"
    icon({ iconDir: 'src/icons' }),
  ],
});
