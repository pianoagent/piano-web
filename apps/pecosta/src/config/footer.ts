/**
 * Patička webu Pecosta (per-web data pro sdílený @piano/ui Footer).
 * Zdroj: pecosta-context.md (kontakt, sídlo, IČO).
 */
const year = new Date().getFullYear();

export const pecostaFooter = {
  brand: 'Pecosta',
  logoSrc: '/logos/pecosta_by_piano.svg',  // "by Piano" lockup; v patičce bíle (filtr), šířka 68px
  logoAlt: 'Pecosta by Piano',
  tagline: 'Chytrý nákup surovin a energií pro gastro provozy, hotely a instituce. Aukční nákupy, úspora času i nákladů a automatické naskladňování.',
  parentNote: { text: 'Pecosta je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Služby',
      links: [
        { label: 'Aukční nákupy', href: '/sluzby/aukcni-nakupy' },
        { label: 'Energie pro gastro', href: '/sluzby/energie' },
        { label: 'Autset — naskladnění', href: '/sluzby/autset' },
        { label: 'Burzovní obchody', href: '/sluzby/burzovni-obchody' },
      ],
    },
    {
      heading: 'Společnost',
      links: [
        { label: 'Jak to funguje', href: '/jak-to-funguje' },
        { label: 'Reference', href: '/reference' },
        { label: 'Kontakt', href: '/kontakt' },
        { label: 'Skupina Piano', href: 'https://piano.cz' },
      ],
    },
  ],
  contact: {
    heading: 'Kontakt',
    items: [
      { value: 'pecosta@pecosta.cz', href: 'mailto:pecosta@pecosta.cz' },
      { value: '+420 734 442 683', href: 'tel:+420734442683' },
      { value: 'PECOSTA, a.s.' },
      { value: 'Kořenského 1262/40, 703 00 Ostrava-Vítkovice' },
      { label: 'IČO', value: '09708464' },
    ],
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/pecosta', icon: 'lucide:linkedin' },
    { label: 'Facebook', href: 'https://www.facebook.com/pecosta', icon: 'lucide:facebook' },
  ],
  legal: [
    { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
    { label: 'Ochrana osobních údajů', href: '/ochrana-udaju' },
    { label: 'Cookies', href: '/cookies' },
  ],
  copyright: `© ${year} PECOSTA, a.s.`,
};
