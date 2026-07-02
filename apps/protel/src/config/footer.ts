/**
 * Patička webu Protel (per-web data pro sdílený @piano/ui Footer).
 * Kontakty ze starého protelsystems.cz / protel-context.md.
 * Sloupec „Řešení" zpřístupňuje tematické landing pages (SEO).
 */
const year = new Date().getFullYear();

export const protelFooter = {
  brand: 'Protel',
  logoSrc: '/logos/protel_by_piano.svg',  // "by Piano" lockup; sdílený Footer ho renderuje bíle na 42px
  logoAlt: 'Protel by Piano',
  tagline: 'Hotelový systém (PMS) pro kompletní řízení hotelu. Mezinárodní standard s plnohodnotnou českou a slovenskou podporou.',
  parentNote: { text: 'Protel je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Produkty',
      links: [
        { label: 'Hotelový systém (PMS)', href: '/produkty/hotelovy-system-protel' },
        { label: 'Platební řešení hotelu', href: '/produkty/platebni-reseni-hotelu' },
        { label: 'Online check-in/out', href: '/produkty/online-check-in-out' },
        { label: 'Room Service', href: '/produkty/room-service' },
        { label: 'Hotelové řetězce', href: '/produkty/hotelove-retezce' },
        { label: 'Napojení a integrace', href: '/napojeni' },
        { label: 'Všechny produkty', href: '/produkty' },
      ],
    },
    {
      heading: 'Řešení',
      links: [
        { label: 'Digitální recepce', href: '/digitalni-recepce' },
        { label: 'Automatizace rezervací', href: '/automatizace-rezervaci' },
        { label: 'Inteligentní platby', href: '/inteligentni-platby' },
        { label: 'Úspory v hotelu', href: '/uspory-v-hotelu' },
        { label: 'Přehledný provoz hotelu', href: '/prehledny-provoz-hotelu' },
        { label: 'Čísla pod kontrolou', href: '/cisla-pod-kontrolou' },
        { label: 'Řízení více hotelů', href: '/rizeni-vice-hotelu' },
        { label: 'Legislativa hotelu', href: '/legislativa-hotelu' },
        { label: 'Fantastický hotel', href: '/fantasticky-hotel' },
      ],
    },
    {
      heading: 'Společnost',
      links: [
        { label: 'O Protelu', href: '/o-protelu' },
        { label: 'Naši zákazníci', href: '/nasi-zakaznici' },
        { label: 'Ceník', href: '/cenik' },
        { label: 'Podpora', href: '/podpora' },
        { label: 'Protel pro školy', href: '/protel-pro-skoly' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
    },
  ],
  contact: {
    heading: 'Kontakt',
    items: [
      { label: 'Obchod', value: 'sales@protelsystems.cz', href: 'mailto:sales@protelsystems.cz' },
      { value: '+420 257 011 107', href: 'tel:+420257011107' },
      { label: 'Hotline', value: 'help@protelsystems.cz', href: 'mailto:help@protelsystems.cz' },
      { label: 'Hotline tel.', value: '+420 778 776 835', href: 'tel:+420778776835' },
      { value: 'protel systems s.r.o., Thámova 166/18, 186 00 Praha 8 – Karlín' },
    ],
  },
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/protelsystems', icon: 'lucide:facebook' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/protel-systems', icon: 'lucide:linkedin' },
  ],
  legal: [
    { label: 'Zpracování osobních údajů', href: '/ochrana-udaju' },
    { label: 'Cookies', href: '/cookies' },
  ],
  copyright: `© ${year} protel systems s.r.o.`,
};
