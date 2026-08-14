/**
 * Body důvěry vedle LeadFormu: vlastní čísla protel.
 * Sdílená komponenta má výchozí hodnoty záměrně bez čísel, protože
 * skupinová čísla Piana nejsou čísla jedné značky. Každý web si je proto
 * dodává sám. Zdroj hodnot je contexty/znalostni-baze.md.
 */
export const protelLeadProofs = [
  { icon: 'lucide:globe', title: 'Globální standard PMS', text: 'Procesy podle evropského standardu.' },
  { icon: 'lucide:headset', title: 'Česká podpora 24/7', text: 'Telefonicky i mailem v ceně měsíčního fee.' },
  { icon: 'lucide:plug', title: 'Napojení bez příplatků', text: 'Systémy třetích stran bez dodatečných poplatků.' },
  { icon: 'lucide:gift', title: 'Konzultace zdarma', text: 'Nezávazně a bez rizika.' },
];
