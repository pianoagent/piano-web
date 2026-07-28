/**
 * Kategorie blogu piano.cz: jeden zdroj pravdy (název ↔ slug ↔ SEO copy).
 *
 * URL strategie (SEO):
 *   - Článek zůstává na ploché, stabilní URL /blog/<slug> (nevnořuje se pod kategorii).
 *   - Kategorie má vlastní indexovatelnou hub stránku /blog/kategorie/<slug>
 *     s unikátním title, meta description a úvodním textem (KWA clustery).
 *   - Zařazení do taxonomie se Googlu předává přes breadcrumb (BreadcrumbList),
 *     ne přes cestu v URL.
 *
 * `name` musí přesně odpovídat hodnotám v `categories:` frontmatteru článků.
 * SEO texty vycházejí z KWA (SEO-podklad-weby-Piano): pozor na nekanibalizaci
 * se Septimem (POS/sklady/inventura/kalkulace patří septim.cz, ne sem).
 */
export interface BlogCategory {
  name: string;        // shodné s frontmatterem článku
  slug: string;        // bez diakritiky
  title: string;       // <title> a H1 kontext
  description: string; // meta description
  intro: string;       // úvodní text na hub stránce (unikátní obsah)
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    name: 'Podnikání v gastru',
    slug: 'podnikani-v-gastru',
    title: 'Podnikání v gastru: čísla, marže a řízení restaurace',
    description: 'Jak řídit restauraci jako byznys: tržby, marže, cenotvorba, náklady a rozhodování podle dat. Praktické návody z provozu pro majitele.',
    intro: 'Jak řídit restauraci jako byznys: přehled tržeb, marže, cenotvorba, náklady a rozhodování podle dat. Praktické rady pro majitele a provozní, kteří chtějí mít podnik pod kontrolou.',
  },
  {
    name: 'EET',
    slug: 'eet',
    title: 'EET 2.0 od roku 2027: evidence tržeb pro gastro srozumitelně',
    description: 'Vše o EET a EET 2.0 od roku 2027: koho se týká, co se eviduje, spropitné bez daně, režim EET OFF a jak se připravit. Srozumitelně pro restaurace a gastro.',
    intro: 'Návrat evidence tržeb v podobě EET 2.0 od roku 2027 na jednom místě. Koho se evidence týká, co a jak se eviduje, co je nového u spropitného a režimu EET OFF a jak se na změny připravit bez stresu. Legislativu překládáme do řeči provozu.',
  },
  {
    name: 'Legislativa a povinnosti',
    slug: 'legislativa-a-povinnosti',
    title: 'Legislativa a povinnosti v gastru: DPH, hygiena, zákoník práce',
    description: 'Srozumitelně o povinnostech v gastronomii: DPH, hygiena, zákoník práce a další pravidla provozu. Co se v gastru mění a co musíte řešit.',
    intro: 'Povinnosti v gastronomii srozumitelně: DPH, hygiena, zákoník práce a další pravidla, která musíte v provozu hlídat. Téma evidence tržeb a EET 2.0 od roku 2027 najdete v samostatné rubrice EET.',
  },
  {
    name: 'Platby a hosté',
    slug: 'platby-a-hoste',
    title: 'Platby a hosté: QR platby, spropitné, recenze a věrnost',
    description: 'QR platba v restauraci, digitální menu, spropitné, platební terminály, Google recenze a věrnost hostů. Jak zrychlit platby a získat vracející se hosty.',
    intro: 'QR platba a QR menu pro restaurace, spropitné, platební terminály, Google recenze a budování věrnosti hostů. Jak zrychlit platbu u stolu a proměnit návštěvníky ve stálé hosty.',
  },
  {
    name: 'Lidé a směny',
    slug: 'lide-a-smeny',
    title: 'Lidé a směny v gastru: nábor, brigádníci a plánování',
    description: 'Nedostatek personálu, brigádníci, plánování směn a docházka v restauraci. Jak najít, udržet a efektivně naplánovat tým.',
    intro: 'Jak řešit nedostatek personálu, sehnat brigádníky, naplánovat směny a pohlídat docházku (i docházkový systém pro restauraci). Návody, jak tým najít, udržet a nerozvrtat rozpisem.',
  },
  {
    name: 'Nákupy a úspory',
    slug: 'nakupy-a-uspory',
    title: 'Nákupy a úspory v gastru: suroviny, energie, dodavatelé',
    description: 'Ceny surovin a energií, dodavatelé a automatizace naskladňování. Jak v restauraci snížit náklady bez ztráty kvality.',
    intro: 'Jak snížit náklady na suroviny a energie, vyjednat lepší podmínky s dodavateli a zautomatizovat naskladňování. Konkrétní cesty k úsporám, které se v provozu poznají.',
  },
  {
    name: 'Data a trendy trhu',
    slug: 'data-a-trendy-trhu',
    title: 'Data a trendy trhu v české gastronomii',
    description: 'Co se v českém gastru prodává, cenové mapy a spotřebitelské trendy. Data a trendy, které pomáhají lépe rozhodovat.',
    intro: 'Co se v české gastronomii prodává, jak se hýbou ceny a kam míří chutě hostů. Trendy a tvrdá tržní data, o která se dá opřít rozhodování.',
  },
];

export const categoryBySlug = (slug: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find((c) => c.slug === slug);
export const categoryByName = (name: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find((c) => c.name === name);
export const slugForCategory = (name: string): string | undefined => categoryByName(name)?.slug;
