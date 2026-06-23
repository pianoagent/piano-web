/**
 * Patička webu Qerko (per-web data pro sdílený @piano/ui Footer).
 */
const year = new Date().getFullYear();

export const qerkoFooter = {
  brand: 'Qerko',
  logoSrc: '/logos/qerko_by_piano.svg',  // "by Piano" lockup; v patičce bíle (filtr), výška 42px
  logoAlt: 'Qerko by Piano',
  tagline: 'QR platby od stolu, digitální menu a objednávání. Vyšší dýška, rychlejší obsluha a lepší Google recenze — pomocník na place pro moderní restaurace.',
  parentNote: { text: 'Qerko je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Produkty',
      links: [
        { label: 'Qerko platba', href: '/#qr-platba' },
        { label: 'Digitální menu a objednávka', href: '/#objednavani' },
        { label: 'Qpoint', href: '/#qpoint' },
        { label: 'Rezervace', href: '/#rezervace' },
        { label: 'Věrnostní program', href: '/#vernost' },
        { label: 'Hodnocení a recenze', href: '/#hodnoceni' },
      ],
    },
    {
      heading: 'Společnost',
      links: [
        { label: 'O nás', href: '/o-nas' },
        { label: 'Ceník', href: '/cenik' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
    },
  ],
  contact: {
    heading: 'Kontakt',
    items: [
      { label: 'Obchod', value: '+420 277 277 945', href: 'tel:+420277277945' },
      { value: 'info@qerko.com', href: 'mailto:info@qerko.com' },
      { value: 'Qerko s.r.o., Praha' },
    ],
  },
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/qerko', icon: 'lucide:facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com/qerko', icon: 'lucide:instagram' },
  ],
  legal: [
    { label: 'Obchodní podmínky', href: 'https://www.qerko.com/legal' },
    { label: 'Ochrana osobních údajů', href: 'https://www.qerko.com/legal' },
    { label: 'Cookies', href: 'https://www.qerko.com/legal' },
  ],
  copyright: `© ${year} Qerko s.r.o. · IČO 06678815 · Držitel licence ČNB (platební instituce).`,
};
