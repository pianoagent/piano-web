// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://savarin.cz',
  // Obrázky: rastry dávej do src/assets a renderuj přes <Image>/<Picture>
  // z 'astro:assets'. Astro je optimalizuje přes sharp a generuje moderní
  // formáty (WebP) automaticky — viz src/assets/README.md.
  image: {
    // sharp je výchozí služba; <Picture formats={['webp']} /> vynutí WebP.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [
    sitemap(),
    icon({ iconDir: 'src/icons' }),
  ],
});
