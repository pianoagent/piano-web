// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://savarin.cz',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  // Obrázky: rastry dávej do src/assets a renderuj přes <Image>/<Picture>
  // z 'astro:assets'. Astro je optimalizuje přes sharp a generuje moderní
  // formáty (WebP) automaticky, viz src/assets/README.md.
  image: {
    // sharp je výchozí služba; <Picture formats={['webp']} /> vynutí WebP.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [
    // Ze sitemapy ven stránky s noindex (dekujeme, ochrana-udaju, 404), jinak je
    // Search Console hlásí jako „odeslaná URL označená jako noindex".
    sitemap({ filter: (page) => !/\/(dekujeme|ochrana-udaju|404)\/?$/.test(page) }),
    icon({ iconDir: 'src/icons' }),
  ],
});
