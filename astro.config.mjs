// @ts-check
import { defineConfig } from 'astro/config';

// Statický web — Cloudflare Pages servíruje výstup z ./dist
// Build command: npm run build   |   Output dir: dist
export default defineConfig({
  // až budou hotové domény, doplníme sem 'site' kvůli sitemapě a kanonickým URL
  // site: 'https://piano.cz',
});
