/**
 * Kategorie blogu grason.cz: jeden zdroj pravdy (název ↔ slug ↔ SEO copy).
 *
 * URL strategie stejná jako na piano.cz: článek na ploché URL /blog/<slug>
 * (slugy převzaté z blog.grason.cz kvůli přesměrování 1:1), kategorie má hub
 * stránku /blog/kategorie/<slug>, taxonomie jde Googlu přes breadcrumb.
 *
 * `name` musí přesně odpovídat hodnotám v `categories:` frontmatteru článků.
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
    name: 'Rady pro podniky',
    slug: 'rady-pro-podniky',
    title: 'Rady pro podniky: nábor, brigádníci a personál v gastru',
    description: 'Jak najít a udržet personál, napsat náborový inzerát, pracovat s brigádníky a mít spokojený tým. Praktické rady pro provozní a majitele podniků.',
    intro: 'Jak najít a udržet lidi, napsat inzerát, který zaujme, a pracovat s brigádníky tak, aby se k vám rádi vraceli. Praktické rady pro provozní a majitele podniků.',
  },
  {
    name: 'Legislativa',
    slug: 'legislativa',
    title: 'Legislativa a zaměstnávání: DPP, DPČ, cizinci a povinnosti',
    description: 'Změny u DPP a DPČ, zaměstnávání cizinců, oznamovací povinnosti a další pravidla pro zaměstnavatele srozumitelně a v bodech.',
    intro: 'Změny u dohod o provedení práce a pracovní činnosti, zaměstnávání cizinců, oznamovací povinnosti a další pravidla, která musí zaměstnavatel hlídat. Srozumitelně a v bodech.',
  },
  {
    name: 'Trendy a data',
    slug: 'trendy-a-data',
    title: 'Trendy a data o práci v gastru: mzdy, sezóna a personál',
    description: 'Vývoj hodinových mezd, kdy nabírat na sezónu, průzkumy mezi podniky a pracovníky a technologie, které mění gastro.',
    intro: 'Jak se hýbou hodinové mzdy, kdy začít nabírat na sezónu, co ukazují průzkumy mezi podniky a pracovníky a které technologie mění provoz. Data z Grasonu i z trhu.',
  },
  {
    name: 'Případové studie',
    slug: 'pripadove-studie',
    title: 'Případové studie: jak podniky využívají Grason',
    description: 'Jak Grason využívají kavárny, bistra, restaurace i sklady: konkrétní příběhy podniků, které obsazují směny brigádníky a plánují tým.',
    intro: 'Kavárny, bistra, restaurace i sklady: konkrétní příběhy podniků, které díky Grasonu obsazují směny a zvládají sezónní špičky.',
  },
  {
    name: 'Novinky v Grasonu',
    slug: 'novinky',
    title: 'Novinky v Grasonu: nové funkce a návody k aplikaci',
    description: 'Nové funkce v aplikacích GrasonFlexi a GrasonPlan, návody krok za krokem a novinky pro podniky i brigádníky.',
    intro: 'Co je nového v aplikacích GrasonFlexi a GrasonPlan, návody krok za krokem a novinky pro podniky i brigádníky.',
  },
];

export const categoryBySlug = (slug: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find((c) => c.slug === slug);
export const categoryByName = (name: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find((c) => c.name === name);
export const slugForCategory = (name: string): string | undefined => categoryByName(name)?.slug;
