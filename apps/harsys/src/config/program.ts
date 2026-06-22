/**
 * Data programu Harsys — varianty + porovnání funkcí.
 * Zdroj: podklady starých webů/Harsys/obsah/{index,cenik,srovnani-variant}.md.
 * Jediný zdroj pravdy pro ceník i srovnání variant (ať se hodnoty nerozejdou).
 */

export interface Variant {
  name: string;
  desc: string;
  bits: number[];   // dostupnost 8 klíčových funkcí (variantFeatures)
  buy: string;      // doživotní licence (bez DPH)
  rent: string;     // měsíční pronájem (bez DPH)
  popular: boolean;
}

/** 8 klíčových funkcí zobrazených na kartách variant */
export const variantFeatures = [
  'Adresář, skupiny, ceník',
  'Uzávěrky a sumáře',
  'Skladové hospodářství',
  'Happy Hours',
  'Vzdálený přístup',
  'Denní nabídka',
  'Bonus a kredit systém',
  'Provizní systém pro obsluhu',
];

export const variants: Variant[] = [
  { name: 'Lite', desc: 'Pro malý provoz, kde stačí základní funkce a stručný přehled o tržbách', bits: [1,1,0,0,0,0,0,0], buy: '5 900', rent: '390', popular: false },
  { name: 'Gold', desc: 'Pro ty, kteří chtějí vést sklady a mít podrobnější přehled o své restauraci', bits: [1,1,1,1,0,0,0,0], buy: '10 900', rent: '690', popular: true },
  { name: 'Gold+NET', desc: 'Profi varianta s vyspělými funkcemi a možností přístupu přes internet', bits: [1,1,1,1,1,1,0,0], buy: '16 900', rent: '890', popular: false },
  { name: 'Premium', desc: 'Komplexní profi řešení pro střední a větší provozy s maximem funkcí', bits: [1,1,1,1,1,1,1,1], buy: '22 900', rent: '1 290', popular: false },
];

/** Krátké názvy sloupců pro srovnávací tabulku */
export const variantNames = variants.map((v) => v.name);

/** Hodnota buňky: true = ano, false = ne, jinak text (např. „příplatek") */
export type Cell = boolean | string;
export interface CompareGroup { group: string; rows: { label: string; cells: Cell[] }[]; }

/** Vybrané, smysluplné řádky srovnání (kurátorský výběr z plné matice) */
export const compare: CompareGroup[] = [
  {
    group: 'Pracoviště a síť',
    rows: [
      { label: 'Jednouživatelský režim (1 PC)', cells: [true, true, true, true] },
      { label: 'Síťový režim (více PC v síti)', cells: [false, true, true, true] },
      { label: 'Síťový režim přes internet (práce z domova)', cells: [false, false, true, true] },
      { label: 'Připojení mobilního číšníka', cells: [false, false, true, true] },
      { label: 'Více pokladen na středisku (Master-Slave)', cells: [false, false, true, true] },
    ],
  },
  {
    group: 'Sklady a agendy',
    rows: [
      { label: 'Skladové hospodářství (příjemky, inventury, objednávky)', cells: [false, true, true, true] },
      { label: 'Skupiny a sortiment (neomezeně)', cells: [true, true, true, true] },
      { label: 'Adresář zákazníků a vnitřní účty', cells: [true, true, true, true] },
      { label: 'Denní nabídka', cells: [false, false, true, true] },
      { label: 'Receptury a food cost', cells: [true, true, true, true] },
      { label: 'Jiná výroba kuchyně (rauty, svatby, závozy)', cells: [false, false, false, true] },
    ],
  },
  {
    group: 'Prodej a pokladna',
    rows: [
      { label: 'Stolová mapa, dělení a přesun účtů', cells: [true, true, true, true] },
      { label: 'Happy Hours (časové ceny)', cells: [false, true, true, true] },
      { label: 'Markování čtečkou čárových kódů', cells: [false, false, true, true] },
      { label: 'Qerko — rychlé placení mobilem', cells: [true, true, true, true] },
      { label: 'Propojení s platebními terminály', cells: [true, true, true, true] },
      { label: 'Kitchen monitor — elektronická bonovačka', cells: ['příplatek', 'příplatek', 'příplatek', 'příplatek'] },
    ],
  },
  {
    group: 'Přehledy a sledování',
    rows: [
      { label: 'Základní přehledy prodeje (čísla i grafy)', cells: [false, true, true, true] },
      { label: 'Rozšířené přehledy prodeje', cells: [false, false, true, true] },
      { label: 'Vyhodnocení číšníků (provize z tržby)', cells: [false, false, false, true] },
      { label: 'Online monitor provozu', cells: [true, true, true, true] },
      { label: 'ABX Viewer — sledování z mobilu', cells: ['příplatek', 'příplatek', 'příplatek', 'příplatek'] },
      { label: 'SMS report o denní tržbě', cells: [true, true, true, true] },
      { label: 'E-mail reporty o tržbách', cells: [false, false, true, true] },
    ],
  },
  {
    group: 'Věrnost, měny, podpora',
    rows: [
      { label: 'Kreditní a věrnostní systém', cells: [false, false, false, true] },
      { label: 'Podpora CZK a EUR, účtenky v EN/DE', cells: [true, true, true, true] },
      { label: 'Telefonická i e-mailová podpora', cells: [true, true, true, true] },
      { label: '6 měsíců podpory a nových verzí zdarma', cells: [true, true, true, true] },
    ],
  },
];
