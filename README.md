# piano-web

Marketingové weby Piano, Astro se statickým výstupem (`output: 'static'`). Monorepo: `apps/` (weby), `packages/` (sdílené komponenty a konfigurace), `scripts/` (kontroly).

## ⚠️ Větve / workflow
- **`develop` = pracovní větev. Veškerá práce (vč. Cowork/AI vláken) jde sem.** Cloudflare z ní staví preview.
- **`main` = produkce.** Do `main` se přímo nepushuje, jde tam jen merge z `develop` na výslovné zadání.
- **Nikdy cherry-pick, vždy merge.** Cherry-pick obě větve rozjede: vzniknou stejné zprávy s jinými hashi a pak se nedá poznat, co na produkci opravdu je.

## Kde se web nasazuje
Nasazení není pro všechny weby stejné, pozor na to.

| App | Produkce | Jak se nasazuje |
|---|---|---|
| `piano` | piano.cz | GitHub Actions `deploy-piano.yml`, **FTP na Webglobe** |
| `eet2027` | eet2027.cz | GitHub Actions `deploy-eet2027.yml`, **FTP na Webglobe** |
| `pecosta` | pecosta.cz | GitHub Actions `deploy-pecosta.yml`, **FTP na Webglobe** |
| `protel`, `qerko`, `septim`, `savarin`, `harsys` | vlastní domény | Cloudflare Pages napojený na git |
| `grason` | grason.cz | AWS Amplify (`apps/grason/amplify.yml`), zároveň má i Cloudflare projekt |
| `hugo` | zatím nikde | prototyp; `site` i `wrangler.jsonc` už existují, ale web se nepublikuje. Živý Hugo běží na hugopos.eu / hugopos.cz mimo tohle repo |

**Piano, eet2027 a pecosta tedy na produkci nejedou přes Cloudflare.** Všechny tři workflow spouští push do `main`, ale jsou **path filtrované** (`apps/<app>/**`, `packages/**`, `package*.json`, vlastní soubor workflow), takže merge, který sáhne jen na README, nenasadí nic. Všechny jdou spustit i ručně přes `workflow_dispatch`.

## Kde si změnu prohlédnout

| App | Preview z `develop` | Produkční alias Cloudflare projektu |
|---|---|---|
| `piano` | https://develop.piano-web-1ts.pages.dev/ | https://piano-web-1ts.pages.dev/ |
| `protel`, `qerko`, `septim`, `savarin`, `harsys`, `pecosta`, `grason` | `https://develop.<app>-web.pages.dev/` | `https://<app>-web.pages.dev/` |
| `eet2027` | není, projekt `eet-web` preview z `develop` nestaví | https://eet-web.pages.dev/ |

**Produkční alias není preview.** Staví se z `main`, takže když v něm nevidíš čerstvou změnu z `develop`, je to správně. Tohle je nejčastější záměna, alias bez prefixu vypadá jako náhled, ale ukazuje produkci.

Lokálně: `npm run dev:piano` pustí Astro dev server, který čte přímo ze `src`. `npm run preview:piano` servíruje poslední build ve `dist`, takže může být zastaralý.

Názvy Cloudflare projektů výše jsou ty skutečné, ověřené proti živým `*.pages.dev`. `wrangler.jsonc` v každé appce deklaruje **jiný** název (`piano-web-<app>`), který žádnému existujícímu projektu neodpovídá. Nepouštěj podle něj `wrangler pages deploy`, založil bys tím prázdné projekty vedle živých.

## Stack
- **Astro 7**, statický generátor, obsah jako `.md`, sdílené komponenty a témata per web
- **GitHub**, zdroj pravdy: vývoj na `develop`, produkce `main`
- **Formuláře**, `LeadForm` posílá POST na `/api/lead.php`. Na Webglobe to obslouží PHP `mail()` (adresát v konstantě `LEAD_TO`). Na Cloudflare preview se PHP nespustí, takže tam formuláře nefungují. **Napojení na Odoo `crm.lead` zatím neexistuje**, je to TODO v `lead.php`.

## Septim: kopie živého webu 1:1
`apps/septim` je od 24. 9. 2026 věrná kopie živého www.septim.cz (Solid Pixels), aby šel web přepnout bez přesměrování: **stejné URL** (bez lomítka a bez `.html`, `build.format: 'file'`), stejný obsah i vzhled. Předchozí redesign (nová IA) je v tagu `septim-redesign-2026-09` a větvi `septim-redesign`.

- **Jak vzniká.** Stránky, sdílené bloky (`src/components/blocks`), hlavička a patička (`src/components/chrome`) a `src/styles/live.css` generuje skript `weby/podklady-migrace/port-septim.py` z čerstvého HTML živého webu (`podklady-migrace/scrapy-starych-webu/septim-2026-09/`). Opravy proti živému webu (404 odkazy, překlepy, jedna H1, alt texty, meta) jsou v tabulkách na začátku skriptu. **Po ručních úpravách stránek skript znovu nepouštěj**, přepsal by je.
- **Vzhled.** `live.css` je zkompilované CSS živého webu, needituj ho. Úpravy patří do `src/styles/overrides.css`.
- **Chování.** Menu, taby, slider, akordeony, kotvy a formuláře řeší `public/js/septim.js` (náhrada JavaScriptu CMS).
- **Formuláře.** Všechny formuláře jdou na `public/api/lead.php` (PHP `mail()` na poptavky@piano.cz, přílohy z kariérních formulářů jako přílohy e-mailu), pak na `/dekujeme`. Na Cloudflare preview PHP neběží, formuláře tam vrátí chybu.
- **Jazyky.** Zatím jen CZ. EN a SK se doplní během skriptu s `--locale en|sk` a zapnutím v `src/i18n/config.ts` (`enabledLocales`). Mapa přeložených URL ze živého přepínače jazyků je v `src/i18n/routes.cs.json`.
- **Měření.** GTM `GTM-NC3PW2KC`, Cookiebot se načítá přes GTM jako na živém webu.

## Lokální vývoj
```bash
npm install
npm run dev:piano
```

Skripty jsou vždy per app, `npm run dev` / `npm run build` v rootu **neexistují**:
`dev:<app>`, `build:<app>`, `preview:<app>` pro `piano`, `septim`, `qerko`, `grason`, `savarin`, `harsys`, `pecosta`, `protel`, `hugo`, `eet2027`.

## Před commitem
1. Agentní review podle `agenti/prompty/predcommit-review.md` (SEO / UX-mobil / copy / brand). Soubor leží mimo tohle repo, ve složce Piano.
2. `node scripts/check-web.mjs --audit <soubory>` (poradní, nic neblokuje)
3. Build dotčených webů. Když je změna v `packages/`, dotýká se všech deseti.
4. Commit a push do `develop`

Pre-commit hook (`scripts/git-hooks/pre-commit`) navíc **blokuje em-pomlčky** v měněných souborech. Aktivuje ho skript `prepare`, tedy až `npm install`. Kdo repo naklonuje a neinstaluje, jede bez pojistky.

## Skryté stránky
Stránka, která se má stavět, ale nemá být dohledatelná, má `noindex={true}` na `<Base>`, není nikde prolinkovaná a filtr sitemapy v `apps/piano/astro.config.mjs` ji vynechává. **Pořád je ale veřejná na přímé URL**, jen není v indexu ani v navigaci. Kdo potřebuje víc, přidá gate jako `kalkulacka-terminal.astro`.

Dnes takto: `kalkulacka-terminal`, `dekujeme`, `kukatko-vseobecne-obchodni-podminky`, `rezervace` (nespuštěný produkt), `404`.

`kukatko-…` je historický název souboru z doby před přejmenováním na Piano Pilot. Značka Kukátko se nepoužívá, ale URL je živá, takže soubor nepřejmenovávej bez redirectu.
