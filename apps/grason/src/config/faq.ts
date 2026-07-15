/**
 * FAQ data per produkt — sdílené mezi homepage (seskupené) a produktovými stránkami.
 */
export interface FaqItem { q: string; a: string; }

export const flexiFaqs: FaqItem[] = [
  { q: 'Jak rychle obsadím směnu brigádníkem?', a: 'Brigádníky najdete na jedno kliknutí — ověření lidé, kteří se na vypsanou směnu sami přihlásí. Volnou směnu obsadíte i na poslední chvíli.' },
  { q: 'Kdo je zaměstnavatel a jak je to s výplatou?', a: 'Zaměstnavatelem je vždy váš podnik — Grason lidi jen zprostředkuje. Výplatu provádíte vy z připravených podkladů. Brigádník tak má peníze rychle po směně.' },
  { q: 'Pro jaké obory GrasonFlexi funguje?', a: 'Primárně gastro, ale i sklady a maloobchod. Databáze čítá 3 357+ ověřených pracovníků napříč 82+ městy v ČR.' },
];

export const planFaqs: FaqItem[] = [
  { q: 'Jak funguje plánování směn?', a: 'Vypíšete směny a buď je přidělíte konkrétním lidem, nebo je necháte přihlásit (burza směn). Lidé si sami navolí, kdy nemohou pracovat, a chytré notifikace najdou náhradníka za nemocného.' },
  { q: 'Jak funguje docházka / digitální píchačky?', a: 'Docházka je příplatkový modul (1. měsíc zdarma, poté 490 Kč/měs bez DPH). Zaměstnanec se odbaví v appce kliknutím a systém přes GPS nebo WiFi ověří, že je v provozovně (okruh 30–300 m).' },
  { q: 'Co umí úkoly a checklisty?', a: 'Zadáte úkol ke směně a zaměstnanec potvrdí splnění — odškrtnutím, textem, číslem nebo fotkou. Máte přehled, co bylo a nebylo splněno, i když nejste v podniku.' },
  { q: 'Pomůže GrasonPlan se mzdami?', a: 'Připraví podklady pro mzdovou účetní jedním kliknutím — odpracované hodiny i příplatkové časy. Samotné mzdy Grason nezpracovává ani nevyplácí, to řešíte vy.' },
  { q: 'Kolik GrasonPlan stojí?', a: '990 Kč/měsíc bez DPH (1 podnik, do 25 uživatelů, každý další +50 Kč). První měsíc je zdarma a bez závazku.' },
];

export const jobsFaqs: FaqItem[] = [
  { q: 'Jak funguje nábor přes GrasonJobs?', a: 'Vystavíte inzerát na stálý úvazek (HPP, DPČ) a my ho automaticky propagujeme cílenými kampaněmi tisícům lidí v gastru. Kandidáti reagují přímo na inzerát.' },
  { q: 'Co se stane, když pozici obsadím?', a: 'Obsazená pozice zmizí z inzerce i z reklamy — kampaň se sama vypne. Platíte jen za to, co reálně běží.' },
  { q: 'Kolik GrasonJobs stojí?', a: 'Cena podle rozsahu a délky kampaně. Připravíme nabídku na míru — platíte jen za běžící inzeráty.' },
];
