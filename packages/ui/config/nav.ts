/**
 * Navigace — datová definice (obsah oddělen od vzhledu).
 * Header i Footer čtou odtud. Úprava menu = editace tohoto souboru.
 *
 * Pozn.: URL jsou prozatímní (struktura sjednoceného piano.cz). Až vznikne
 * routing produktů, stačí upravit `href`.
 */

import { buildPianoMega } from './piano-ecosystem';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: string;   // název ikony pro <Icon> (sada Lucide / lokální)
  badge?: string;  // malý štítek (např. "Oblíbené", "Nový")
  external?: boolean; // odkaz mimo aktuální web → otevřít v nové kartě (target=_blank)
}

/** Mega menu panel — featured sloupec + sloupce odkazů + footer */
export interface MegaPanel {
  featured?: { label?: string; items: NavLink[] };
  columns: { label?: string; links: NavLink[] }[];
  footer?: NavLink;
}

export interface NavItem extends NavLink {
  children?: NavLink[];   // jednoduchý dropdown (fallback)
  mega?: MegaPanel;       // mega menu
}

// Pozn.: odkazy jsou PROZATÍM na nasazené demo weby (<produkt>-web.pages.dev),
// aby šel ekosystém proklikat. Po nasazení na finální domény stačí změnit href.
export const products: NavLink[] = [
  { label: 'Qerko', href: 'https://qerko-web.pages.dev', description: 'Platby u stolu a digitální menu', icon: 'lucide:qr-code', external: true },
  { label: 'Septim', href: 'https://septim-web.pages.dev', description: 'Pokladní systém pro restaurace', icon: 'lucide:monitor', external: true },
  { label: 'Pecosta', href: 'https://pecosta-web.pages.dev', description: 'Hotelový systém (PMS)', icon: 'lucide:bed-double', external: true },
  { label: 'Grason', href: 'https://grason-web.pages.dev', description: 'Plánování personálu a docházka', icon: 'lucide:users', external: true },
  { label: 'Protel', href: 'https://protel-web.pages.dev', description: 'PMS pro hotelové řetězce', icon: 'lucide:building-2', external: true },
  { label: 'Pilot', href: 'https://pilot-web.pages.dev', description: 'Mobilní aplikace pro obsluhu', icon: 'lucide:smartphone', external: true },
  { label: 'Terminál', href: 'https://terminal-web.pages.dev', description: 'Platební terminály', icon: 'lucide:credit-card', external: true },
];

// „Produkty" na piano.cz = celý Piano ekosystém (stejný panel jako na ostatních
// webech, jen label „Produkty"). Nic se nevynechává — piano.cz je rozcestník.
const produktyMega: MegaPanel = buildPianoMega();

/** Mega menu — Řešení (podle problému) */
const reseniMega: MegaPanel = {
  featured: {
    label: 'Doporučeno',
    items: [
      { label: 'All-in-One platforma', href: '/reseni', description: 'Jeden ekosystém, jeden poplatek z obratu, jedna faktura.', icon: 'lucide:layers', badge: 'Kompletní' },
    ],
  },
  columns: [
    {
      label: 'Řešení podle problému',
      links: [
        { label: 'Pokladní a hotelové systémy', href: '/reseni/pokladna', description: 'Chaos v objednávkách a skladu', icon: 'lucide:monitor' },
        { label: 'Platby & marketing', href: '/reseni/platby', description: 'Fronty, nízká dýška, nulové recenze', icon: 'lucide:credit-card' },
        { label: 'Nákupy & sklady', href: '/reseni/nakupy', description: 'Předražené suroviny, ruční přepisování', icon: 'lucide:shopping-cart' },
        { label: 'Personál', href: '/reseni/personal', description: 'Chybějící brigádníci, chaos ve směnách', icon: 'lucide:users' },
        { label: 'Data & analýzy', href: '/reseni/data', description: 'Rozhodování podle pocitů, ne čísel', icon: 'lucide:bar-chart-3' },
      ],
    },
  ],
};

export const mainNav: NavItem[] = [
  { label: 'Produkty', href: '/produkty', mega: produktyMega },
  { label: 'Řešení', href: '/reseni', mega: reseniMega },
  { label: 'EET 2.0', href: '/eet' },
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

/** Ploché pole odkazů z mega panelu (pro mobilní menu) */
export function megaToLinks(item: NavItem): NavLink[] {
  if (item.children) return item.children;
  if (!item.mega) return [];
  const featured = item.mega.featured?.items ?? [];
  const cols = item.mega.columns.flatMap((c) => c.links);
  return [...featured, ...cols];
}
