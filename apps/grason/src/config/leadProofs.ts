/**
 * Body důvěry vedle LeadFormu: vlastní čísla grason.
 * Sdílená komponenta má výchozí hodnoty záměrně bez čísel, protože
 * skupinová čísla Piana nejsou čísla jedné značky. Každý web si je proto
 * dodává sám. Zdroj hodnot je contexty/znalostni-baze.md.
 */
export const grasonLeadProofs = [
  { icon: 'lucide:users', title: '5 500 brigádníků', text: 'Ověření pracovníci připraveni nastoupit.' },
  { icon: 'lucide:map-pin', title: '82+ měst v ČR', text: 'Praha, Brno, Ostrava i menší města.' },
  { icon: 'lucide:calendar-days', title: '220 000+ směn', text: 'Naplánovaných a obsazených.' },
  { icon: 'lucide:gift', title: 'Konzultace zdarma', text: 'Nezávazně a bez rizika.' },
];
