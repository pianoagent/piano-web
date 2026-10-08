/**
 * Pruvodce vyberem pokladny (sekce #pruvodce na homepage).
 * Tri kroky: typ podniku -> velikost -> co potrebujete. Vysledkem je jeden ze ctyr produktu
 * a predvyplnena zprava v poptavkovem formulari (#poptavka -> Databridge -> Odoo).
 *
 * Zdroje: contexty/produkty/hugo-context.md a septim-context.md, potreby ze stare verze
 * pruvodce (commit bae9647) a mapy funkci (weby/mapa-funkci-handover.zip).
 * Ceny dodal Krystof 6. 10. 2026: Hugo 190 Kc, Air od 490 Kc (novy Air od 15. 10.),
 * Septim.4 a Enterprise na dotaz. Featury Airu (sklad, receptury, cisnik, stravenky) jsou z mapy funkci. Kdyz se zmeni, staci prepsat `price` nize.
 * Septim Enterprise = jidelny a kantyny (Krystof 6. 10. 2026).
 */

export type ProductId = 'hugo' | 'air' | 'septim4' | 'enterprise';

export interface Option { value: string; label: string; icon?: string }

export interface Need extends Option { tier: Exclude<ProductId, 'enterprise'> }

export interface Product {
  id: ProductId;
  name: string;
  tag: string;
  sub: string;
  feats: string[];
  price: string;
  priceNote: string;
  // Pripravenost na EET 2.0 ma oporu jen u Huga (hugo-context) a Airu (mapa funkci, radky EET 2.0 = ANO).
  // U Septimu.4 a Enterprise ji baze zatim neuvadi, proto bez odznaku, dokud ji nikdo nepotvrdi.
  eet: boolean;
}

// Krok 1: typ podniku. Hodnoty drzi stejne kategorie jako odber novinek.
export const typy: Option[] = [
  { value: 'kavarna', label: 'Kavárna, bistro, bar', icon: 'lucide:coffee' },
  { value: 'restaurace', label: 'Restaurace, hospoda', icon: 'lucide:utensils-crossed' },
  { value: 'hotel', label: 'Hotel, penzion', icon: 'lucide:bed-double' },
  { value: 'stanek', label: 'Stánek, food truck, fastfood', icon: 'lucide:truck' },
  { value: 'jidelna', label: 'Jídelna, kantýna', icon: 'lucide:soup' },
  { value: 'jine', label: 'Něco jiného', icon: 'lucide:store' },
];

// Krok 2: velikost provozu.
export const velikosti: Option[] = [
  { value: '1', label: 'Jedna pokladna, klidně jen mobil' },
  { value: '2-3', label: '2 až 3 pokladny' },
  { value: '4+', label: '4 a víc pokladen' },
  { value: 'pobocky', label: 'Víc poboček' },
];

// Krok 3: potreby (nepovinne). tier = nejnizsi produkt, ktery potrebu pokryje.
// "Prace offline" tu zamerne neni: podle baze ji umi i Hugo, takze nerozlisuje.
export const potreby: Need[] = [
  { value: 'tap-to-pay', label: 'Platby kartou přímo na mobilu', tier: 'hugo' },
  { value: 'rychly-start', label: 'Rychlý start bez instalace', tier: 'hugo' },
  { value: 'sklad', label: 'Sklad, receptury a inventura', tier: 'air' },
  { value: 'cisnik', label: 'Mobilní číšník u stolu', tier: 'air' },
  { value: 'stravenky', label: 'Stravenky a faktury', tier: 'air' },
  { value: 'pobocky', label: 'Více poboček z jednoho místa', tier: 'septim4' },
  { value: 'crm', label: 'Věrnostní program', tier: 'septim4' },
  { value: 'rozvoz', label: 'Rozvoz přes Wolt a Foodoru', tier: 'septim4' },
  { value: 'reporty', label: 'Pokročilé reporty a food cost', tier: 'septim4' },
];

export const produkty: Product[] = [
  {
    id: 'hugo',
    name: 'Hugo',
    tag: 'Malý a mobilní provoz',
    sub: 'Pokladna v telefonu, který už máte.',
    feats: [
      'Platby kartou přímo na telefonu, bez čtečky',
      'Rozjedete ho sami, menu načte z fotky',
      'Data jsou vaše, kdykoli si je vyexportujete',
    ],
    price: '190 Kč',
    priceNote: 'měsíčně, bez smlouvy',
    eet: true,
  },
  {
    id: 'air',
    name: 'Septim.Air',
    tag: 'Malé a střední provozy',
    sub: 'Cloudová pokladna pro bistra, kavárny a bary.',
    feats: [
      'Sklad, receptury a inventura v jednom systému',
      'Mobilní číšník a dělení účtů u stolu',
      'Česká podpora 24/7',
    ],
    price: 'od 490 Kč',
    priceNote: 'měsíčně',
    eet: true,
  },
  {
    id: 'septim4',
    name: 'Septim.4',
    tag: 'Restaurace a sítě',
    sub: 'Provozní systém pro větší restaurace a sítě provozoven.',
    feats: [
      'Pokročilé sklady, food cost a reporty',
      'Věrnostní systém a přímé napojení na Wolt a Foodoru',
      'Technik u vás do několika hodin',
    ],
    price: 'Cena na dotaz',
    priceNote: 'nabídku připravíme pro váš provoz',
    eet: false,
  },
  {
    id: 'enterprise',
    name: 'Septim Enterprise',
    tag: 'Jídelny a kantýny',
    sub: 'Pokladna a objednávky pro jídelny a závodní stravování.',
    feats: [
      'Objednávání jídel a výdej',
      'Ankety pro strávníky',
      'Nastavení na míru vašemu provozu',
    ],
    price: 'Cena na dotaz',
    priceNote: 'nabídku připravíme pro váš provoz',
    eet: false,
  },
];

/**
 * Pravidla doporuceni, prvni shoda vyhrava:
 * 1. jidelna -> Enterprise
 * 2. hotel, vic pobocek, 4+ pokladen, nebo potreba urovne Septim.4 -> Septim.4
 *    (hotely: sales playbook segment C = Protel + Savarin nebo Septim.4, Air je pro bistra a kavarny)
 * 3. potreba urovne Air, 2 az 3 pokladny, nebo restaurace -> Septim.Air
 * 4. jinak -> Hugo
 * Pocita se jen v prohlizeci, skript v Pruvodce.astro si ji importuje.
 */
export function doporuc(typ: string, velikost: string, needs: string[]): ProductId {
  const tiers = needs.map((n) => potreby.find((p) => p.value === n)?.tier);
  if (typ === 'jidelna') return 'enterprise';
  if (typ === 'hotel' || velikost === 'pobocky' || velikost === '4+' || tiers.includes('septim4')) return 'septim4';
  if (tiers.includes('air') || velikost === '2-3' || typ === 'restaurace') return 'air';
  return 'hugo';
}
