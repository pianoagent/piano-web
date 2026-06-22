/**
 * Navigace — Savarin (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE — jen jí dodáme jiná data.
 * Struktura: Moduly s dropdownem (Pokladna), pak hlavní moduly + Kontakt.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';

export const savarinNav: NavItem[] = [
  {
    label: 'Pokladna',
    href: '/pokladna',
    children: [
      { label: 'Pokladna Savarin', href: '/pokladna', description: 'Restaurační, hotelová a samoobslužná verze', icon: 'lucide:monitor' },
      { label: 'Mobilní pokladna', href: '/pokladna#mobilni', description: 'Mobilní číšník — objednávky přímo u stolu', icon: 'lucide:smartphone' },
      { label: 'Pokladní komponenty', href: '/pokladna#komponenty', description: 'POS, monitory, tiskárny, klávesnice', icon: 'lucide:keyboard' },
    ],
  },
  { label: 'Recepce', href: '/recepce' },
  { label: 'Sklady a kalkulace', href: '/sklady-a-kalkulace' },
  { label: 'Služby a servis', href: '/sluzby-servis' },
  { label: 'Kontakt', href: '/kontakt' },
];

export const savarinCta: NavLink = { label: 'Nezávazná poptávka', href: '/#poptavka' };
