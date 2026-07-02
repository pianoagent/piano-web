/**
 * Navigace webu Protel (per-web data pro sdílený @piano/ui Header).
 * Struktura dle IA starého protelsystems.cz: Řešení (tematické landingy) ·
 * Produkty (systém / digitální recepce / doplňky) · Piano (ekosystém, externí) ·
 * Ceník · O Protelu. Slugy odpovídají starému webu (SEO).
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

const reseniMega = {
  columns: [
    {
      label: 'Provozní funkce',
      links: [
        { label: 'Automatizace rezervací', href: '/automatizace-rezervaci', icon: 'lucide:refresh-cw' },
        { label: 'Digitální recepce', href: '/digitalni-recepce', icon: 'lucide:smartphone' },
        { label: 'Inteligentní platby', href: '/inteligentni-platby', icon: 'lucide:credit-card' },
        { label: 'Úspory v hotelu', href: '/uspory-v-hotelu', icon: 'lucide:piggy-bank' },
      ],
    },
    {
      label: 'Manažerské funkce',
      links: [
        { label: 'Přehledný provoz hotelu', href: '/prehledny-provoz-hotelu', icon: 'lucide:eye' },
        { label: 'Čísla pod kontrolou', href: '/cisla-pod-kontrolou', icon: 'lucide:line-chart' },
        { label: 'Řízení více hotelů', href: '/rizeni-vice-hotelu', icon: 'lucide:building-2' },
        { label: 'Legislativa hotelu', href: '/legislativa-hotelu', icon: 'lucide:scale' },
      ],
    },
    {
      label: 'Koncepty',
      links: [
        { label: 'Fantastický hotel', href: '/fantasticky-hotel', icon: 'lucide:sparkles' },
        { label: 'Protel pro školy', href: '/protel-pro-skoly', icon: 'lucide:graduation-cap' },
      ],
    },
  ],
};

const produktyMega = {
  columns: [
    {
      label: 'Systém Protel',
      links: [
        { label: 'Hotelový systém (PMS)', href: '/produkty/hotelovy-system-protel', icon: 'lucide:layout-dashboard' },
        { label: 'Platební řešení hotelu', href: '/produkty/platebni-reseni-hotelu', icon: 'lucide:credit-card' },
        { label: 'Room Service', href: '/produkty/room-service', icon: 'lucide:concierge-bell' },
        { label: 'Konference', href: '/produkty/konference', icon: 'lucide:presentation' },
        { label: 'Housekeeping', href: '/produkty/housekeeping', icon: 'lucide:bed-double' },
        { label: 'MealPlan', href: '/produkty/meal-plan', icon: 'lucide:soup' },
      ],
    },
    {
      label: 'Digitální recepce',
      links: [
        { label: 'Online check-in/out', href: '/produkty/online-check-in-out', icon: 'lucide:smartphone' },
        { label: 'Kiosek', href: '/produkty/kiosek', icon: 'lucide:monitor-smartphone' },
        { label: 'Digitální registrační karta', href: '/produkty/digitalni-registracni-karta', icon: 'lucide:file-signature' },
        { label: 'Digitální hotelová kniha', href: '/produkty/digitalni-hotelova-kniha', icon: 'lucide:book-open' },
        { label: 'Čtečka dokladů', href: '/produkty/ctecka-dokladu', icon: 'lucide:scan-line' },
      ],
    },
    {
      label: 'Doplňky',
      links: [
        { label: 'Webové rezervace', href: '/produkty/webove-rezervace', icon: 'lucide:globe' },
        { label: 'Automatický mailing', href: '/produkty/automaticky-mailing', icon: 'lucide:mail' },
        { label: 'Hotelové řetězce', href: '/produkty/hotelove-retezce', icon: 'lucide:network' },
        { label: 'Napojení a integrace', href: '/napojeni', icon: 'lucide:plug' },
      ],
    },
  ],
  footer: { label: 'Všechny produkty', href: '/produkty' },
};

export const protelNav: NavItem[] = [
  { label: 'Řešení', href: '/#reseni', mega: reseniMega },
  { label: 'Produkty', href: '/produkty', mega: produktyMega },
  pianoNavItem('protel'),
  { label: 'Ceník', href: '/cenik' },
  {
    label: 'O Protelu', href: '/o-protelu',
    children: [
      { label: 'O společnosti', href: '/o-protelu', icon: 'lucide:building' },
      { label: 'Naši zákazníci', href: '/nasi-zakaznici', icon: 'lucide:star' },
      { label: 'Protel pro školy', href: '/protel-pro-skoly', icon: 'lucide:graduation-cap' },
      { label: 'Podpora', href: '/podpora', icon: 'lucide:life-buoy' },
      { label: 'Kontakt', href: '/kontakt', icon: 'lucide:mail' },
    ],
  },
];

export const protelCta: NavLink = { label: 'Vyzkoušet zdarma', href: '#poptavka' };
