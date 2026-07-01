/**
 * Navigace — ABX HARSYS (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE — jen jí dodáme jiná data.
 * Struktura dle IA původního webu (Program / Ceník / Hardware / Podpora / O nás).
 * Program = mega menu (dvě kolonky: program + produkty a moduly).
 * Pozn.: Hardware a část Podpory zatím míří na kotvy/nejbližší stránku;
 * samostatné podstránky (hardware, demoverze, přechod, instalace, aktuality…)
 * doplníme později.
 */
import type { NavItem, NavLink, MegaPanel } from '@piano/ui/config/nav';

const programMega: MegaPanel = {
  columns: [
    {
      label: 'Program',
      links: [
        { label: 'Srovnání variant', href: '/srovnani-variant', description: 'Lite, Gold, Gold+NET, Premium', icon: 'lucide:table-2' },
        { label: 'Funkce programu', href: '/funkce', description: 'Co všechno Harsys umí', icon: 'lucide:layout-grid' },
        { label: 'Rozšíření a moduly', href: '/rozsireni', description: 'Doplňkové moduly na míru', icon: 'lucide:puzzle' },
        { label: 'Reference', href: '/reference', description: 'Spokojení zákazníci po ČR', icon: 'lucide:star' },
        { label: 'Časté dotazy', href: '/#faq', description: 'Odpovědi na časté otázky', icon: 'lucide:help-circle' },
      ],
    },
    {
      label: 'Produkty a moduly',
      links: [
        { label: 'Mobilní číšník', href: '/mobilni-cisnik', description: 'Objednávky a platby od stolu', icon: 'lucide:smartphone' },
        { label: 'eBony — kitchen monitor', href: '/ebony-kitchen-monitor', description: 'Elektronická bonovačka', icon: 'lucide:monitor' },
        { label: 'Platební terminály', href: '/platebni-terminal', description: 'Platby kartou propojené s kasou', icon: 'lucide:credit-card' },
        { label: 'Integrace', href: '/integrace', description: 'Qerko, e-shop, hotely, AUTSET', icon: 'lucide:plug' },
        { label: 'EET od 2027', href: '/eet-2027', description: 'Na EET 2.0 jsme připraveni', icon: 'lucide:receipt' },
        { label: 'PianoPilot', href: '/pianopilot', description: 'Napojení na platformu Piano', icon: 'lucide:link' },
      ],
    },
  ],
  footer: { label: 'Zobrazit všechny funkce programu', href: '/funkce' },
};

export const harsysNav: NavItem[] = [
  { label: 'Program', href: '/funkce', mega: programMega },
  { label: 'Ceník', href: '/cenik' },
  { label: 'Hardware', href: '/#hardware' },
  {
    label: 'Podpora',
    href: '/kontakt',
    children: [
      { label: 'Demoverze zdarma', href: '/#poptavka', description: 'Vyzkoušejte Harsys nezávazně', icon: 'lucide:download' },
      { label: 'Napište nám', href: '/kontakt', description: 'Kontaktní údaje a poptávka', icon: 'lucide:mail' },
    ],
  },
  { label: 'O nás', href: '/kontakt' },
];

export const harsysCta: NavLink = { label: 'Konzultace zdarma', href: '/#poptavka' };
