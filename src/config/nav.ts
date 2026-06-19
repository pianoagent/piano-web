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
  icon?: string;   // název ikony pro <Icon> (sada Lucide / lokální)
  badge?: string;  // malý štítek (např. "Oblíbené", "Nový")
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

export const products: NavLink[] = [
  { label: 'Qerko', href: '/produkty/qerko', description: 'Platby u stolu a digitální menu', icon: 'lucide:qr-code' },
  { label: 'Septim', href: '/produkty/septim', description: 'Pokladní systém pro restaurace', icon: 'lucide:monitor' },
  { label: 'Pecosta', href: '/produkty/pecosta', description: 'Hotelový systém (PMS)', icon: 'lucide:bed-double' },
  { label: 'Grason', href: '/produkty/grason', description: 'Plánování personálu a docházka', icon: 'lucide:users' },
  { label: 'Protel', href: '/produkty/protel', description: 'PMS pro hotelové řetězce', icon: 'lucide:building-2' },
  { label: 'Pilot', href: '/produkty/pilot', description: 'Mobilní aplikace pro obsluhu', icon: 'lucide:smartphone' },
  { label: 'Terminál', href: '/produkty/terminal', description: 'Platební terminály', icon: 'lucide:credit-card' },
];

/** Mega menu — Produkty */
const productsMega: MegaPanel = {
  featured: {
    label: 'Doporučeno',
    items: [
      { label: 'Qerko', href: '/produkty/qerko', description: 'Platby u stolu a QR objednávky', icon: 'lucide:qr-code', badge: 'Oblíbené' },
      { label: 'Pilot', href: '/produkty/pilot', description: 'Celý provoz v mobilní appce', icon: 'lucide:smartphone', badge: 'Nový' },
    ],
  },
  columns: [{ label: 'Všechny produkty', links: products }],
  footer: { label: 'Zobrazit všechny produkty', href: '/produkty' },
};

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
  { label: 'Produkty', href: '/produkty', mega: productsMega },
  { label: 'Řešení', href: '/reseni', mega: reseniMega },
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
