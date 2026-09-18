# piano-web

Marketingové weby Piano, Astro se statickým výstupem (`output: 'static'`; výjimkou je endpoint `/api/lead`, který má `prerender = false`). Monorepo: `apps/` (weby), `packages/` (sdílené komponenty a konfigurace), `scripts/` (kontroly).

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
| `protel`, `qerko`, `septim`, `savarin`, `harsys`, `pecosta` | vlastní domény | Cloudflare Pages napojený na git |
| `grason` | grason.cz | AWS Amplify (`apps/grason/amplify.yml`), zároveň má i Cloudflare projekt |
| `hugo` | zatím nikde | prototyp; `site` i `wrangler.jsonc` už existují, ale web se nepublikuje. Živý Hugo běží na hugopos.eu / hugopos.cz mimo tohle repo |

**Piano a eet2027 tedy na produkci nejedou přes Cloudflare.** Oba workflow spouští push do `main`, ale jsou **path filtrované** (`apps/<app>/**`, `packages/**`, `package*.json`, vlastní soubor workflow), takže merge, který sáhne jen na README, nenasadí nic. Oba jdou spustit i ručně přes `workflow_dispatch`.

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
- **Astro**, statický generátor, obsah jako `.md`, sdílené komponenty a témata per web
- **GitHub**, zdroj pravdy: vývoj na `develop`, produkce `main`
- **Formuláře**, `LeadForm` posílá POST na `/api/lead.php`. Na Webglobe to obslouží PHP `mail()` (adresát v konstantě `LEAD_TO`), na Cloudflare běží varianta `src/pages/api/lead.ts` přes Resend. **Napojení na Odoo `crm.lead` zatím neexistuje**, je to TODO v obou souborech.

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
