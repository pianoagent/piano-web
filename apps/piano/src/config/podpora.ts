/**
 * Rozcestník podpory a návodů (piano.cz/podpora).
 *
 * Data jsou ZÁMĚRNĚ lokálně, ne v packages/ui/config/piano-ecosystem.ts:
 * PIANO_PRODUCTS plní mega menu všech 10 webů v monorepu, takže přidání Huga
 * nebo pole navíc by změnilo navigaci i na Septimu, Qerku a ostatních.
 *
 * Tvar položky je napsaný jako budoucí frontmatter kolekce návodů. Až návody
 * dostanou vlastní .md soubory, změní se `import { supportProducts }` na
 * `await getCollection('navody')` a `e.x` na `e.data.x`. Nic jiného.
 *
 * Odkazy k 11. 9. 2026 ověřené HTTP requestem, u SPA webů v prohlížeči.
 * Karta míří na stránku návodů, FAQ nebo podpory dané značky.
 */

export interface SupportEntry {
  /** Budoucí URL segment /podpora/<slug>. Od začátku stabilní, mění se špatně. */
  slug: string;
  /** Název tak, jak ho zákazník zná z provozu. */
  title: string;
  /**
   * Jedna věta: co zákazník na druhé straně najde. Ne co produkt umí.
   * DNES SE NERENDERUJE: na rozcestníku je záměrně jen logo a název
   * (zadání Kryštofa 11. 9. 2026). Text tu zůstává pro podstránky
   * /podpora/<slug>, kde popis smysl mít bude. Editace se na hubu
   * neprojeví.
   */
  summary: string;
  /** Cíl DNES. Až budou vlastní návody, přepíše se na `/podpora/${slug}`. */
  href: string;
  external?: boolean;
  /** Čtvercová marka z public/brand (všechny mají viewBox 0 0 512 512). */
  mark: string;
  /**
   * Podklad tile. Nastavuje ho jen značka, jejíž marka by na výchozím
   * světlém #F5F4F2 nebyla vidět. Zatím jen Hugo, viz níž.
   */
  tileBg?: string;

  /** Nižší číslo = výš. Nahoře značky, které mají reálné návody. */
  order: number;
  /** false = karta se nevykreslí. */
  published?: boolean;
  /** Proč je položka skrytá. Jen pro lidi, do HTML se nedostane. */
  note?: string;
}

export const SUPPORT_ENTRIES: SupportEntry[] = [
  // --- Značky s reálnou stránkou podpory nebo návodů ---
  {
    slug: 'septim', title: 'Septim', order: 10,
    summary: 'Technické rady k pokladně a skladům.',
    href: 'https://www.septim.cz/technicke-rady-faq', external: true,
    mark: '/brand/septim.svg',
  },
  {
    slug: 'abx-harsys', title: 'ABX Harsys', order: 20,
    summary: 'Linka technické podpory, 7 dní v týdnu.',
    href: 'https://www.abxharsys.cz/technicka-podpora-abx', external: true,
    mark: '/brand/abx.svg',   // pozor: marka Harsysu se jmenuje abx.svg
    // POZOR: zivy abxharsys.cz NENI build z monorepa a apps/harsys tuhle
    // stranku nema. V den nasazeni Harsysu z monorepa tenhle odkaz spadne
    // na 404, takze soucasti nasazeni musi byt technicka-podpora-abx nebo
    // presmerovani v apps/harsys/public/_redirects.
  },
  {
    slug: 'protel', title: 'Protel', order: 30,
    summary: 'Helpdesk a podpora k hotelovému PMS.',
    href: 'https://www.protelsystems.cz/podpora', external: true,
    mark: '/brand/protel.svg',
  },
  {
    slug: 'pos-experts', title: 'POS Experts', order: 40,
    summary: 'Servis, servisní balíčky a VIP tikety.',
    href: 'https://posexperts.cz/podpora/', external: true,   // lomitko: bez nej 301
    mark: '/brand/posexperts.svg',
  },

  // --- Produkty Piana: zatím skryté ---
  // Zadání Kryštofa 11. 9. 2026: Terminál a Pilot zatím pryč. Obě karty by
  // vedly na produktovou stránku, ne na návod, a obě by nesly stejnou pianovou
  // marku (vlastní kvadratickou marku nemají). Zapnout, až budou mít kam mířit.
  {
    slug: 'piano-terminal', title: 'Piano Terminál', order: 50, published: false,
    note: 'Zatím pryč. Cíl /terminal je produktová stránka, ne návod.',
    summary: 'Technická podpora k platebnímu terminálu.',
    href: '/terminal',
    mark: '/brand/piano.svg',
  },
  {
    slug: 'piano-pilot', title: 'Piano Pilot', order: 60, published: false,
    note: 'Zatím pryč. Cíl /pilot je produktová stránka, ne návod.',
    summary: 'Mobilní aplikace pro provoz a kontakt.',
    href: '/pilot',
    mark: '/brand/piano.svg',
  },

  // --- Značky, kde vede odkaz zatím jen na web ---
  {
    slug: 'hugo', title: 'Hugo', order: 70,
    summary: 'Pokladna v telefonu, web a kontakt.',
    href: 'https://hugopos.cz', external: true,
    // Marka Huga je žlutá #FFDF2C, to je jeho identita a zůstává žlutá.
    // Na výchozím světlém tile má ale kontrast 1,21:1, tedy prázdný
    // čtverec, takže tile dostane Hugův primární inkoust #14110D.
    // Žlutá na něm vyjde 14,2:1 a je to i způsob, jakým Hugo sám sebe
    // prezentuje (tmavý základ, žlutý akcent).
    mark: '/brand/hugo.svg', tileBg: '#14110D',
  },
  {
    slug: 'qerko', title: 'Qerko', order: 80,
    summary: 'Časté dotazy k platbám u stolu.',
    href: 'https://www.qerko.com/faqs', external: true,
    mark: '/brand/qerko.svg',
  },
  {
    slug: 'grason', title: 'Grason', order: 90,
    summary: 'Nejčastější dotazy pro podniky.',
    href: 'https://www.grason.cz/nejcastejsi-dotazy-podniky/', external: true,   // lomitko: bez nej 301
    mark: '/brand/grason.svg',
  },
  {
    slug: 'autset', title: 'Autset', order: 100,
    summary: 'Kontakt na podporu naskladňování.',
    href: 'https://autset.com/kontakt', external: true,
    mark: '/brand/autset.svg',
  },
  {
    slug: 'pecosta', title: 'Pecosta', order: 110,
    summary: 'Kontakt na podporu aukčních nákupů.',
    href: 'https://pecosta.cz/kontakt/', external: true,
    mark: '/brand/pecosta.svg',
  },

  // --- Skryté ---
  {
    slug: 'savarin', title: 'Savarin', order: 120, published: false,
    note: 'savarin.cz i cominn.cz jedou jen po HTTP, HTTPS má rozbitý certifikát '
        + '(ověřeno 11. 9. 2026). Odkaz z piano.cz by hodil bezpečnostní varování. '
        + 'Zapnout, až bude certifikát v pořádku.',
    summary: 'Pokladní systém, web a kontakt.',
    href: 'https://savarin.cz', external: true,
    mark: '/brand/savarin.svg',
  },
];

/** Karty k vykreslení: bez skrytých, seřazené. */
export const supportProducts: SupportEntry[] = SUPPORT_ENTRIES
  .filter((e) => e.published !== false)
  .sort((a, b) => a.order - b.order);
