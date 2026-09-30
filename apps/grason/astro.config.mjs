// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://grason.cz',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  compressHTML: true,
  // Old grason.cz URLs (Nuxt web, grason-web repo), linked from grason-api
  // e-mails and SMS. Static build emits a meta-refresh page per path, so it
  // works on any hosting. /f/* short links are handled in 404.astro.
  redirects: {
    '/obchodni-podminky': '/flexi/obchodni-podminky/',
    '/ochrana-osobnich-udaju': '/flexi/gdpr/',
    '/pravidla-ochrany-osobnich-udaju': '/flexi/gdpr/',
    '/plan/ochrana-osobnich-udaju': '/plan/gdpr/',
    '/plan/pravidla-ochrany-osobnich-udaju': '/plan/gdpr/',
    '/nejcastejsi-dotazy-pracovnici': '/faq-grason/',
    '/nejcastejsi-dotazy-podniky': '/faq-companies/',
    '/volna-mista': '/nabidky-zamestnani/',
    '/pravidla-souteze': '/pro-brigadniky/',
    '/download': '/stahnout/',
    // Legacy redirects carried over from grason-web config/redirects.js
    '/pro-restaurace': '/pro-firmy/',
    '/grason-plan': '/plan/',
    '/cenik': '/pro-firmy/',
    '/hledam-personal': '/pro-firmy/',
    '/nejcastejsi-dotazy-pro-zamestnavatele': '/faq-companies/',
    '/chci-pracovat': '/pro-brigadniky/',
    '/hledam-praci': '/pro-brigadniky/',
    '/nejcastejsi-dotazy-pro-grasony': '/faq-grason/',
    '/ukraine': '/pro-brigadniky/',
    // App short links: grsn.cz does the device detection (store / web)
    '/a': 'https://www.grsn.cz/a',
    '/b': 'https://www.grsn.cz/b',
    '/m': 'https://www.grsn.cz/m',
    '/p': 'https://www.grsn.cz/p',
  },
  integrations: [
    sitemap({ filter: (page) => !page.endsWith('/stahnout/') && !page.endsWith('/nabidky-zamestnani/detail/') }),
    icon({ iconDir: 'src/icons' }),
  ],
});
