# piano-web: pokyny pro agenty

Obecné informace o repu (větve, nasazení, stack) jsou v `README.md`.

## Obrázky: vždy přes `Img.astro`

Rastrové obrázky (webp/jpg/png) se optimalizují při buildu na AVIF + WebP se srcsetem. Aby to fungovalo, drž se tohoto:

- **Soubor patří do `apps/<web>/src/assets/images/`**, ne do `public/`. Odkazuje se na něj cestou `/images/…` (např. `/images/tym.webp`), komponenta si ji sama přemapuje na `src/assets/images/tym.webp`.
- **Nikdy nepiš holé `<img>`** pro obrázek webu. Použij:
  ```astro
  import Img from '@piano/ui/components/Img.astro';
  <Img src="/images/tym.webp" alt="…" width={880} sizes="(min-width: 881px) 560px, 100vw" />
  ```
  - `width` = největší šířka v CSS px, na které se obrázek na webu zobrazí (ne rozměr souboru). Varianty se generují v ½×, 1× a 2× a nikdy nejsou větší než zdroj.
  - `sizes` nastav podle layoutu, když default `(min-width: {width}px) {width}px, 100vw` nesedí. Malé fixní obrázky (avatary, ikonky): `sizes="52px"`.
  - Obrázek nad ohybem (hero, LCP): `loading="eager" fetchpriority="high"`. Jinak nech default (lazy).
- **Sdílené komponenty** `Hero` (slides), `Split` (image), `USPGrid` (item.image), `Testimonials` (photo), `PostGrid` a `ArticleDetail` už `Img` používají. Stačí jim předat string `/images/…`.
- **`LogoWall`**: rastrová loga referencí dej do `src/assets/images/logos/<name>.<ext>`, komponenta je vykreslí přes `<Picture>` v 1× a 2× výšky pruhu. SVG loga zůstávají v `public/logos`.
- **Markdown články**: obrázky v `.md` (i holé `<img>` v textu) převádí `optimizeHtmlImages()` z `@piano/ui/lib/images`. Detail článku renderuje `post.rendered.html` přes tuhle funkci místo `<Content />`. Nový blog/content collection napoj stejně (vzor: `apps/pecosta/src/pages/novinky/[...slug].astro`).
- **og:image a JSON-LD** potřebují URL, ne `<picture>`: `getImage({ src: findImage(path), width: 1200, format: 'jpg' })` z `astro:assets` a `new URL(result.src, Astro.site).href`.
- **V `public/` nechávej jen soubory, které musí mít pevnou URL**: CSS `url()`, `poster` u videa, výchozí `og-default.jpg`, SVG loga v `/logos`, SVG. Tyhle se neoptimalizují.
- **Do `src/assets/images/` nedávej nepoužité soubory.** Glob v `images.ts` je načítá všechny a Astro by nepoužité zkopírovalo do buildu jako neoptimalizované originály.
- **Nečti vlastnosti `ImageMetadata`** (`.width`, `.src`…) mimo `Img`/`getImage`: Astro pak do buildu přibalí i originál.
- `<Img>` obaluje `<img>` do `<picture>`: selektory `.x > img` nesedí (použij `.x img`) a pokud je obrázek flex/grid item, dej `img` `display: block`, jinak pod ním vznikne mezera.

Kontrola po změně obrázků: build projde, `grep -rn 'src="/images/' apps/<web>/dist` nic nenajde (kromě souborů záměrně v `public/`) a v `dist/_astro` nejsou originály ve tvaru `jmeno.HASH.webp` bez `_` sufixu.

Výjimka: Septim (`apps/septim`) a Protel (`apps/protel`) jsou kopie živých webů 1:1 s vlastním srcsetem v `public/files`, tam `Img` nepoužívej.
