/**
 * Navigace webu Pecosta (per-web data pro sdílený @piano/ui Header).
 * První verze webu = jednostránková: hlavní položky míří na kotvy homepage,
 * aby nevznikaly 404. Detailní podstránky (Řešení, Služby) se doplní později.
 * Struktura dle bloku #page-pecosta + pecosta-context.md.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

const sluzbyMega = {
  columns: [
    {
      label: 'Co Pecosta umí',
      links: [
        { label: 'Aukční nákupy surovin', href: '/#funkce', icon: 'lucide:gavel' },
        { label: 'Energie pro gastro', href: '/#funkce', icon: 'lucide:zap' },
        { label: 'Autset — naskladnění', href: '/#funkce', icon: 'lucide:package' },
        { label: 'Burzovní obchody', href: '/#funkce', icon: 'lucide:line-chart' },
        { label: 'Přehled nákladů', href: '/#funkce', icon: 'lucide:bar-chart-3' },
        { label: 'Analýza zdarma', href: '/#poptavka', icon: 'lucide:badge-percent' },
      ],
    },
    {
      label: 'Pro koho',
      links: [
        { label: 'Restaurace a sítě', href: '/#reference', icon: 'lucide:utensils-crossed' },
        { label: 'Hotely a resorty', href: '/#reference', icon: 'lucide:bed-double' },
        { label: 'Kavárny a bistra', href: '/#reference', icon: 'lucide:coffee' },
        { label: 'Jídelny a kantýny', href: '/#reference', icon: 'lucide:soup' },
        { label: 'Školy a nemocnice', href: '/#reference', icon: 'lucide:building' },
      ],
    },
  ],
};

export const pecostaNav: NavItem[] = [
  { label: 'Služby', href: '/#funkce', mega: sluzbyMega },
  { label: 'Jak to funguje', href: '/#jak-to-funguje' },
  pianoNavItem('pecosta'),
  { label: 'Reference', href: '/#reference' },
  { label: 'Kontakt', href: '/#poptavka' },
];

export const pecostaCta: NavLink = { label: 'Analýza zdarma', href: '/#poptavka' };
