/**
 * Navigace: Savarin (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE: jen jí dodáme jiná data.
 * Struktura: jeden dropdown „Moduly" se všemi moduly (symetricky), pak
 * konverzní/servisní stránky a Kontakt + položka Piano (ekosystém).
 * Každý modul má vlastní URL (žádné kotvy) kvůli SEO i čistšímu UX.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

export const savarinNav: NavItem[] = [
  {
    label: 'Moduly',
    href: '/#moduly',
    children: [
      { label: 'Pokladna', href: '/pokladna', description: 'Restaurační, hotelová a samoobslužná verze', icon: 'lucide:monitor' },
      { label: 'Mobilní pokladna', href: '/mobilni-pokladna', description: 'Mobilní číšník: objednávky přímo u stolu', icon: 'lucide:smartphone' },
      { label: 'Pokladní komponenty', href: '/pokladni-komponenty', description: 'POS, monitory, tiskárny, klávesnice', icon: 'lucide:keyboard' },
      { label: 'Recepce', href: '/recepce', description: 'Rezervace, ubytování, účty a směnárna', icon: 'lucide:bed-double' },
      { label: 'Sklady a kalkulace', href: '/sklady-a-kalkulace', description: 'Skladová evidence, kalkulace a odpisy z pokladen', icon: 'lucide:calculator' },
    ],
  },
  { label: 'Ceník', href: '/cenik' },
  { label: 'Servis', href: '/servis' },
  { label: 'Aktuálně', href: '/aktualne' },
  { label: 'Kontakt', href: '/kontakt' },
  pianoNavItem('savarin'),
  // Demoverze záměrně až za ekosystémem: sedí hned nalevo od CTA tlačítka.
  { label: 'Demoverze', href: '/demoverze' },
];

// CTA sjede na poptávkový formulář na aktuální stránce (#poptavka je na všech
// modulových i konverzních stránkách). Relativní kotva = scroll bez přenačtení.
export const savarinCta: NavLink = { label: 'Nezávazná poptávka', href: '#poptavka' };

// Na mobilu (pod 1100 px) se hlavní CTA schová do draweru. Do lišty vedle
// burgeru proto dáváme krátké „Kontakt", ať je kontakt vidět bez otevření menu.
export const savarinMobileCta: NavLink = { label: 'Kontakt', href: '/kontakt' };

/**
 * Patička: per-web data (vzor apps/harsys). Bez nich Footer padal na Piano
 * defaulty: kontakt Piano Solutions, sociální sítě Piana a odkazy /pilot,
 * /o-nas, /blog… (na tomhle webu 404). Kontakt dle contexty/produkty/savarin-context.md
 * a stránky /kontakt. Sociální sítě Savarin nemá, proto prázdné pole.
 */
export const savarinFooter = {
  currentId: 'savarin',   // pravidlo: na webu pokladny se ostatní pokladny skupiny nezobrazují
  brand: 'Savarin',
  logoSrc: '/logos/savarin_by_piano.svg',
  logoAlt: 'Savarin by Piano',
  tagline: 'Modulární systém pro stravovací a ubytovací provozy: pokladna, recepce, sklady a kalkulace na jednom místě.',
  parentNote: { text: 'Savarin je součástí skupiny Piano', href: 'https://piano.cz' },
  columns: [
    {
      heading: 'Moduly',
      links: [
        { label: 'Pokladna', href: '/pokladna' },
        { label: 'Mobilní pokladna', href: '/mobilni-pokladna' },
        { label: 'Pokladní komponenty', href: '/pokladni-komponenty' },
        { label: 'Recepce', href: '/recepce' },
        { label: 'Sklady a kalkulace', href: '/sklady-a-kalkulace' },
      ] as NavLink[],
    },
    {
      heading: 'Savarin',
      links: [
        { label: 'Ceník', href: '/cenik' },
        { label: 'Servis', href: '/servis' },
        { label: 'Demoverze', href: '/demoverze' },
        { label: 'Technické předpoklady', href: '/technicke-predpoklady' },
        { label: 'Aktuálně', href: '/aktualne' },
        { label: 'Kontakt', href: '/kontakt' },
      ] as NavLink[],
    },
  ],
  contact: {
    heading: 'Kontakt',
    items: [
      { value: 'ComInn, s.r.o.' },
      { value: 'Fügnerovo nábřeží 5476, 760 01 Zlín' },
      { value: '+420 577 925 145', href: 'tel:+420577925145' },
      { value: 'obchod@savarin.cz', href: 'mailto:obchod@savarin.cz' },
      { label: 'IČ', value: '47906499' },
      { label: 'DIČ', value: 'CZ47906499' },
    ],
  },
  social: [],
  legal: [{ label: 'Ochrana osobních údajů', href: '/ochrana-udaju' }] as NavLink[],
  copyright: `© ${new Date().getFullYear()} ComInn, s.r.o.`,
};
