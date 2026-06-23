/**
 * Navigace webu Protel (per-web data pro sdílený @piano/ui Header).
 * Struktura dle IA starého protelsystems.cz: Řešení · Produkty (systém / recepce /
 * doplňky) · Piano (ekosystém, externí) · Ceník · O Protelu.
 * Odkazy míří na kotvy homepage + stránku Kontakt (v1 scaffold).
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

const reseniMega = {
  columns: [
    {
      label: 'Pro koho',
      links: [
        { label: 'Nezávislé hotely', href: '/#reseni', icon: 'lucide:hotel' },
        { label: 'Hotelové řetězce', href: '/#reseni', icon: 'lucide:building-2' },
        { label: 'Lázně a resorty', href: '/#reseni', icon: 'lucide:waves' },
        { label: 'Hotely s restaurací', href: '/#reseni', icon: 'lucide:utensils-crossed' },
        { label: 'Best Western (certifikace)', href: '/#reseni', icon: 'lucide:badge-check' },
        { label: 'Školy hotelnictví', href: '/#reseni', icon: 'lucide:graduation-cap' },
      ],
    },
  ],
};

const produktyMega = {
  columns: [
    {
      label: 'Systém',
      links: [
        { label: 'Protel — hotelový systém (PMS)', href: '/#pms', icon: 'lucide:layout-dashboard' },
        { label: 'Platební řešení hotelu', href: '/#produkty', icon: 'lucide:credit-card' },
        { label: 'Room Service', href: '/#produkty', icon: 'lucide:concierge-bell' },
        { label: 'Konference', href: '/#produkty', icon: 'lucide:presentation' },
        { label: 'Housekeeping', href: '/#produkty', icon: 'lucide:bed-double' },
      ],
    },
    {
      label: 'Digitální recepce',
      links: [
        { label: 'Online check-in/out', href: '/#recepce', icon: 'lucide:smartphone' },
        { label: 'Kiosek', href: '/#recepce', icon: 'lucide:monitor-smartphone' },
        { label: 'Digitální registrační karta', href: '/#recepce', icon: 'lucide:file-signature' },
        { label: 'Digitální hotelová kniha', href: '/#recepce', icon: 'lucide:book-open' },
        { label: 'Čtečka dokladů', href: '/#recepce', icon: 'lucide:scan-line' },
      ],
    },
    {
      label: 'Doplňky',
      links: [
        { label: 'Webové rezervace', href: '/#doplnky', icon: 'lucide:globe' },
        { label: 'Automatický mailing', href: '/#doplnky', icon: 'lucide:mail' },
        { label: 'Hotelové řetězce', href: '/#doplnky', icon: 'lucide:network' },
        { label: 'MealPlan', href: '/#doplnky', icon: 'lucide:soup' },
        { label: 'Napojení a integrace', href: '/#integrace', icon: 'lucide:plug' },
      ],
    },
  ],
};

export const protelNav: NavItem[] = [
  { label: 'Řešení', href: '/#reseni', mega: reseniMega },
  { label: 'Produkty', href: '/#produkty', mega: produktyMega },
  pianoNavItem('protel'),
  { label: 'Ceník', href: '/#cenik' },
  {
    label: 'O Protelu', href: '/#o-nas',
    children: [
      { label: 'O společnosti', href: '/#o-nas', icon: 'lucide:building' },
      { label: 'Naši zákazníci', href: '/#reference', icon: 'lucide:star' },
      { label: 'Protel pro školy', href: '/#reseni', icon: 'lucide:graduation-cap' },
      { label: 'Podpora', href: '/#kontakt', icon: 'lucide:life-buoy' },
      { label: 'Kontakt', href: '/kontakt', icon: 'lucide:mail' },
    ],
  },
];

export const protelCta: NavLink = { label: 'Vyzkoušet zdarma', href: '/#poptavka' };
