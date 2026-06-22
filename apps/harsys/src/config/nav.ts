/**
 * Navigace — Grason (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE — jen jí dodáme jiná data.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';

export const grasonNav: NavItem[] = [
  {
    label: 'Pro firmy',
    href: '/pro-firmy',
    children: [
      { label: 'Brigádníci', href: '/pro-firmy#brigadnici', description: 'Flexibilní pracovníci na směnu', icon: 'lucide:users' },
      { label: 'GrasonPlan', href: '/pro-firmy#grasonplan', description: 'Plánování směn vlastního týmu', icon: 'lucide:calendar-days' },
      { label: 'Digitální píchačky', href: '/pro-firmy#pichacky', description: 'Docházka přes WiFi a GPS', icon: 'lucide:map-pin' },
      { label: 'Ceník', href: '/pro-firmy#cenik', description: 'Předplatné bez poplatků ze mzdy', icon: 'lucide:tag' },
    ],
  },
  { label: 'Pro brigádníky', href: '/pro-brigadniky' },
  { label: 'O nás', href: '/o-nas' },
];

export const grasonCta: NavLink = { label: 'Konzultace zdarma', href: '/#poptavka' };
