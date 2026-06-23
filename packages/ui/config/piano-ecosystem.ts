/**
 * Piano ekosystém — SDÍLENÁ data napříč všemi weby.
 * Každý web zobrazí v menu položku „Piano" se stejným ekosystémem a logicky
 * VYNECHÁ produkt, na kterém uživatel zrovna je (currentId).
 *
 * Odkazy vedou na weby produktů (externí). URL k potvrzení — uprav níže.
 */
import type { MegaPanel, NavLink } from './nav';

type Group = 'novinky' | 'pokladna' | 'hotely' | 'hoste';

interface PianoProduct {
  id: string;
  label: string;
  href: string;          // externí web produktu (potvrdit)
  description: string;
  icon: string;          // lucide ikona (dočasně místo loga)
  badge?: string;
  group: Group;
}

/** Zdroj pravdy pro celé portfolio. */
export const PIANO_PRODUCTS: PianoProduct[] = [
  { id: 'pilot',    label: 'Piano Pilot',    href: 'https://piano.cz',              description: 'Celý provoz v mobilní appce. Data, sklad, AI doporučení.', icon: 'lucide:smartphone',  badge: 'Nový', group: 'novinky' },
  { id: 'brain',    label: 'Piano Brain',    href: 'https://piano.cz',              description: 'AI a market intelligence. Víte, co prodává konkurence?',    icon: 'lucide:brain',       badge: 'Beta', group: 'novinky' },
  { id: 'terminal', label: 'Piano Terminál', href: 'https://piano.cz',              description: 'Terminál, který platbou začíná. Data i platby dodavatelům.', icon: 'lucide:credit-card', group: 'novinky' },

  { id: 'septim',   label: 'Septim',         href: 'https://www.septim.cz',         description: 'Pokladní a provozní systém',     icon: 'lucide:monitor',        group: 'pokladna' },
  { id: 'harsys',   label: 'ABX Harsys',     href: 'https://piano.cz',              description: 'Pokladní systém',                icon: 'lucide:square-terminal', group: 'pokladna' },
  { id: 'savarin',  label: 'Savarin',        href: 'https://piano.cz',              description: 'Pokladní systém',                icon: 'lucide:utensils',        group: 'pokladna' },
  { id: 'autset',   label: 'Autset',         href: 'https://piano.cz',              description: 'Automatické naskladňování',      icon: 'lucide:package',         group: 'pokladna' },
  { id: 'pecosta',  label: 'Pecosta',        href: 'https://www.pecosta.cz',        description: 'Aukční nákupy surovin',          icon: 'lucide:gavel',           group: 'pokladna' },

  { id: 'protel',   label: 'Protel',         href: 'https://www.protelsystems.cz',  description: 'Hotelový PMS systém',            icon: 'lucide:building-2',      group: 'hotely' },

  { id: 'qerko',    label: 'Qerko',          href: 'https://www.qerko.com',         description: 'QR platby, tipy, Google recenze', icon: 'lucide:qr-code',        group: 'hoste' },
  { id: 'grason',   label: 'Grason',         href: 'https://www.grason.cz',         description: 'Brigádníci, směny, píchačky',    icon: 'lucide:users',           group: 'hoste' },
];

const toLink = (p: PianoProduct): NavLink => ({
  label: p.label, href: p.href, description: p.description, icon: p.icon, badge: p.badge,
});

/** Sestaví Piano mega panel pro daný web; `currentId` se vynechá. */
export function buildPianoMega(currentId?: string): MegaPanel {
  const items = PIANO_PRODUCTS.filter((p) => p.id !== currentId);
  const byGroup = (g: Group) => items.filter((p) => p.group === g).map(toLink);

  const columns = [
    { label: 'Pokladna & provoz', links: byGroup('pokladna') },
    { label: 'Pro hotely',        links: byGroup('hotely') },
    { label: 'Hosté & personál',  links: byGroup('hoste') },
  ].filter((c) => c.links.length > 0);

  return {
    featured: { label: 'Novinky', items: byGroup('novinky') },
    columns,
  };
}
