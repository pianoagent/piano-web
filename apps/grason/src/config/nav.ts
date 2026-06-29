/**
 * Navigace — Grason (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE — jen jí dodáme jiná data.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

export const grasonNav: NavItem[] = [
  {
    label: 'Pro firmy',
    href: '/pro-firmy',
    children: [
      { label: 'GrasonFlexi', href: '/pro-firmy#flexi', description: 'Brigádníci na směnu na jedno kliknutí', icon: 'lucide:users' },
      { label: 'GrasonPlan', href: '/pro-firmy#grasonplan', description: 'Plánování směn, docházka a mzdové podklady', icon: 'lucide:calendar-days' },
      { label: 'GrasonJobs', href: '/pro-firmy#jobs', description: 'Inzerce a nábor stálých zaměstnanců', icon: 'lucide:megaphone' },
      { label: 'Ceník', href: '/pro-firmy#cenik', description: 'Předplatné bez poplatků ze mzdy', icon: 'lucide:tag' },
    ],
  },
  { label: 'Pro brigádníky', href: '/pro-brigadniky' },
  { label: 'O nás', href: '/o-nas' },
  pianoNavItem('grason'),
];

export const grasonCta: NavLink = { label: 'Konzultace zdarma', href: '/#poptavka' };

/** Footer (per-web) — Grason data pro sdílený <Footer>. */
export const grasonFooter = {
  brand: 'Grason',
  logoSrc: '/logos/grason_by_piano.svg',
  logoAlt: 'Grason by Piano',
  tagline: 'Odborník na personál — brigádníci na směnu (GrasonFlexi), plánování vlastního týmu (GrasonPlan) i nábor stálých lidí (GrasonJobs).',
  parentNote: { text: 'Grason je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Grason',
      links: [
        { label: 'Pro firmy', href: '/pro-firmy' },
        { label: 'Pro brigádníky', href: '/pro-brigadniky' },
        { label: 'O nás', href: '/o-nas' },
        { label: 'Konzultace zdarma', href: '/#poptavka' },
      ] as NavLink[],
    },
  ],
  contact: {
    heading: 'Kontakt',
    items: [
      { value: 'Grason Solutions s.r.o.' },
      { value: 'Thámova 166/18, 186 00 Praha 8' },
      { value: '+420 739 877 799', href: 'tel:+420739877799' },
      { value: 'info@grason.cz', href: 'mailto:info@grason.cz' },
      { label: 'IČ', value: '06884156' },
    ],
  },
};
