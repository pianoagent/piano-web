/**
 * Navigace webu Pecosta (per-web data pro sdílený @piano/ui Header).
 * Položky míří na reálné podstránky (/sluzby/*, /jak-to-funguje, /reference, /kontakt).
 * Struktura dle bloku #page-pecosta + pecosta-context.md.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

const sluzbyMega = {
  columns: [
    {
      label: 'Co Pecosta umí',
      links: [
        { label: 'Aukční nákupy surovin', href: '/sluzby/aukcni-nakupy', icon: 'lucide:gavel' },
        { label: 'Energie pro gastro', href: '/sluzby/energie', icon: 'lucide:zap' },
        { label: 'Autset — naskladnění', href: '/sluzby/autset', icon: 'lucide:package' },
        { label: 'Burzovní obchody', href: '/sluzby/burzovni-obchody', icon: 'lucide:landmark' },
      ],
    },
    {
      label: 'Pro koho',
      links: [
        { label: 'Restaurace a sítě', href: '/reference', icon: 'lucide:utensils-crossed' },
        { label: 'Hotely a resorty', href: '/reference', icon: 'lucide:bed-double' },
        { label: 'Kavárny a bistra', href: '/reference', icon: 'lucide:coffee' },
        { label: 'Jídelny a kantýny', href: '/reference', icon: 'lucide:soup' },
        { label: 'Školy a nemocnice', href: '/reference', icon: 'lucide:building' },
      ],
    },
  ],
};

export const pecostaNav: NavItem[] = [
  { label: 'Služby', href: '/sluzby/aukcni-nakupy', mega: sluzbyMega },
  { label: 'Jak to funguje', href: '/jak-to-funguje' },
  pianoNavItem('pecosta'),
  { label: 'Reference', href: '/reference' },
  { label: 'Kontakt', href: '/kontakt' },
];

export const pecostaCta: NavLink = { label: 'Analýza zdarma', href: '/kontakt' };
