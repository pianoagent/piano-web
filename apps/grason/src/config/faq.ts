/**
 * FAQ data per produkt, sdílené mezi homepage (seskupené) a produktovými stránkami.
 */
export interface FaqItem { q: string; a: string; }

export const flexiFaqs: FaqItem[] = [
  { q: 'Jak rychle obsadím směnu brigádníkem?', a: 'Brigádníky najdete na jedno kliknutí, ověření lidé, kteří se na vypsanou směnu sami přihlásí. Volnou směnu obsadíte i na poslední chvíli.' },
  { q: 'Kdo je zaměstnavatel a jak je to s výplatou?', a: 'Zaměstnavatelem je vždy váš podnik, Grason lidi jen zprostředkuje. Výplatu provádíte vy z připravených podkladů. Brigádník tak má peníze rychle po směně.' },
  { q: 'Pro jaké obory GrasonFlexi funguje?', a: 'Primárně gastro, ale i sklady a maloobchod. Databáze čítá 3 357+ ověřených pracovníků napříč 82+ městy v ČR.' },
];

export const planFaqs: FaqItem[] = [
  { q: 'Jak funguje plánování směn?', a: 'Vypíšete směny a buď je přidělíte konkrétním lidem, nebo je necháte přihlásit (burza směn). Lidé si sami navolí, kdy nemohou pracovat, a chytré notifikace najdou náhradníka za nemocného.' },
  { q: 'Jak funguje docházka / digitální píchačky?', a: 'Docházka je příplatkový modul (1. měsíc zdarma, poté 490 Kč/měs bez DPH). Zaměstnanec se odbaví v appce kliknutím a systém přes GPS nebo WiFi ověří, že je v provozovně (okruh 30–300 m).' },
  { q: 'Co umí úkoly a checklisty?', a: 'Zadáte úkol ke směně a zaměstnanec potvrdí splnění, odškrtnutím, textem, číslem nebo fotkou. Máte přehled, co bylo a nebylo splněno, i když nejste v podniku.' },
  { q: 'Pomůže GrasonPlan se mzdami?', a: 'Připraví podklady pro mzdovou účetní jedním kliknutím, odpracované hodiny i příplatkové časy. Samotné mzdy Grason nezpracovává ani nevyplácí, to řešíte vy.' },
  { q: 'Kolik GrasonPlan stojí?', a: '990 Kč/měsíc bez DPH (1 podnik, do 25 uživatelů, každý další +50 Kč). První měsíc je zdarma a bez závazku.' },
];

export const brigadniciFaqs: FaqItem[] = [
  { q: 'Jak mám vyplnit svůj profil, abych měl větší šanci získat práci?', a: 'Dobrá, profesionální fotka je základ. Vyfoťte se sami, ideálně v pracovním prostředí. Fotka, pár slov o vás a obdržené hodnocení jsou hlavními faktory, podle kterých si podnik vybírá. Důležitá je taky poptávaná hodinová sazba. Pokud jste na platformě nováčkem, je lepší si říct o míň a zlepšit tak svou pozici vůči ostatním. Využít můžete i motivační dopis, kam uvedete 2-3 věty, proč se na danou práci hodíte právě vy.' },
  { q: 'Jak se určuje hodinová sazba?', a: 'U některých směn si hodinovou sazbu volíte sami, u některých je pevně stanovená. Záleží na typu práce, pozici, regionu a na vašich zkušenostech. Indikací vám může být preferovaná hodinová sazba uvedená u směny. Pokud v aplikaci začínáte, je lepší začít s nižší hodinovou mzdou a postupně ji zvedat. Dávejte pozor, zda se na směnu hlásíte v čisté nebo hrubé mzdě, a uzpůsobte tomu své požadavky. Pokud podnik nemá vyplněnou hodinovou sazbu, je jen na vás, za kolik se přihlásíte. V případě, že má podnik vyplněnou nabízenou hodinovou mzdu, je dobré se přihlásit za danou částku, nebo se alespoň této částce přiblížit.' },
  { q: 'V kolik mám přijít na domluvenou směnu?', a: 'Přijďte vždy 15 minut předem. Musíte se stihnout převléknout, zjistit, jak funguje provoz, a v některých případech podepsat smlouvu.' },
  { q: 'Mohu se hlásit na více směn ve stejný den?', a: 'Můžete, zvýšíte tím šanci na získání práce. Jakmile vám některý podnik nabídku potvrdí, ze směn, které by se vám kryly, vás automaticky odhlásíme.' },
  { q: 'Nestíháte dorazit na směnu včas?', a: 'Na směnu byste měli dorazit včas, ale chápeme, že je život nevyzpytatelný a může se stát cokoliv. Vždy je potřeba kontaktovat podnik skrze aplikaci, kde najdete telefonní číslo, omluvit se za zpoždění a na směnu co nejrychleji dorazit.' },
  { q: 'Co mám dělat, když se nemůžu dostavit na směnu vůbec?', a: 'Pokud to opravdu nezvládnete, je třeba se ze směny co nejdříve odhlásit přímo v aplikaci, v detailu směny, kliknutím na tlačítko “odhlásit se” vpravo nahoře. Uveďte pravdivý důvod odhlášení. Pozor, časté odhlašování ze směny méně jak 24 hodin před jejím začátkem může vést k vyloučení z aplikace.' },
  { q: 'Co mám mít na sobě? Jaký je dress code?', a: 'V detailu směny je vždy i informace ohledně požadavků na oblečení (dress code), který musíte dodržet. Zároveň je samozřejmostí, že na směnu dorazíte v čistém, vyžehleném oblečení a dle základní společenské normy. Pokud dress code opakovaně nedodržíte, může se tato informace zobrazovat zaměstnavatelům u vašeho profilu.' },
  { q: 'Jak funguje vzájemné hodnocení pracovníků a podniků?', a: 'Pracovník může ohodnotit podnik po každé směně a platí to i naopak.' },
  { q: 'Co se stane, když bez omluvy nepřijdu na domluvenou směnu?', a: 'Pokud se bez omluvy nedostavíte na směnu, dostanete automaticky negativní hodnocení a váš účet bude blokován. Návrat do aplikace již nebude možný.' },
  { q: 'Jak si vybrat práci, aby mě nepřekvapilo, že něco neumím?', a: 'Je potřeba si důsledně přečíst popis práce směny. V komentářích se můžete doptat na detaily náplně práce, pokud není jasná z popisku, nebo použít proklik na web podniku. Přihlášením se na práci, která je nad Vaše schopnosti, riskujete negativní hodnocení, které vám pak znesnadní nalezení další práce.' },
  { q: 'Co mám dělat, když se ke mně ostatní personál nebude chovat hezky?', a: 'Nebojte se to promítnout do hodnocení, jinak se to nedozvíme ani my, ani ostatní pracovníci.' },
  { q: 'Co mám udělat, když mi nabídnou práci mimo Grason?', a: 'Pokud i Vy máte zájem o dlouhodobou spolupráci, je potřeba, aby nás podnik kontaktoval. My s ním vše vyřešíme. V opačném případě hrozí podniku pokuta a vám blokace v aplikaci. Nicméně budeme raději, když si budete nadále domlouvat směny přes aplikaci – pokud by nastal jakýkoliv problém, pomůžeme vám ho vyřešit, a každá nová pracovní zkušenost zlepšuje váš profil a tím zvyšujete své šance na získání další práce.' },
];

export const jobsFaqs: FaqItem[] = [
  { q: 'Jak funguje nábor přes GrasonJobs?', a: 'Vystavíte inzerát na stálou pozici, my ho zveřejníme v mobilní aplikaci i na webu (na 30 dní) a vhodné kandidáty oslovíme cílenými notifikacemi. Zájemci se přihlásí na pohovor přímo v aplikaci.' },
  { q: 'Pomůžete mi s textem inzerátu?', a: 'Ano, textaci inzerátu za vás rádi zpracujeme jako příplatkovou službu (copywriting).' },
  { q: 'Kolik GrasonJobs stojí?', a: 'Vybíráte z balíčků Basic (1 490 Kč), Standard (2 990 Kč), Premium (5 990 Kč) a Gold (17 990 Kč), vše bez DPH. K tomu volitelné příplatky (extra zvýraznění inzerátu, copywriting).' },
];
