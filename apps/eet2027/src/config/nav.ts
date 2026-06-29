/**
 * Navigace webu EET 2027 (per-web data pro sdileny @piano/ui Header).
 * Jednoducha kotvova navigace na sekce jednostranky. Bez ekosystemovych odkazu.
 */
import type { NavItem, NavLink } from '@piano/ui/config/nav';

export const eetNav: NavItem[] = [
  { label: 'Co se mění', href: '/#co-se-meni' },
  { label: 'Koho se týká', href: '/#koho' },
  { label: 'Jak se připravit', href: '/#priprava' },
  { label: 'Časté dotazy', href: '/#faq' },
];

export const eetCta: NavLink = { label: 'Nezávazná konzultace', href: '/#konzultace' };
