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

// Ostré odkazy: samostatné produkty na své domény, Pilot/Terminál dovnitř piano.cz.
export const products: NavLink[] = [
  { label: 'Qerko', href: 'https://www.qerko.com', description: 'Platby u stolu a digitální menu', icon: 'lucide:qr-code', external: true },
  { label: 'Septim', href: 'https://www.septim.cz', description: 'Pokladní systém pro restaurace', icon: 'lucide:monitor', external: true },
  { label: 'Pecosta', href: 'https://www.pecosta.cz', description: 'Hotelový systém (PMS)', icon: 'lucide:bed-double', external: true },
  { label: 'Grason', href: 'https://www.grason.cz', description: 'Plánování personálu a docházka', icon: 'lucide:users', external: true },
  { label: 'Protel', href: 'https://www.protelsystems.cz', description: 'PMS pro hotelové řetězce', icon: 'lucide:building-2', external: true },
  { label: 'Pilot', href: '/pilot', description: 'Mobilní aplikace pro obsluhu', icon: 'lucide:smartphone' },
  { label: 'Terminál', href: '/terminal', description: 'Platební terminály', icon: 'lucide:credit-card' },
];

// „Produkty" na piano.cz = celý Piano ekosystém (stejný panel jako na ostatních
// webech, jen label „Produkty"). Nic se nevynechává — piano.cz je rozcestník.
const produktyMega: MegaPanel = buildPianoMega(undefined, true);

/** Mega menu — Řešení (podle problému) */
const reseniMega: MegaPanel = {
  columns: [
    {
      label: 'Řešení podle problému',
      links: [
        { label: 'Pokladní a hotelové systémy', href: '/reseni/pokladna', description: 'Chaos v objednávkách a skladu', icon: 'lucide:monitor' },
        { label: 'Platby & marketing', href: '/reseni/platby', description: 'Fronty, nízká dýška, nulové recenze', icon: 'lucide:credit-card' },
        { label: 'Nákupy & sklady', href: '/reseni/nakupy', description: 'Předražené suroviny, ruční přepisování', icon: 'lucide:shopping-cart' },
        { label: 'Personál', href: '/reseni/personal', description: 'Chybějící brigádníci, chaos ve směnách', icon: 'lucide:users' },
      ],
    },
  ],
};

export const mainNav: NavItem[] = [
  { label: 'Produkty', href: '/produkty', mega: produktyMega },
  { label: 'Řešení', href: '/reseni', mega: reseniMega },
  { label: 'EET 2.0', href: '/eet' },
  { label: 'O nás', href: '/o-nas' },
  { label: 'Kontakt', href: '#kontakt' },
];

// Hlavní CTA vždy míří na poptávkový formulář dole na aktuální stránce.
export const headerCta: NavLink = { label: 'Domluvit demo', href: '#poptavka' };

/** Sekundární odkazy (firma) — používá Footer */
export const companyNav: NavLink[] = [
  { label: 'O nás', href: '/o-nas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pro média', href: '/pro-media' },
  { label: 'Kontakt', href: '#kontakt' },
];

/** Právní odkazy — spodní lišta footeru */
export const legalNav: NavLink[] = [
  { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
  { label: 'Zásady ochrany osobních údajů', href: '/ochrana-udaju' },
];

/** Sociální sítě — `icon` je název ikony pro <Icon> (sada Lucide) */
export const socialLinks: { label: string; href: string; icon: string }[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/piano-solutions', icon: 'lucide:linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'lucide:instagram' },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'lucide:youtube' },
];

/** Kontaktní údaje — Piano Solutions (sídlo dle obchodního rejstříku) */
export const contact = {
  company: 'Piano Solutions s.r.o.',
  email: 'info@piano.cz',
  phone: '+420 770 320 248',
  address: 'Thámova 166/18, Karlín, 186 00 Praha 8',
  ic: '19780974',
  dic: 'CZ19780974',
};

/** Ploché pole odkazů z mega panelu (pro mobilní menu) */
export function megaToLinks(item: NavItem): NavLink[] {
  if (item.children) return item.children;
  if (!item.mega) return [];
  const featured = item.mega.featured?.items ?? [];
  const cols = item.mega.columns.flatMap((c) => c.links);
  return [...featured, ...cols];
}
