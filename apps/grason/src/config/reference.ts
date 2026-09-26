/**
 * Citace zákazníků. Jediný zdroj pravdy pro všechny stránky Grasonu.
 *
 * Doslovné znění je z „Banky referencí a citací" v contexty/znalostni-baze.md
 * (část 7, sekce Grason). Citace se sem NEPŘEPISUJÍ volně a nová citace se
 * nepřidává, dokud není v bance: stejná věta se objevuje na víc stránkách
 * a rozcházet se nesmí.
 *
 * Kde citace vychází z delšího originálu, je zkrácená bez změny významu
 * a v komentáři je uvedeno, co se vypustilo.
 */
export interface Quote {
  initials: string;
  quote: string;
  author: string;
  /* Volitelná: banka referencí ji u některých citací nemá a dopisovat si ji
     není co (Hotel Buchlov je v bance jen jako název podniku). */
  role?: string;
}

/* Manažeři provozů, GrasonFlexi (brigádníci) */
export const flexiQuotes: Quote[] = [
  {
    initials: 'MS',
    quote: 'Ke Grasonu nás dovedla zhoršující se situace na trhu práce a jejich inovativní přístup oproti ostatní konkurenci. Velkou výhodou je praktická a funkční aplikace a možnost operativního plánování směn 24/7. Také nám odpadá starost s prvotním výběrem kandidátů a inzercí.',
    author: 'Martin Savkulič',
    role: 'Manažer restaurace Pizza Nuova, Ambiente',
  },
  {
    /* Pozor: Foodora, ne DámeMarket. Přejmenování je vedené jako závazné
       v části 12 znalostní báze (známé rozpory). */
    initials: 'DS',
    quote: 'Pracovníci z GrasonFlexi u nás nyní vykrývají nejenom nárazové směny na skladech, ale stávají se i pravidelnou součástí pracovního týmu. Oceňujeme jejich spolehlivost a rychlost. Aplikaci pohodlně ovládáme i v terénu z mobilu.',
    author: 'Denisa Srnková',
    role: 'HR Business Partner, Foodora',
  },
  {
    initials: 'MP',
    quote: 'Pracovníci, které jsme v zimní špičce nalezli skrze aplikaci Grason, byli sice dražší, ale mnohem motivovanější a ochotní makat, než pracovníci z jiných kanálů.',
    author: 'Michal Prádl',
    role: 'Vedoucí skladu, Datart Jirny',
  },
  {
    /* Zkráceno: vypuštěna úvodní věta „Na Grason jsme narazili vlastně
       náhodou díky tomu, že nás sami oslovili." Plné znění je v bance. */
    initials: 'JK',
    quote: 'Velkou výhodu vidím v úspoře času, protože Grason za mě řeší byrokratické papírování.',
    author: 'Josef Kubíček',
    role: 'Manažer, Likor',
  },
];

/* Manažeři provozů, GrasonPlan (plánování vlastního týmu) */
export const planQuotes: Quote[] = [
  {
    initials: 'JK',
    quote: 'GrasonPlan je velmi intuitivní a přehledný. Jsem rád, že vidím mzdové náklady podle akcí.',
    author: 'Jindřich Kubalík',
    role: 'Cafe Louvre a Kytky pod komínem',
  },
  {
    initials: 'LS',
    quote: 'GrasonPlan jsme si vybrali na základě toho, jak hezky vypadá a jak příjemně se používá. Skvěle nám zefektivnil provoz podniku. Můžeme doporučit všema deseti.',
    author: 'Lucie Stašková',
    role: 'Manager',
  },
  {
    initials: 'HB',
    quote: 'Největší benefit GrasonPlanu je v přehlednosti a zjednodušení komunikace s pracovníky, což v dnešní době, kdy ne každý chce zvedat telefon a volat, je vážně super.',
    author: 'Hotel Buchlov',
  },
];

/* Homepage: obě strany produktu, šest citací ve dvou řadách po třech */
export const homeQuotes: Quote[] = [
  flexiQuotes[0], flexiQuotes[1], flexiQuotes[2],
  planQuotes[0], planQuotes[1], flexiQuotes[3],
];

/* Pracovníci (grasoni). Doplněno do banky referencí 22. 9. 2026
   (znalostni-baze.md, část 7, „Grason, citace pracovníků"), zdrojem je
   živý grason.cz. Podepsaný souhlas k nim dohledaný není, proto je
   mimo web (kampaně, prezentace) napřed ověřit u Grasonu. */
export const workerQuotes: Quote[] = [
  {
    initials: 'MD',
    quote: 'Grason je skvělá aplikace, můžu se přihlásit, kdy chci, kam chci, peníze mám hned a mám jistotu, že vždy nějakou směnu najdu.',
    author: 'Maryna Dragula',
    role: 'Servírka',
  },
  {
    /* Zkráceno z live webu: vypuštěna pasáž o doporučení kamarádovi Pavlovi. */
    initials: 'MŽ',
    quote: 'Grason bych doporučil, je to cesta ke svobodě. Člověk díky tomu nedělá pořád to samé, poznává různé technologie, jiné kuchaře. Určitě je to super věc pro lidi, co vaření a gastronomie opravdu zajímá.',
    author: 'Martin Železník',
    role: 'Kuchař',
  },
  {
    /* Slovenský originál, tak jak ho má live grason.cz. Překlad by se vydával
       za doslovný citát, což citace není. */
    initials: 'RH',
    quote: 'Skvelá aplikácia, ktorá ľuďom pomáha nájsť brigádu alebo prácu, brigády sú vyplácané ihneď po smene. Určíš si, kedy chceš pracovať, koľko hodín a za akú hodinovku.',
    author: 'Richard Hodási',
    role: 'Číšník',
  },
  {
    initials: 'FU',
    quote: 'Kurz byl postaven prakticky a velice otevřeně se v něm řešil pohyb po place, vyzkoušeli jsme si nosit talíře a práci s platem nápojů. Pro nováčky v oboru rozhodně stojí za to.',
    author: 'Filip Umlauf',
    role: 'Barman, účastník kurzu runnera',
  },
  {
    initials: 'TN',
    quote: 'Skvělý kurz, pomohl mi hodně nejen v tom, jak být správným runnerem, ale i mít lepší přehled o provozu restaurací.',
    author: 'Thanh Dat Nguyen',
    role: 'Jídlonoš, účastník kurzu runnera',
  },
  {
    initials: 'DP',
    quote: 'Velice hezký a užitečný kurz. Probíhalo to v příjemné atmosféře, v klidu a bez tlaku. Naučili nás spoustu věcí jako servírování stolu, nošení talířů a plata.',
    author: 'Dmytro Panteleymonov',
    role: 'Jídlonoš, účastník kurzu runnera',
  },
];
