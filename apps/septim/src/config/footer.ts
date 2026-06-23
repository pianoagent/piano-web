/**
 * Patička webu Septim (per-web data pro sdílený @piano/ui Footer).
 */
const year = new Date().getFullYear();

export const septimFooter = {
  brand: 'Septim',
  logoSrc: '/logos/septim_by_piano.svg',  // plný lockup; v patičce bíle (filtr) a větší
  tagline: 'Pokladní a provozní systém pro restaurace, jídelny, kavárny a hotely. 30 let na trhu, česká podpora 24/7.',
  parentNote: { text: 'Septim je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Společnost',
      links: [
        { label: 'O společnosti', href: '/o-spolecnosti' },
        { label: 'Reference', href: '/reference' },
        { label: 'Kariéra', href: '/kariera' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
    },
    {
      heading: 'Podpora',
      links: [
        { label: 'Ceník', href: '/cenik' },
        { label: 'Služby a servis', href: '/sluzby-servis' },
        { label: 'Blog', href: '/blog' },
      ],
    },
  ],
  contact: {
    heading: 'Kontakt',
    items: [
      { label: 'Obchod', value: 'obchod@septim.cz', href: 'mailto:obchod@septim.cz' },
      { value: '+420 257 011 100', href: 'tel:+420257011100' },
      { label: 'Helpdesk', value: '+420 257 011 101', href: 'tel:+420257011101' },
      { label: 'Hotline 24/7', value: '+420 777 737 846', href: 'tel:+420777737846' },
      { value: 'Septim Systems a.s.' },
    ],
  },
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61554302241439', icon: 'lucide:facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com/septim_cz', icon: 'lucide:instagram' },
    { label: 'YouTube', href: 'https://www.youtube.com/@Pokladny', icon: 'lucide:youtube' },
  ],
  legal: [
    { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
    { label: 'Ochrana osobních údajů', href: '/ochrana-udaju' },
    { label: 'Cookies', href: '/cookies' },
  ],
  copyright: `© ${year} Septim Systems a.s.`,
};
