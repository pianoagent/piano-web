/**
 * Piano ekosystém — SDÍLENÁ data napříč všemi weby.
 * Každý web zobrazí v menu položku „Piano" se stejným ekosystémem a logicky
 * VYNECHÁ produkt, na kterém uživatel zrovna je (currentId).
 *
 * Odkazy vedou na weby produktů (externí). URL k potvrzení — uprav níže.
 */
import type { MegaPanel, NavLink, NavItem } from './nav';

type Group = 'novinky' | 'pokladna' | 'hotely' | 'hoste';

interface PianoProduct {
  id: string;
  label: string;
  href: string;          // externí web produktu (potvrdit)
  description: string;
  icon: string;          // brandová favicon '/brand/<id>.svg'
  badge?: string;
  group: Group;
  path?: string;         // produkty, které ŽIJÍ na piano.cz (Pilot, Brain, Terminál)
                         // → odkaz dovnitř webu, ne na samostatný web
}

/** Zdroj pravdy pro celé portfolio. */
export const PIANO_PRODUCTS: PianoProduct[] = [
  { id: 'pilot',    label: 'Piano Pilot',    href: 'https://piano.cz', path: '/pilot',    description: 'Celý provoz v mobilní appce. Data, sklad, AI doporučení.', icon: '/brand/piano.svg',  badge: 'Nový', group: 'novinky' },
  { id: 'brain',    label: 'Piano Brain',    href: 'https://piano.cz', path: '/brain',    description: 'AI a market intelligence. Víte, co prodává konkurence?',    icon: '/brand/piano.svg',       badge: 'Beta', group: 'novinky' },
  { id: 'terminal', label: 'Piano Terminál', href: 'https://piano.cz', path: '/terminal', description: 'Terminál, který platbou začíná. Data i platby dodavatelům.', icon: '/brand/piano.svg', group: 'novinky' },

  { id: 'septim',   label: 'Septim',         href: 'https://www.septim.cz',         description: 'Pokladní a provozní systém',     icon: '/brand/septim.svg',        group: 'pokladna' },
  { id: 'hugo',     label: 'Hugo',           href: 'https://hugo.cz',               description: 'Pokladna v telefonu, co máš',    icon: '/brand/hugo.svg',          badge: 'Nový', group: 'pokladna' },
  { id: 'harsys',   label: 'ABX Harsys',     href: 'https://piano.cz',              description: 'Pokladní systém',                icon: '/brand/abx.svg', group: 'pokladna' },
  { id: 'savarin',  label: 'Savarin',        href: 'https://piano.cz',              description: 'Pokladní systém',                icon: '/brand/savarin.svg',        group: 'pokladna' },
  { id: 'autset',   label: 'Autset',         href: 'https://piano.cz',              description: 'Automatické naskladňování',      icon: '/brand/autset.svg',         group: 'pokladna' },
  { id: 'pecosta',  label: 'Pecosta',        href: 'https://www.pecosta.cz',        description: 'Aukční nákupy surovin',          icon: '/brand/pecosta.svg',           group: 'pokladna' },

  { id: 'protel',   label: 'Protel',         href: 'https://www.protelsystems.cz',  description: 'Hotelový PMS systém',            icon: '/brand/protel.svg',      group: 'hotely' },

  { id: 'qerko',    label: 'Qerko',          href: 'https://www.qerko.com',         description: 'QR platby, tipy, Google recenze', icon: '/brand/qerko.svg',        group: 'hoste' },
  { id: 'grason',   label: 'Grason',         href: 'https://www.grason.cz',         description: 'Brigádníci, směny, píchačky',    icon: '/brand/grason.svg',           group: 'hoste' },
];

// DEMO: dočasně odkazujeme na nasazené weby <id>-web.pages.dev, ať jde ekosystém
// proklikat. Finální URL jsou v `href` u každého produktu — po nasazení na domény
// stačí přepnout `toLink` zpět na `p.href`.
//
// Produkty s `path` žijí na piano.cz:
//   - na samotném piano webu (onPiano) → interní relativní odkaz, stejná karta
//   - na cizím webu (Septim, Grason…) → ABSOLUTNÍ odkaz na piano.cz + nová karta
//     (jinak by se z '/pilot' stalo septim-web.pages.dev/pilot = 404)
// Ostatní produkty = samostatné weby → vždy absolutně + nová karta.
const toLink = (p: PianoProduct, onPiano: boolean): NavLink => {
  const base = { label: p.label, description: p.description, icon: p.icon, badge: p.badge };
  if (p.path) {
    return { ...base, href: onPiano ? p.path : `https://piano.cz${p.path}`, external: !onPiano };
  }
  return { ...base, href: `https://${p.id}-web.pages.dev`, external: true };
};

/** Sestaví Piano mega panel pro daný web; `currentId` se vynechá. `onPiano`=true jen na webu piano.cz. */
export function buildPianoMega(currentId?: string, onPiano = false): MegaPanel {
  const items = PIANO_PRODUCTS.filter((p) => p.id !== currentId);
  const byGroup = (g: Group) => items.filter((p) => p.group === g).map((p) => toLink(p, onPiano));

  const columns = [
    { label: 'Pokladna & provoz', links: byGroup('pokladna') },
    { label: 'Hosté & personál',  links: byGroup('hoste') },
    { label: 'Pro hotely',        links: byGroup('hotely') }, // samostatný → vpravo
  ].filter((c) => c.links.length > 0);

  return {
    featured: { label: 'Novinky', items: byGroup('novinky') },
    columns,
  };
}

/**
 * Hotová položka menu „Piano" pro hlavičku — stejná na všech webech.
 * Stačí přidat do nav daného webu: `pianoNavItem('septim')` (vynechá Septim).
 */
export function pianoNavItem(currentId?: string): NavItem {
  return { label: 'Piano', href: 'https://piano.cz', mega: buildPianoMega(currentId) };
}
