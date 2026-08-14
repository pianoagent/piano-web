# Jak přidat novinku do sekce „Aktuálně"

Každá novinka = jeden soubor `.md` v této složce (`src/content/aktualne/`).
Po přidání a nasazení (push do gitu → Cloudflare build) se sama objeví na `/aktualne`,
seřazená od nejnovější.

## Postup

1. Vytvoř nový soubor, např. `2025-01-15-nova-verze-recepce.md`
   (název souboru nevadí, ale datum v názvu pomáhá s přehledem).
2. Na začátek vlož „frontmatter" mezi `---` a napiš text pod něj:

```markdown
---
title: "Nová verze modulu Recepce"
date: 2025-01-15
---

Text novinky. Můžeš psát běžný text, **tučně**, odkazy [takto](https://savarin.cz)
i odrážky:

- první bod
- druhý bod
```

## Pole

- `title`, nadpis novinky (povinné)
- `date`, datum ve formátu `RRRR-MM-DD` (povinné, řadí se podle něj)
- `draft: true`, volitelné; skryje novinku (rozepsaná, nezveřejní se)

Nic dalšího není potřeba, žádný kód se needituje.
