/**
 * Navigace — Savarin (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE — jen jí dodáme jiná data.
 * Struktura: jeden dropdown „Moduly" se všemi moduly (symetricky), pak
 * konverzní/servisní stránky a Kontakt + položka Piano (ekosystém).
 * Každý modul má vlastní URL (žádné kotvy) kvůli SEO i čistšímu UX.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

export const savarinNav: NavItem[] = [
  {
    label: 'Moduly',
    href: '/#moduly',
    children: [
      { label: 'Pokladna', href: '/pokladna', description: 'Restaurační, hotelová a samoobslužná verze', icon: 'lucide:monitor' },
      { label: 'Mobilní pokladna', href: '/mobilni-pokladna', description: 'Mobilní číšník — objednávky přímo u stolu', icon: 'lucide:smartphone' },
      { label: 'Pokladní komponenty', href: '/pokladni-komponenty', description: 'POS, monitory, tiskárny, klávesnice', icon: 'lucide:keyboard' },
      { label: 'Recepce', href: '/recepce', description: 'Rezervace, ubytování, účty a směnárna', icon: 'lucide:bed-double' },
      { label: 'Sklady a kalkulace', href: '/sklady-a-kalkulace', description: 'HRMTZ + HRKALKUL — jádro systému', icon: 'lucide:calculator' },
    ],
  },
  { label: 'Demoverze', href: '/demoverze' },
  { label: 'Ceník', href: '/cenik' },
  { label: 'Servis', href: '/servis' },
  { label: 'Kontakt', href: '/kontakt' },
  pianoNavItem('savarin'),
];

export const savarinCta: NavLink = { label: 'Nezávazná poptávka', href: '/kontakt' };
