/**
 * Po buildu zmenší CSS Septimu: live.css je celé zkompilované CSS Solid Pixels
 * (asi 300 kB), stránky z něj používají jen zlomek. PurgeCSS projde vygenerované
 * HTML a JS v dist a nechá jen použitá pravidla.
 *
 * Třídy, které přidává až JavaScript (public/js/septim.js, Cookiebot), nejsou
 * v HTML vidět, proto jsou v safelistu. Když přibude stavová třída v septim.js,
 * přidej ji sem, jinak zmizí její styly.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PurgeCSS } from 'purgecss';

const SAFELIST = {
  standard: [
    'js', 'no-js', 'touch', 'no-touch', 'open', 'active', 'show-header', 'shown-header',
    'in-viewport', 'header-inverse', 'lead-form-error', 'h1-style', 'h2-style',
    // stavové třídy z septim.js (menu, slider, akordeon, taby, scroll, načtení obrázků)
    'is-opened', 'is-collapsed', 'is-menu-open', 'is-loaded', 'is-active', 'is-page-loaded', 'is-hero-loaded',
    'is-after-start', 'is-after-menu', 'is-before-hero', 'is-after-hero', 'is-scrolling-down',
    'menu-type-lg-priority', 'menu-type-overlay', 'accordion--is-opened', 'accordion--is-opening',
    'gallery-slider-initialized', 'gallery-slider-horizontal', 'gallery-slider-item-active',
    'slider-pager', 'slider-btn-prev', 'slider-btn-next', 'swiper-pagination-bullets',
    'swiper-pagination-clickable', 'swiper-pagination-bullet', 'swiper-pagination-bullet-active',
    'cssicon--chevron-left', 'cssicon--chevron-right', 'is-hidden', 'mega-item', 'is-mega-active', 'has-mega',
  ],
};

export default function purgeLiveCss() {
  return {
    name: 'septim:purge-live-css',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const results = await new PurgeCSS().purge({
          content: [`${root}**/*.html`, `${root}_astro/*.js`],
          css: [`${root}_astro/*.css`],
          safelist: SAFELIST,
          keyframes: false,
          fontFace: false,
          variables: false,
        });
        let before = 0, after = 0;
        for (const r of results) {
          if (!r.file) continue;
          before += (await readFile(r.file)).length;
          after += Buffer.byteLength(r.css);
          await writeFile(r.file, r.css);
        }
        logger.info(`CSS zmenšeno z ${Math.round(before / 1024)} kB na ${Math.round(after / 1024)} kB`);
      },
    },
  };
}
