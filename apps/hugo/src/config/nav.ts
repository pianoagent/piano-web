/**
 * Navigace webu Hugo (per-web data pro sdílený @piano/ui Header).
 * Hugo je one-pager → položky menu jsou kotvy na sekce.
 * Položka „Piano" přidává ekosystém (vynechá sám sebe: pianoNavItem('hugo')).
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

export const hugoNav: NavItem[] = [
  { label: 'Produkt', href: '/#produkt' },
  { label: 'AI & Brain', href: '/#brain' },
  { label: 'Spuštění', href: '/#spusteni' },
  { label: 'Ceník', href: '/#cenik' },
  { label: 'Reference', href: '/#reference' },
  pianoNavItem('hugo'),
];

export const hugoCta: NavLink = { label: 'Začít zdarma', href: '/#zacit' };
