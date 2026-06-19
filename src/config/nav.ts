/**
 * Navigace — datová definice (obsah oddělen od vzhledu).
 * Header i Footer čtou odtud. Úprava menu = editace tohoto souboru.
 *
 * Pozn.: URL jsou prozatímní (struktura sjednoceného piano.cz). Až vznikne
 * routing produktů, stačí upravit `href`.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export const products: NavLink[] = [
  { label: 'Qerko', href: '/produkty/qerko', description: 'Platby u stolu a digitální menu' },
  { label: 'Septim', href: '/produkty/septim', description: 'Pokladní systém pro restaurace' },
  { label: 'Pecosta', href: '/produkty/pecosta', description: 'Hotelový systém (PMS)' },
  { label: 'Grason', href: '/produkty/grason', description: 'Analytika a reporting' },
  { label: 'Protel', href: '/produkty/protel', description: 'PMS pro hotelové řetězce' },
  { label: 'Pilot', href: '/produkty/pilot', description: 'Mobilní aplikace pro obsluhu' },
  { label: 'Terminál', href: '/produkty/terminal', description: 'Platební terminály' },
];

export const mainNav: NavItem[] = [
  { label: 'Produkty', href: '/produkty', children: products },
  { label: 'Řešení', href: '/reseni' },
  { label: 'Ceník', href: '/cenik' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontakt', href: '/kontakt' },
];

export const headerCta: NavLink = { label: 'Domluvit demo', href: '/kontakt' };

/** Sekundární odkazy (firma) — používá Footer */
export const companyNav: NavLink[] = [
  { label: 'Řešení', href: '/reseni' },
  { label: 'Ceník', href: '/cenik' },
  { label: 'Blog', href: '/blog' },
  { label: 'O nás', href: '/o-nas' },
  { label: 'Kontakt', href: '/kontakt' },
];

/** Právní odkazy — spodní lišta footeru */
export const legalNav: NavLink[] = [
  { label: 'Zásady ochrany osobních údajů', href: '/ochrana-udaju' },
  { label: 'Cookies', href: '/cookies' },
];

/** Sociální sítě — `icon` je název ikony pro <Icon> (sada Lucide) */
export const socialLinks: { label: string; href: string; icon: string }[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/piano-solutions', icon: 'lucide:linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'lucide:instagram' },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'lucide:youtube' },
];

/** Kontaktní údaje */
export const contact = {
  email: 'obchod@piano.cz',
  phone: '+420 222 222 222',
  address: 'Piano Solutions s.r.o., Praha',
};

