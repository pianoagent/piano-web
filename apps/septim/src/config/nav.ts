/**
 * Navigace webu Septim (per-web data pro sdílený @piano/ui Header).
 * Struktura dle IA: Řešení · Produkty (edice/funkce/integrace) · Piano (ekosystém, externí) · Ceník · O Septimu.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

const reseniMega = {
  columns: [
    {
      label: 'Pro koho',
      links: [
        { label: 'Restaurace', href: '/reseni/restaurace', icon: 'lucide:utensils-crossed' },
        { label: 'Sítě restaurací', href: '/reseni/site-restauraci', icon: 'lucide:network' },
        { label: 'Kavárny, bistra, bary', href: '/reseni/kavarny-bistra-bary', icon: 'lucide:coffee' },
        { label: 'Jídelny', href: '/reseni/jidelny', icon: 'lucide:soup' },
        { label: 'Hotely', href: '/reseni/hotely', icon: 'lucide:bed-double' },
        { label: 'Catering', href: '/reseni/catering', icon: 'lucide:concierge-bell' },
        { label: 'Street food', href: '/reseni/street-food', icon: 'lucide:truck' },
        { label: 'Lázně a resorty', href: '/reseni/lazne-resorty', icon: 'lucide:waves' },
      ],
    },
  ],
};

const produktyMega = {
  columns: [
    {
      label: 'Edice',
      links: [
        { label: 'Septim.4', href: '/produkty/septim-4', icon: 'lucide:monitor' },
        { label: 'Septim.Air', href: '/produkty/septim-air', icon: 'lucide:cloud' },
        { label: 'Septim.Jídelna', href: '/produkty/septim-jidelna', icon: 'lucide:soup' },
        { label: 'Septim.Hotel', href: '/produkty/septim-hotel', icon: 'lucide:bed-double' },
        { label: 'Septim.Go', href: '/produkty/septim-go', icon: 'lucide:smartphone' },
        { label: 'MySeptim', href: '/produkty/myseptim', icon: 'lucide:line-chart' },
      ],
    },
    {
      label: 'Funkce',
      links: [
        { label: 'Pokladna', href: '/funkce/pokladna', icon: 'lucide:monitor' },
        { label: 'Skladové hospodářství', href: '/funkce/skladove-hospodarstvi', icon: 'lucide:boxes' },
        { label: 'Manažer', href: '/funkce/manazer', icon: 'lucide:sliders-horizontal' },
        { label: 'Reporty a přehledy', href: '/funkce/reporty-prehledy', icon: 'lucide:bar-chart-3' },
        { label: 'Věrnostní systém', href: '/funkce/vernostni-system', icon: 'lucide:award' },
        { label: 'E-shop', href: '/funkce/eshop-restaurace', icon: 'lucide:shopping-cart' },
        { label: 'Nastavení', href: '/funkce/nastaveni', icon: 'lucide:settings' },
        { label: 'Hardware do restaurace', href: '/funkce/hardware-do-restaurace', icon: 'lucide:hard-drive' },
      ],
    },
    {
      label: 'Integrace a zařízení',
      links: [
        { label: 'Foodora & Wolt', href: '/integrace/foodora-wolt', icon: 'lucide:bike' },
        { label: 'Platby QR kódem (Qerko)', href: '/integrace/platby-objednavky-qr-kodem', icon: 'lucide:qr-code' },
        { label: 'Automatické naskladňování', href: '/integrace/automaticke-naskladnovani', icon: 'lucide:boxes' },
        { label: 'Plánování směn (Grason)', href: '/integrace/planovani-smen', icon: 'lucide:calendar-days' },
        { label: 'Kuchyňské displeje', href: '/integrace/kuchynske-displeje', icon: 'lucide:tv' },
        { label: 'Pagery', href: '/integrace/pagery', icon: 'lucide:bell' },
        { label: 'Objednávkové systémy', href: '/integrace/objednavkove-systemy', icon: 'lucide:tablet' },
      ],
    },
  ],
};


export const septimNav: NavItem[] = [
  { label: 'Řešení', href: '/reseni', mega: reseniMega },
  { label: 'Produkty', href: '/produkty', mega: produktyMega },
  pianoNavItem('septim'),
  { label: 'Ceník', href: '/cenik' },
  {
    label: 'O Septimu', href: '/o-spolecnosti',
    children: [
      { label: 'O společnosti', href: '/o-spolecnosti', icon: 'lucide:building' },
      { label: 'Reference', href: '/reference', icon: 'lucide:star' },
      { label: 'Služby a servis', href: '/sluzby-servis', icon: 'lucide:wrench' },
      { label: 'Technické rady a FAQ', href: '/technicke-rady-faq', icon: 'lucide:circle-help' },
      { label: 'Kariéra', href: '/kariera', icon: 'lucide:briefcase' },
      { label: 'Kontakt', href: '/kontakt', icon: 'lucide:mail' },
    ],
  },
];

export const septimCta: NavLink = { label: 'Chci Septim', href: '/#poptavka' };
