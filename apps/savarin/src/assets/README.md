# Obrázky (src/assets) → WebP

Rastrové obrázky (foto, screenshoty, ilustrace) ukládej **sem do `src/assets/`**, ne do `public/`.
Astro je při buildu provede pipeline přes `sharp` a vygeneruje optimalizovaný **WebP**
(s rozměry, lazy-loadingem a cache-busting hashem).

## Jak použít

```astro
---
import { Image, Picture } from 'astro:assets';
import hero from '../assets/hero-pokladna.jpg';
---

<!-- Jeden optimalizovaný obrázek (Astro zvolí WebP, kde to dává smysl) -->
<Image src={hero} alt="Pokladna Savarin" width={720} height={560} />

<!-- Explicitně WebP + fallback -->
<Picture src={hero} formats={['webp']} alt="Pokladna Savarin" width={720} height={560} />
```

## Pravidla

- `public/` = soubory servírované 1:1 bez konverze (loga SVG, favicon, robots.txt, og obrázek).
  Sem patří jen to, co se **nemá** optimalizovat (typicky vektory).
- `src/assets/` = rastry, které projdou optimalizací do WebP.
- SVG (logo) a CSS placeholdery (hero „účtenka"/POS) konverzi nepotřebují.

Konfigurace služby je v `astro.config.mjs` (`image.service` = sharp).
