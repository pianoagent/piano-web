/**
 * Patička webu Pecosta (per-web data pro sdílený @piano/ui Footer).
 * Zdroj: pecosta-context.md (kontakt, sídlo, IČO).
 */
const year = new Date().getFullYear();

export const pecostaFooter = {
  brand: 'Pecosta',
  logoSrc: '/logos/pecosta_color.svg',
  tagline: 'Chytrý nákup surovin a energií pro gastro provozy, hotely a instituce. Aukční nákupy, úspora času i nákladů a automatické naskladňování.',
  parentNote: { text: 'Pecosta je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Služby',
      links: [
        { label: 'Aukční nákupy', href: '/#funkce' },
        { label: 'Energie pro gastro', href: '/#funkce' },
        { label: 'Autset — naskladnění', href: '/#funkce' },
        { label: 'Jak to funguje', href: '/#jak-to-funguje' },
      ],
    },
    {
      heading: 'Společnost',
      links: [
        { label: 'Reference', href: '/#reference' },
        { label: 'Analýza zdarma', href: '/#poptavka' },
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
