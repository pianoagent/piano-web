/**
 * Hlavní menu webu Septim (2. 10. 2026). Jediné místo, kde se menu upravuje;
 * markup a mega panely vykresluje components/chrome/Header.astro.
 *
 * Popisy u edic Septimu jsou ze znalostní báze (tabulka produktové řady),
 * u Piana ze sdílené konfigurace packages/ui/config/piano-ecosystem.ts.
 * Pravidlo: na webu Septimu se nezobrazují ostatní pokladny skupiny
 * (Savarin, Harsys, POS Experts), hlídá ho hiddenRivalHrefs.
 */
import { PIANO_PRODUCTS, hiddenRivalHrefs } from '@piano/ui/config/piano-ecosystem';

export interface MenuLink { label: string; href: string; desc?: string; external?: boolean }
export interface MenuGroup { heading: string; links: MenuLink[] }
export interface MenuPanel {
  groups: MenuGroup[];
  /** odkaz pod skupinami, např. „Všechny produkty →“ */
  more?: MenuLink;
  /** boční box: poptávka (sales) nebo kontakty na podporu (support) */
  aside: 'sales' | 'support' | 'piano';
}
export interface MenuItem { label: string; href?: string; panel?: MenuPanel; badge?: boolean }

const pianoIds = ['qerko', 'pecosta', 'grason', 'protel', 'autset', 'pilot', 'terminal'];
/* odkazy na vlastní stránky Septimu o propojení, kde existují */
const pianoLocal: Record<string, string> = {
  qerko: '/partneri/qerko',
  pecosta: '/partneri/pecosta',
  grason: '/partneri/grason',
  protel: '/partneri/protel',
  terminal: '/piano-terminal',
};
const hidden = hiddenRivalHrefs('septim');
const pianoLinks: MenuLink[] = pianoIds
  .map((id) => PIANO_PRODUCTS.find((p) => p.id === id)!)
  .filter((p) => p && !hidden.some((h) => p.href.includes(h)))
  .map((p) => {
    const local = pianoLocal[p.id];
    const href = local ?? (p.path ? `https://piano.cz${p.path}` : p.href);
    return { label: p.label, href, desc: p.description, external: !local };
  });

export const menu: MenuItem[] = [
  {
    label: 'Řešení',
    panel: {
      aside: 'sales',
      groups: [
        {
          heading: 'Řešení pro',
          links: [
            { label: 'Restaurace', href: '/pokladni-provozni-system-pro-restaurace' },
            { label: 'Síť restaurací', href: '/pokladni-provozni-system-pro-sit-restauraci' },
            { label: 'Kavárny, bistra, bary', href: '/pokladni-system-pro-kavarny-bistra-bary' },
            { label: 'Jídelny', href: '/pokladni-provozni-system-pro-jidelny' },
          ],
        },
        {
          heading: ' ',
          links: [
            { label: 'Catering', href: '/pokladni-system-pro-catering' },
            { label: 'Street food', href: '/pokladni-system-pro-street-food' },
            { label: 'Hotely', href: '/pokladni-provozni-system-pro-hotely' },
            { label: 'Lázně a resorty', href: '/pokladni-provozni-system-pro-lazne-resorty' },
          ],
        },
      ],
    },
  },
  {
    label: 'Produkty',
    panel: {
      aside: 'sales',
      more: { label: 'Všechny produkty a moduly', href: '/produkty' },
      groups: [
        {
          heading: 'Systém Septim',
          links: [
            { label: 'Septim.4', href: '/produkty/septim-4-system-pro-restaurace', desc: 'Restaurace a sítě restaurací' },
            { label: 'Septim.Jídelna', href: '/produkty/septim-jidelna-system-pro-zavodni-stravovani', desc: 'Jídelny a závodní stravování' },
            { label: 'Septim.Air', href: '/produkty/septim-air-system-pro-kavarnu-bistro-bar', desc: 'Kavárny, bistra, bary, malé provozy' },
            { label: 'Septim.Go', href: '/produkty/mobilni-cisnik-septim-go', desc: 'Mobilní pokladna a číšník s platbou' },
            { label: 'Septim.Hotel', href: '/produkty/septim-hotel-pos-system-pro-hotely', desc: 'Hotelový POS pro celý hotel' },
            { label: 'MySeptim', href: '/produkty/myseptim', desc: 'Aplikace pro majitele a manažery' },
          ],
        },
        {
          heading: 'Moduly',
          links: [
            { label: 'Pokladna', href: '/produkty/pokladna' },
            { label: 'Manažer', href: '/produkty/manazer' },
            { label: 'Skladové hospodářství', href: '/produkty/skladove-hospodarstvi' },
            { label: 'Věrnostní systém (CRM)', href: '/produkty/vernostni-system-crm' },
            { label: 'Reporty a přehledy', href: '/produkty/reporty-prehledy' },
            { label: 'Nastavení', href: '/produkty/nastaveni' },
            { label: 'Anketa pro jídelny', href: '/produkty/anketa-pro-jidelny' },
            { label: 'Objednávky a výdej pro jídelny', href: '/produkty/objednavky-vydej-pro-jidelny' },
            { label: 'E-shop restaurace', href: '/produkty/eshop-restaurace' },
          ],
        },
        {
          heading: 'Integrace',
          links: [
            { label: 'Piano Terminál', href: '/piano-terminal' },
            { label: 'Foodora a Wolt', href: '/produkty/foodora-a-wolt' },
            { label: 'Plánování směn', href: '/produkty/planovani-smen' },
            { label: 'Kuchyňské displeje', href: '/produkty/kuchynske-displeje' },
            { label: 'Pagery pro restaurace', href: '/produkty/pagery-pro-restaurace' },
            { label: 'Hotelový systém Protel', href: '/produkty/hotelovy-system' },
            { label: 'Automatické naskladňování', href: '/produkty/automaticke-naskladnovani' },
            { label: 'Platby a objednávky QR kódem', href: '/produkty/platby-objednavky-qr-kodem' },
            { label: 'Objednávkové systémy', href: '/produkty/objednavkove-systemy' },
            { label: 'Crunchtime', href: '/partneri/crunchtime' },
            { label: 'Hardware do restaurace', href: '/produkty/hardware-do-restaurace' },
          ],
        },
      ],
    },
  },
  {
    label: 'Služby a servis',
    panel: {
      aside: 'support',
      more: { label: 'Přehled služeb a servisu', href: '/sluzby-servis' },
      groups: [
        {
          heading: 'Podpora',
          links: [
            { label: 'Helpdesk a Hotline', href: '/sluzby-servis/helpdesk-hotline' },
            { label: 'Podmínky servisní smlouvy', href: '/sluzby-servis/podminky-servisni-smlouvy' },
            { label: 'Záruční a pozáruční servis', href: '/sluzby-servis/zarucni-pozarucni-servis' },
            { label: 'Monitoring hardware a software', href: '/sluzby-servis/monitoring-hardware-software' },
          ],
        },
        {
          heading: 'Realizace',
          links: [
            { label: 'Instalace systému Septim', href: '/sluzby-servis/instalace-systemu-septim' },
            { label: 'Konzultace a školení', href: '/sluzby-servis/konzultace-skoleni' },
            { label: 'Vývoj na míru', href: '/sluzby-servis/vyvoj-na-miru' },
            { label: 'Slaboproudé instalace', href: '/sluzby-servis/slaboproude-instalace' },
          ],
        },
      ],
    },
  },
  { label: 'Naši zákazníci', href: '/nasi-zakaznici' },
  { label: 'Ceník', href: '/cenik' },
  {
    label: 'O Septimu',
    panel: {
      aside: 'sales',
      groups: [
        {
          heading: 'Společnost',
          links: [
            { label: 'O společnosti', href: '/o-spolecnosti' },
            { label: 'Naši zákazníci', href: '/nasi-zakaznici' },
            { label: 'Kariéra', href: '/kariera' },
            { label: 'Novinky', href: '/novinky' },
            { label: 'Kontakt', href: '/kontakt' },
          ],
        },
        {
          heading: 'Pro zákazníky',
          links: [
            { label: 'Technické rady FAQ', href: '/technicke-rady-faq' },
            { label: 'Ceník služeb Septim', href: '/cenik-sluzeb-septim' },
            { label: 'Ceník služeb Protel', href: '/cenik-sluzeb-protel' },
            { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
            { label: 'Převod licence', href: '/prevod-licence' },
          ],
        },
        {
          heading: 'Proč Septim',
          links: [
            { label: 'Efektivní řízení restaurace', href: '/efektivni-rizeni-restaurace' },
            { label: 'Spolehlivý pokladní systém', href: '/spolehlivy-pokladni-system' },
          ],
        },
      ],
    },
  },
  {
    label: 'Piano',
    panel: {
      aside: 'piano',
      more: { label: 'Celý ekosystém na piano.cz', href: 'https://piano.cz', external: true },
      groups: [{ heading: 'Septim je součástí skupiny Piano', links: pianoLinks }],
    },
  },
  { label: 'EET 2.0', href: '/eet-20', badge: true },
];
