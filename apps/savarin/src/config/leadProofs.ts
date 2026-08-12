/**
 * Body důvěry vedle LeadFormu: vlastní čísla savarin.
 * Sdílená komponenta má výchozí hodnoty záměrně bez čísel, protože
 * skupinová čísla Piana nejsou čísla jedné značky. Každý web si je proto
 * dodává sám. Zdroj hodnot je contexty/znalostni-baze.md.
 */
export const savarinLeadProofs = [
  { icon: 'lucide:calendar-check', title: 'Na trhu od 1990', text: 'Průkopník pokladních systémů v Česku.' },
  { icon: 'lucide:headset', title: 'Podpora 24/7', text: 'Pro klienty se servisní smlouvou.' },
  { icon: 'lucide:timer', title: 'Zásah do 24 hodin', text: 'Garantovaný termín servisního zásahu.' },
  { icon: 'lucide:refresh-cw', title: 'Aktualizace 4x ročně', text: 'Březen, červen, září a listopad.' },
];
