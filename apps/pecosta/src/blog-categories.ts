/**
 * Kategorie novinek Pecosta: jeden zdroj pravdy (název ↔ slug ↔ SEO copy).
 * `name` musí přesně odpovídat hodnotám v `categories:` frontmatteru článků.
 * Článek zůstává na ploché URL /novinky/<slug>; kategorie má hub /novinky/kategorie/<slug>.
 */
export interface BlogCategory {
  name: string;
  slug: string;
  title: string;
  description: string;
  intro: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    name: 'Novinky',
    slug: 'novinky',
    title: 'Novinky Pecosta: produkt, služby a firma',
    description: 'Co je nového u Pecosty, nové služby, spuštění Autset aplikace i vstup do skupiny Piano. Novinky z první ruky.',
    intro: 'Co je nového u Pecosty: nové služby, spuštění aplikací i důležité milníky firmy. Novinky z první ruky pro naše zákazníky i partnery.',
  },
  {
    name: 'Případové studie',
    slug: 'pripadove-studie',
    title: 'Případové studie: komu Pecosta šetří náklady',
    description: 'Reálné příběhy hotelů, restaurací a institucí, které s Pecostou šetří na surovinách, energiích i čase. Konkrétní čísla a zkušenosti.',
    intro: 'Reálné příběhy z provozů: hotelové sítě, restaurace i instituce, které s Pecostou snížily náklady na suroviny a energie a ušetřily hodiny práce. Konkrétní čísla, konkrétní lidé.',
  },
  {
    name: 'Z médií',
    slug: 'z-medii',
    title: 'Z médií: Pecosta a Autset v tisku a reportážích',
    description: 'Reportáže a mediální výstupy o Pecostě a Autsetu, jak automatizace nákupu a naskladnění mění gastro provozy.',
    intro: 'Co o Pecostě a Autsetu píší média. Reportáže a rozhovory o tom, jak automatizace nákupu a naskladnění mění provoz restaurací, hotelů i institucí.',
  },
];

export const categoryBySlug = (slug: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find((c) => c.slug === slug);
export const categoryByName = (name: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find((c) => c.name === name);
export const slugForCategory = (name: string): string | undefined => categoryByName(name)?.slug;
