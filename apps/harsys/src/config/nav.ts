/**
 * Navigace — ABX HARSYS (per-web). Předává se do sdíleného <Header nav cta>.
 * Komponenta se NEFORKUJE — jen jí dodáme jiná data.
 * Struktura dle IA původního webu (Program / Ceník / Hardware / Podpora / O nás).
 * Pozn.: část položek zatím míří na nejbližší postavenou stránku nebo kotvu na
 * homepage; samostatné podstránky (rozšíření, hardware, demoverze, přechod,
 * instalace, o-nas…) doplníme později.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

export const harsysNav: NavItem[] = [
  {
    label: 'Program',
    href: '/funkce',
    children: [
      { label: 'Srovnání variant', href: '/srovnani-variant', description: 'Rozdíly mezi Lite, Gold, Gold+NET a Premium', icon: 'lucide:table-2' },
      { label: 'Funkce programu', href: '/funkce', description: 'Co všechno Harsys umí', icon: 'lucide:layout-grid' },
      { label: 'Reference', href: '/reference', description: 'Spokojení zákazníci po celé ČR', icon: 'lucide:star' },
      { label: 'Časté dotazy', href: '/#faq', description: 'Odpovědi na nejčastější otázky', icon: 'lucide:help-circle' },
    ],
  },
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
  pianoNavItem('harsys'),
];

export const harsysCta: NavLink = { label: 'Konzultace zdarma', href: '/#poptavka' };
