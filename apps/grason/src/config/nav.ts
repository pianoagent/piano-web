/**
 * Navigace, Grason (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE, jen jí dodáme jiná data.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

export const grasonNav: NavItem[] = [
  {
    label: 'Pro firmy',
    href: '/pro-firmy',
    children: [
      { label: 'GrasonFlexi', href: '/grasonflexi', description: 'Brigádníci na směnu na jedno kliknutí', icon: 'lucide:users' },
      { label: 'GrasonPlan', href: '/grasonplan', description: 'Plánování směn, docházka a mzdové podklady', icon: 'lucide:calendar-days' },
      { label: 'GrasonJobs', href: '/grasonjobs', description: 'Inzerce a nábor stálých zaměstnanců', icon: 'lucide:megaphone' },
    ],
  },
  { label: 'Pro brigádníky', href: '/pro-brigadniky' },
  { label: 'O nás', href: '/o-nas' },
  { label: 'Kontakt', href: '/kontakt' },
  pianoNavItem('grason'),
];

export const grasonCta: NavLink = { label: 'Konzultace zdarma', href: '/kontakt' };

/** Registrační URL (CTA míří rovnou na registraci, ne na formulář). */
export const grasonFlexiRegister = 'https://app.grason.cz/registration?lng=cs';
export const grasonPlanRegister = 'https://app.grasonplan.cz/signup';

/** Sekundární „Přihlášení" vedle hlavního CTA (dropdown na rozhraní). */
export const grasonLogin: NavItem = {
  label: 'Přihlášení',
  href: '#',
  children: [
    { label: 'GrasonFlexi', href: 'https://app.grason.cz/login', description: 'Rozhraní pro brigádníky', icon: 'lucide:log-in', external: true },
    { label: 'GrasonPlan', href: 'https://app.grasonplan.cz/login', description: 'Plánování směn vlastního týmu', icon: 'lucide:log-in', external: true },
  ],
};

/** Footer (per-web), Grason data pro sdílený <Footer>. */
export const grasonFooter = {
  brand: 'Grason',
  logoSrc: '/logos/grason_by_piano.svg',
  logoAlt: 'Grason by Piano',
  tagline: 'Odborník na personál, brigádníci na směnu (GrasonFlexi), plánování vlastního týmu (GrasonPlan) i nábor stálých lidí (GrasonJobs).',
  parentNote: { text: 'Grason je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Grason',
      links: [
        { label: 'Pro firmy', href: '/pro-firmy' },
        { label: 'Pro brigádníky', href: '/pro-brigadniky' },
        { label: 'O nás', href: '/o-nas' },
        { label: 'Kontakt', href: '/kontakt' },
      ] as NavLink[],
    },
    {
      heading: 'Podpora',
      links: [
        { label: 'FAQ pro podniky', href: '/faq-companies' },
        { label: 'FAQ pro pracovníky', href: '/faq-grason' },
        { label: 'Volná místa', href: '/kariera' },
        { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
        { label: 'Ochrana osobních údajů', href: '/ochrana-osobnich-udaju' },
        { label: 'Podmínky GrasonPlan', href: '/plan/obchodni-podminky' },
        { label: 'Osobní údaje GrasonPlan', href: '/plan/ochrana-osobnich-udaju' },
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
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/grason_cz/', icon: 'lucide:instagram' },
    { label: 'Facebook', href: 'https://www.facebook.com/Grason.cz/?locale=cs_CZ', icon: 'lucide:facebook' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCWWzYIZTbY1o4qKhAN41_tw', icon: 'lucide:youtube' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/grason/', icon: 'lucide:linkedin' },
  ],
  legal: [],
};
