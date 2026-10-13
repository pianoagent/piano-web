// @ts-check
import { defineConfig } from 'astro/config';

// Kopie živého hugopos.eu 1:1 (weby/podklady-migrace/port-hugo.py).
// sitemap.xml je převzatá ze živého webu (public/sitemap.xml, s hreflang), proto bez @astrojs/sitemap.
export default defineConfig({
  site: 'https://hugopos.eu',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  // skripty přes ?url vždy jako samostatné soubory s hashem (ne data: URI u malých souborů)
  vite: { build: { assetsInlineLimit: 0 } },
});
