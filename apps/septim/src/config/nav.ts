/**
 * Navigace webu Septim (per-web data pro sdílený @piano/ui Header).
 * Struktura dle IA: Řešení · Produkty (edice/funkce/integrace) · Piano (ekosystém, externí) · Ceník · O Septimu.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';

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
      ],
    },
    {
      label: 'Integrace a zařízení',
      links: [
        { label: 'Foodora & Wolt', href: '/integrace/foodora-wolt', icon: 'lucide:bike' },
        { label: 'Kuchyňské displeje', href: '/integrace/kuchynske-displeje', icon: 'lucide:tv' },
        { label: 'Pagery', href: '/integrace/pagery', icon: 'lucide:bell' },
        { label: 'Objednávkové systémy', href: '/integrace/objednavkove-systemy', icon: 'lucide:tablet' },
      ],
    },
  ],
};

// Piano ekosystém — externí odkazy na weby produktů (URL k potvrzení)
const pianoMega = {
  columns: [
    {
      label: 'Piano ekosystém',
      links: [
        { label: 'Qerko', href: 'https://www.qerko.com', description: 'Platby a objednávky QR kódem', icon: 'lucide:qr-code' },
        { label: 'Protel', href: 'https://www.protelsystems.cz', description: 'Hotelový systém (PMS)', icon: 'lucide:building-2' },
        { label: 'Pecosta', href: 'https://www.pecosta.cz', description: 'Automatické naskladňování', icon: 'lucide:package' },
        { label: 'Grason', href: 'https://www.grason.cz', description: 'Plánování směn a personál', icon: 'lucide:users' },
      ],
    },
  ],
};

export const septimNav: NavItem[] = [
  { label: 'Řešení', href: '/reseni', mega: reseniMega },
  { label: 'Produkty', href: '/produkty', mega: produktyMega },
  { label: 'Piano', href: 'https://piano.cz', mega: pianoMega },
  { label: 'Ceník', href: '/cenik' },
  {
    label: 'O Septimu', href: '/o-spolecnosti',
    children: [
      { label: 'O společnosti', href: '/o-spolecnosti', icon: 'lucide:building' },
      { label: 'Reference', href: '/reference', icon: 'lucide:star' },
      { label: 'Služby a servis', href: '/sluzby-servis', icon: 'lucide:wrench' },
      { label: 'Blog', href: '/blog', icon: 'lucide:newspaper' },
      { label: 'Kariéra', href: '/kariera', icon: 'lucide:briefcase' },
      { label: 'Kontakt', href: '/kontakt', icon: 'lucide:mail' },
    ],
  },
];

export const septimCta: NavLink = { label: 'Chci Septim', href: '/#poptavka' };
