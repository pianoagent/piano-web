/**
 * Navigace webu EET 2027 (per-web data pro sdileny @piano/ui Header).
 * Jednoducha kotvova navigace na sekce jednostranky + ekosystem Piano
 * (polozka Piano je na vsech webech skupiny).
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';
import { pianoNavItem } from '@piano/ui/config/piano-ecosystem';

export const eetNav: NavItem[] = [
  { label: 'Co se mění', href: '/#co-se-meni' },
  { label: 'Koho se týká', href: '/#koho' },
  { label: 'Jak se připravit', href: '/#priprava' },
  { label: 'Časté dotazy', href: '/#faq' },
  pianoNavItem(),
];

export const eetCta: NavLink = { label: 'Nezávazná konzultace', href: '/#konzultace' };
