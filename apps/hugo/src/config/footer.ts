/**
 * Patička webu Hugo (per-web data pro sdílený @piano/ui Footer).
 * Obsah dle mirroru starého webu (footer sekce).
 */
const year = new Date().getFullYear();

export const hugoFooter = {
  brand: 'Hugo',
  logoSrc: '/logos/hugo_by_piano.svg',   // "by Piano" lockup; Footer ho renderuje na 42px (bíle přes filtr)
  logoAlt: 'Hugo by Piano',
  tagline: 'Pokladna postavená kolem tvého telefonu, tvého menu a tvých hostů, ne naopak.',
  parentNote: { text: 'Hugo je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Produkt',
      links: [
        { label: 'Hugo POS', href: '/#produkt' },
        { label: 'Tap to Pay', href: '/#produkt' },
        { label: 'Piano Brain', href: '/#brain' },
        { label: 'Hardware', href: '/#spolehlivost' },
      ],
    },
    {
      heading: 'Řešení',
      links: [
        { label: 'Restaurace', href: '/#produkt' },
        { label: 'Kavárny a bary', href: '/#produkt' },
        { label: 'Hotely', href: '/#produkt' },
        { label: 'Food trucky', href: '/#cenik' },
      ],
    },
    {
      heading: 'Společnost',
      links: [
        { label: 'Reference', href: '/#reference' },
        { label: 'Ceník', href: '/#cenik' },
        { label: 'Kontakt', href: '/#zacit' },
      ],
    },
  ],
  contact: {
    heading: 'Podpora',
    items: [
      { label: 'Volej zdarma', value: '800 331 122', href: 'tel:800331122' },
      { value: 'Po–Ne 8–22' },
      { label: 'Přihlášení', value: 'pos.unlikeotherai.com', href: 'https://pos.unlikeotherai.com/' },
    ],
  },
  legal: [
    { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
    { label: 'Ochrana osobních údajů', href: '/ochrana-udaju' },
    { label: 'Cookies', href: '/cookies' },
  ],
  copyright: `© ${year} Hugo. Pohání Piano.`,
};
