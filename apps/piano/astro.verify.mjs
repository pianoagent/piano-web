import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  outDir: '/tmp/piano-verify-dist',
  i18n: { defaultLocale: 'cs', locales: ['cs','en'], routing: { prefixDefaultLocale: false } },
});
