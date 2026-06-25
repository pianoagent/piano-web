# piano-web

Marketingové weby Piano — Astro (statický výstup), nasazované přes Cloudflare Pages.

## ⚠️ Větve / workflow
- **`develop` = pracovní větev. Veškerá práce (vč. Cowork/AI vláken) jde sem.** Cloudflare ji automaticky buildí do **preview** (`*.pages.dev`).
- **`main` = produkce** (piano.cz). Cloudflare ji **nebuildí automaticky** — nasazuje se ručně (merge `develop` → `main` + `wrangler pages deploy … --branch=main`). Do `main` se přímo nepushuje.

## Stack
- **Astro** — statický generátor, obsah jako `.md`, sdílené komponenty + témata per web
- **GitHub** — zdroj pravdy; vývoj na `develop`, produkce `main`
- **Cloudflare Pages** — `develop` → preview, `main` → produkce (ruční deploy)
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
