/**
 * Jazyky webu Protel. Živý web má CZ a SK s rozdílnými slugy
 * (např. /digitalni-recepce ↔ /sk/digitalna-recepcia). Mapa se generuje
 * z přepínače jazyků živého webu (port-protel.py → routes.<locale>.json).
 *
 * Stránka, která na živém webu protějšek nemá, má v přepínači odkaz na úvodní
 * stránku druhého jazyka. Do hreflang jdou jen dvojice, které na sebe odkazují
 * navzájem (jinak by hreflang tvrdil, že je úvodní stránka překladem článku).
 */
import routesCs from './routes.cs.json';
import routesSk from './routes.sk.json';

export const locales = ['cs', 'sk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'cs';
export const enabledLocales: Locale[] = ['cs', 'sk'];

export const SITE_URL = 'https://www.protelsystems.cz';

export const localeLabels: Record<Locale, { short: string; title: string; og: string }> = {
  cs: { short: 'CZ', title: 'Český', og: 'cs_CZ' },
  sk: { short: 'SK', title: 'Slovenský', og: 'sk_SK' },
};

export const homes: Record<Locale, string> = { cs: '/', sk: '/sk' };

type RouteMap = Record<string, Partial<Record<Locale, string>>>;
const routes: Record<Locale, RouteMap> = { cs: routesCs as RouteMap, sk: routesSk as RouteMap };

/** Cesty jazykových mutací stránky pro přepínač (jen zapnuté jazyky, včetně samotné stránky). */
export function translations(path: string, locale: Locale = defaultLocale): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = { [locale]: path };
  const map = routes[locale]?.[path] ?? {};
  for (const l of enabledLocales) {
    if (l !== locale) out[l] = map[l] ?? homes[l];
  }
  return out;
}

/** hreflang alternates pro BaseHead: jen vzájemné dvojice. */
export function alternates(path: string, locale: Locale = defaultLocale) {
  if (enabledLocales.length < 2) return [];
  const list: { lang: string; href: string }[] = [];
  const map = routes[locale]?.[path] ?? {};
  for (const l of enabledLocales) {
    if (l === locale) continue;
    const other = map[l];
    if (!other) continue;
    const back = routes[l]?.[other]?.[locale];
    if (back !== path) continue;
    list.push({ lang: l, href: new URL(other, SITE_URL).href });
  }
  if (!list.length) return [];
  list.unshift({ lang: locale, href: new URL(path, SITE_URL).href });
  const def = locale === defaultLocale ? path : map[defaultLocale];
  if (def) list.push({ lang: 'x-default', href: new URL(def, SITE_URL).href });
  return list;
}
