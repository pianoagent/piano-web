/**
 * Navigace webu Qerko (per-web data pro sdílený @piano/ui Header).
 * Struktura dle staré IA qerko.com: S čím pomůžeme · Produkty · Piano (ekosystém) · Ceník · O Qerku.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

const reseniMega = {
  columns: [
    {
      label: 'S čím pomůžeme',
      links: [
        { label: 'Zvládnout špičky', href: '/#jak-to-funguje', icon: 'lucide:gauge' },
        { label: 'Přivést nové hosty', href: '/#komunita', icon: 'lucide:user-plus' },
        { label: 'Zlepšit reputaci', href: '/#hodnoceni', icon: 'lucide:star' },
        { label: 'Vytvořit komunitu hostů', href: '/#vernost', icon: 'lucide:heart-handshake' },
      ],
    },
  ],
};

const produktyMega = {
  columns: [
    {
      label: 'Platba a objednávání',
      links: [
        { label: 'Qerko platba', href: '/#qr-platba', icon: 'lucide:qr-code' },
        { label: 'Digitální menu a objednávka', href: '/#objednavani', icon: 'lucide:utensils' },
        { label: 'Rezervace', href: '/#rezervace', icon: 'lucide:calendar-check' },
      ],
    },
    {
      label: 'Hosté a reputace',
      links: [
        { label: 'Věrnostní program', href: '/#vernost', icon: 'lucide:award' },
        { label: 'Hodnocení a recenze', href: '/#hodnoceni', icon: 'lucide:star' },
        { label: 'Qpoint', href: '/#qpoint', icon: 'lucide:tablet-smartphone' },
      ],
    },
  ],
};

export const qerkoNav: NavItem[] = [
  { label: 'S čím pomůžeme', href: '/#jak-to-funguje', mega: reseniMega },
  { label: 'Produkty', href: '/#qr-platba', mega: produktyMega },
  pianoNavItem('qerko'),
  { label: 'Ceník', href: '/cenik' },
  {
    label: 'O Qerku', href: '/o-nas',
    children: [
      { label: 'O nás', href: '/o-nas', icon: 'lucide:building' },
      { label: 'Ceník', href: '/cenik', icon: 'lucide:tag' },
      { label: 'Kontakt', href: '/kontakt', icon: 'lucide:mail' },
    ],
  },
];

export const qerkoCta: NavLink = { label: 'Chci Qerko', href: '/#poptavka' };
