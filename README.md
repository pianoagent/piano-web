# piano-web

Marketingové weby Piano — Astro (statický výstup), nasazované přes Cloudflare Pages.

## Stack
- **Astro** — statický generátor, obsah jako `.md`, sdílené komponenty + témata per web
- **GitHub** — zdroj pravdy, schvalování přes Pull Requesty
- **Cloudflare Pages** — build z `main` → produkce, každý PR → preview URL
- **Formuláře** — Cloudflare funkce → Odoo CRM (`crm.lead`)

## Cloudflare build nastavení
- Build command: `npm run build`
- Output directory: `dist`

## Lokální vývoj
```bash
npm install
npm run dev
```

## Workflow
1. Změna vzniká na vedlejší větvi → Pull Request
2. Cloudflare automaticky postaví preview URL
3. Kryštof schválí → merge do `main` → nasazení naostro
