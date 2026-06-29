/**
 * Paticka webu EET 2027 (per-web data pro sdileny @piano/ui Footer).
 * Vlastni neutralni obsah, bez ekosystemovych odkazu a bez zminky o jinych brandech.
 */
const year = new Date().getFullYear();

export const eetFooter = {
  brand: 'EET 2027',
  mark: false,
  tagline: 'Prehledny pruvodce navratem elektronicke evidence trzeb od 1. ledna 2027. Co se meni, koho se to tyka a jak se vcas pripravit.',
  columns: [
    {
      heading: 'Informace',
      links: [
        { label: 'Co se mění', href: '/#co-se-meni' },
        { label: 'Koho se týká', href: '/#koho' },
        { label: 'Jak se připravit', href: '/#priprava' },
        { label: 'Časté dotazy', href: '/#faq' },
      ],
    },
  ],
  contact: {
    heading: 'Kontakt',
    items: [
      { label: 'E-mail', value: 'info@eet2027.cz', href: 'mailto:info@eet2027.cz' },
      { value: 'Nezávazná konzultace zdarma' },
    ],
  },
  social: [],
  legal: [
    { label: 'Ochrana osobních údajů', href: '/ochrana-udaju' },
  ],
  copyright: `© ${year} EET 2027`,
};
