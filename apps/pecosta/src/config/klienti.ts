/**
 * Klientská loga Pecosty (reálné reference).
 * Master: brand/loga/reference/pecosta/{gastro,verejny-sektor}/ ; kopie zde v appce:
 * src/assets/images/logos/reference/{gastro,verejny-sektor}/<slug>.webp (sdílený LogoWall je
 * optimalizuje na AVIF + WebP). Názvy jsou vč. podsložky, alt je čitelný název klienta.
 * Řazení: silné/známé značky napřed (marquee), zbytek dál.
 */

export type Klient = { name: string; alt: string };

// Gastro provozy, hotely, restaurace
export const klientiGastro: Klient[] = [
  { name: 'reference/gastro/ambiente', alt: 'Ambiente' },
  { name: 'reference/gastro/cpi-hotels', alt: 'CPI Hotels' },
  { name: 'reference/gastro/pytloun-hotels', alt: 'Pytloun Hotels' },
  { name: 'reference/gastro/kolkovna', alt: 'Kolkovna' },
  { name: 'reference/gastro/sasazu', alt: 'SaSaZu' },
  { name: 'reference/gastro/grandhotel-pupp', alt: 'Grandhotel Pupp' },
  { name: 'reference/gastro/hp-tronic', alt: 'HP TRONIC' },
  { name: 'reference/gastro/perfect-canteen', alt: 'Perfect Canteen' },
  { name: 'reference/gastro/la-lorraine', alt: 'La Lorraine' },
  { name: 'reference/gastro/kavarna-slavia', alt: 'Kavárna Slavia' },
  { name: 'reference/gastro/hotel-maximus', alt: 'Hotel Maximus' },
  { name: 'reference/gastro/grandhotel-brno', alt: 'Grandhotel Brno' },
  { name: 'reference/gastro/avanti-hotel', alt: 'Hotel Avanti' },
  { name: 'reference/gastro/jan-hotels', alt: 'JAN Hotels' },
  { name: 'reference/gastro/hh-hotels', alt: 'HH Hotels' },
  { name: 'reference/gastro/con-gusto', alt: 'Con Gusto' },
  { name: 'reference/gastro/la-fresca', alt: 'La Fresca' },
  { name: 'reference/gastro/mistral-cafe', alt: 'Mistral Café' },
  { name: 'reference/gastro/pivo-karlin', alt: 'Pivo Karlín' },
  { name: 'reference/gastro/goose-pivovar', alt: 'Goose pivovar' },
  { name: 'reference/gastro/mestansky-pivovar-turnov', alt: 'Měšťanský pivovar Turnov' },
  { name: 'reference/gastro/restaurace-mincovna', alt: 'Restaurace Mincovna' },
  { name: 'reference/gastro/restaurace-tiskarna', alt: 'Restaurace Tiskárna' },
  { name: 'reference/gastro/cacao', alt: 'Cacao' },
  { name: 'reference/gastro/cerna-madona', alt: 'Černá Madona' },
  { name: 'reference/gastro/knedlin', alt: 'Knedlín' },
  { name: 'reference/gastro/staromestska', alt: 'Staroměstská restaurace' },
  { name: 'reference/gastro/u-pavouka', alt: 'U Pavouka' },
  { name: 'reference/gastro/u-zlate-psenice', alt: 'U Zlaté pšenice' },
  { name: 'reference/gastro/dolni-pocernice', alt: 'Dolní Počernice' },
  { name: 'reference/gastro/heipark', alt: 'HEIPARK' },
  { name: 'reference/gastro/hotel-freud', alt: 'Hotel Freud' },
  { name: 'reference/gastro/hotel-orlik', alt: 'Hotel Orlík' },
  { name: 'reference/gastro/hotel-praded', alt: 'Hotel Praděd' },
  { name: 'reference/gastro/hotel-radun', alt: 'Hotel Radun' },
  { name: 'reference/gastro/hotel-rott', alt: 'Hotel Rott' },
  { name: 'reference/gastro/hotel-rustikal', alt: 'Hotel Rustikal' },
  { name: 'reference/gastro/hotel-duo', alt: 'Hotel Duo' },
  { name: 'reference/gastro/hotel-obzor', alt: 'Hotel Obzor' },
];

// Veřejný sektor (burzovní obchody / veřejné zakázky)
export const klientiVerejnySektor: Klient[] = [
  { name: 'reference/verejny-sektor/moravskoslezsky-kraj', alt: 'Moravskoslezský kraj' },
  { name: 'reference/verejny-sektor/fakultni-nemocnice-ostrava', alt: 'Fakultní nemocnice Ostrava' },
  { name: 'reference/verejny-sektor/nemocnice-frydek-mistek', alt: 'Nemocnice Frýdek-Místek' },
  { name: 'reference/verejny-sektor/nemocnice-nymburk', alt: 'Nemocnice Nymburk' },
  { name: 'reference/verejny-sektor/nemocnice-trinec', alt: 'Nemocnice Třinec' },
  { name: 'reference/verejny-sektor/upmd', alt: 'ÚPMD' },
];

/* Podmnožiny pro segmentové stránky /pro-koho/*. Jen výběry z polí výš, žádná nová loga.
   Zařazení podle názvu provozu; kde by bylo zařazení dohad (kavárny, jídelny),
   se na stránce použije celý klientiGastro. */
export const klientiHotely = klientiGastro.filter((l) => [
  'cpi-hotels', 'pytloun-hotels', 'grandhotel-pupp', 'hotel-maximus', 'grandhotel-brno',
  'avanti-hotel', 'jan-hotels', 'hh-hotels', 'hotel-freud', 'hotel-orlik', 'hotel-praded',
  'hotel-radun', 'hotel-rott', 'hotel-rustikal', 'hotel-duo', 'hotel-obzor',
  'hp-tronic',
].some((slug) => l.name.endsWith(`/${slug}`)));

export const klientiRestaurace = klientiGastro.filter((l) => [
  'ambiente', 'kolkovna', 'sasazu', 'con-gusto', 'pivo-karlin', 'goose-pivovar',
  'mestansky-pivovar-turnov', 'restaurace-mincovna', 'restaurace-tiskarna',
  'cerna-madona', 'knedlin', 'staromestska', 'u-pavouka', 'u-zlate-psenice',
].some((slug) => l.name.endsWith(`/${slug}`)));
