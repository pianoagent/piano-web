/**
 * i18n pro piano.cz — čeština v rootu (/), angličtina pod /en/.
 *
 * Rollout probíhá po stránkách: EN_READY drží cesty, které už mají EN verzi.
 * `locPath` u zatím nepřeložených cílů vrátí českou URL (žádné 404 mezitím).
 * Jak přibývají EN stránky, stačí přidat jejich cestu do EN_READY.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { mainNav, headerCta, companyNav, legalNav, contact } from '@piano/ui/config/nav';

export type Locale = 'cs' | 'en';
export const DEFAULT_LOCALE: Locale = 'cs';
export const LOCALES: Locale[] = ['cs', 'en'];

/** Cesty, které už mají hotovou EN verzi (rozšiřuje se během rolloutu). */
export const EN_READY = new Set<string>(['/']);

const isNonPage = (p: string) =>
  !p || p.startsWith('#') || p.startsWith('http') || p.startsWith('mailto') || p.startsWith('tel');

/** Přemapuje interní cestu na aktuální jazyk (EN → prefix /en, jen když je hotová). */
export function locPath(path: string, locale: Locale): string {
  if (locale === 'cs' || isNonPage(path)) return path;
  const clean = path === '' ? '/' : path;
  if (!EN_READY.has(clean)) return path; // EN verze ještě není → zůstat na CS
  return clean === '/' ? '/en/' : '/en' + clean;
}

/** Odstraní jazykový prefix → kanonická (CS) cesta. */
export function stripLocale(pathname: string): string {
  const s = pathname.replace(/^\/en(?=\/|$)/, '');
  return s === '' ? '/' : s;
}

/** Určí jazyk z URL cesty. */
export function localeFromPath(pathname: string): Locale {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'cs';
}

/* ------------------------------------------------------------------ */
/* Navigace — EN varianta (fáze 1: ploché odkazy, cíle přes locPath)   */
/* ------------------------------------------------------------------ */

const mainNavEn: NavItem[] = [
  { label: 'Products', href: '/produkty' },
  { label: 'Solutions', href: '/reseni' },
  { label: 'EET 2.0', href: '/eet' },
  { label: 'About us', href: '/o-nas' },
  { label: 'Contact', href: '#kontakt' },
];

const companyNavEn: NavLink[] = [
  { label: 'About us', href: '/o-nas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Press', href: '/pro-media' },
  { label: 'Contact', href: '#kontakt' },
];

const legalNavEn: NavLink[] = [
  { label: 'Terms & Conditions', href: '/obchodni-podminky' },
  { label: 'Privacy Policy', href: '/ochrana-udaju' },
];

/** Aplikuje locPath na href v seznamu odkazů (rekurzivně přes mega/children). */
function localizeLinks<T extends NavLink>(links: T[], locale: Locale): T[] {
  return links.map((l) => ({ ...l, href: locPath(l.href, locale) }));
}
function localizeNav(items: NavItem[], locale: Locale): NavItem[] {
  return items.map((it) => ({
    ...it,
    href: locPath(it.href, locale),
    children: it.children ? localizeLinks(it.children, locale) : undefined,
    mega: it.mega
      ? {
          ...it.mega,
          featured: it.mega.featured
            ? { ...it.mega.featured, items: localizeLinks(it.mega.featured.items, locale) }
            : undefined,
          columns: it.mega.columns.map((c) => ({ ...c, links: localizeLinks(c.links, locale) })),
          footer: it.mega.footer ? { ...it.mega.footer, href: locPath(it.mega.footer.href, locale) } : undefined,
        }
      : undefined,
  }));
}

export function getNav(locale: Locale): NavItem[] {
  return locale === 'en' ? localizeNav(mainNavEn, locale) : localizeNav(mainNav, locale);
}
export function getCompanyNav(locale: Locale): NavLink[] {
  return localizeLinks(locale === 'en' ? companyNavEn : companyNav, locale);
}
export function getLegalNav(locale: Locale): NavLink[] {
  return localizeLinks(locale === 'en' ? legalNavEn : legalNav, locale);
}
export function getHeaderCta(locale: Locale): NavLink {
  return locale === 'en'
    ? { label: 'Book a demo', href: '#poptavka' }
    : { ...headerCta };
}

/* ------------------------------------------------------------------ */
/* Chrome texty (patička, kontaktní pruh, přepínač) + kontakt          */
/* ------------------------------------------------------------------ */

export const contactInfo = contact; // firemní údaje jsou jazykově neutrální

export const ui = {
  cs: {
    switchTo: 'EN',
    switchLabel: 'Přepnout do angličtiny',
    footerTagline: 'Technologie pro restaurace a hotely, pokladny, rezervace, platby a analytika na jednom místě.',
    footerCompany: 'Společnost',
    footerOffices: 'Pobočky',
    footerContact: 'Kontakt',
    contactEyebrow: 'Konzultace zdarma',
    contactTitle: 'Spojte se s námi',
    contactLead: 'Zavolejte nebo napište, společně projdeme, co vás zajímá, a najdeme nejlepší řešení přesně pro váš podnik.',
    contactCall: 'Zavolejte',
    contactWrite: 'Napište',
  },
  en: {
    switchTo: 'CS',
    switchLabel: 'Switch to Czech',
    footerTagline: 'Technology for restaurants and hotels, POS, reservations, payments and analytics in one place.',
    footerCompany: 'Company',
    footerOffices: 'Offices',
    footerContact: 'Contact',
    contactEyebrow: 'Free consultation',
    contactTitle: 'Get in touch',
    contactLead: 'Call or write and we will go through what you need together and find the best fit for your business.',
    contactCall: 'Call us',
    contactWrite: 'Write to us',
  },
} as const;

/** Cíl přepínače jazyků z aktuální stránky. */
export function switchHref(pathname: string, current: Locale): string {
  const base = stripLocale(pathname);
  if (current === 'en') return base; // z EN zpět na CS ekvivalent
  return EN_READY.has(base) ? (base === '/' ? '/en/' : '/en' + base) : '/en/';
}
