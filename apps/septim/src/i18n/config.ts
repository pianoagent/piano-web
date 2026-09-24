/**
 * Jazyky webu Septim. Živý web má CZ, EN a SK s rozdílnými slugy
 * (např. /produkty/pokladna ↔ /en/products/checkout). Mapa se generuje
 * z přepínače jazyků živého webu (port-septim.py → routes.<locale>.json).
 *
 * EN a SK zatím nejsou portované. Až budou (port-septim.py --locale en|sk),
 * stačí je přidat do enabledLocales: zapne se hreflang i přepínač jazyka.
 */
import routesCs from './routes.cs.json';

export const locales = ['cs', 'en', 'sk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'cs';
export const enabledLocales: Locale[] = ['cs'];

export const SITE_URL = 'https://www.septim.cz';

export const localeLabels: Record<Locale, { short: string; title: string; og: string }> = {
  cs: { short: 'CZ', title: 'Český', og: 'cs_CZ' },
  en: { short: 'EN', title: 'English', og: 'en_US' },
  sk: { short: 'SK', title: 'Slovenský', og: 'sk_SK' },
};

type RouteMap = Record<string, Partial<Record<Locale, string>>>;
const routes: Record<Locale, RouteMap> = { cs: routesCs as RouteMap, en: {}, sk: {} };

/** Cesty jazykových mutací stránky (jen pro zapnuté jazyky, včetně samotné stránky). */
export function translations(path: string, locale: Locale = defaultLocale): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = { [locale]: path };
  const map = routes[locale]?.[path] ?? {};
  for (const l of enabledLocales) {
    if (l !== locale && map[l]) out[l] = map[l];
  }
  return out;
}

/** hreflang alternates pro BaseHead (prázdné, dokud je zapnutý jen jeden jazyk). */
export function alternates(path: string, locale: Locale = defaultLocale) {
  if (enabledLocales.length < 2) return [];
  const t = translations(path, locale);
  const list = Object.entries(t).map(([lang, href]) => ({ lang, href: new URL(href!, SITE_URL).href }));
  const def = t[defaultLocale];
  if (def) list.push({ lang: 'x-default', href: new URL(def, SITE_URL).href });
  return list;
}
