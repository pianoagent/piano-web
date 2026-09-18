# Zdroje grafik do článků

Grafiky v `apps/piano/public/images/blog/` nejsou kreslené v designovém nástroji, jsou to
HTML stránky vyrenderované headless Chromem. Zdroj je tady, ať se příště nekreslí od nuly.

## Jak z HTML udělat webp

```bash
# 1) fonty: v HTML nahraď FONTS/ absolutní cestou k apps/piano/public/fonts
#    (Chrome z file:// nenačte @font-face přes relativní cestu do jiné složky)
# 2) render ve 2x kvůli ostrosti textu, rozměr okna = rozměr grafiky
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1000,800 \
  --screenshot=osa.png "file://$PWD/scripts/grafiky/eet-2-0-casova-osa.html"

# 3) zmenšení na cílový rozměr a převod do webp
node -e "require('sharp')('osa.png').resize(1000,800,{kernel:'lanczos3'}).webp({quality:92})
  .toFile('apps/piano/public/images/blog/eet-2-0-casova-osa.webp')"
```

## Na co si dát pozor

- **Čitelnost na mobilu rozhoduje o rozměru plátna.** Obrázek v článku leží v `.prose`
  (max 720 px), na telefonu vychází na zhruba 327 px. Text se tedy zmenší v poměru
  327 / šířka plátna. Při plátně 1000 px je písmo 38 px na mobilu 12 CSS px, což se ještě
  přečte. Při plátně 1600 px by to bylo 8 CSS px a nepřečetl by to nikdo. Proto jsou obě
  grafiky na výšku, ne na šířku.
- **Barvy podle `contexty/brand/BRAND.md`:** karmínová `#B8093B` jen text, ikony a obrysy,
  tmavá vínová `#94002A` jen plocha, na vínové se píše teplou bílou `#FEF4E6` nebo bílou.
- **Obsah musí sedět se stránkou `/eet`.** Formulace v grafice „5 rozdílů" jsou převzaté
  z pole `compare` v `apps/piano/src/pages/eet.astro`, časová osa z pole `timeline`.
  Když se mění tam, musí se překreslit i tady, jinak si web odporuje.
