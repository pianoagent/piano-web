import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Kolekce „aktualne", novinky a verze pro stránku /aktualne.
 * Přidání novinky = vytvořit nový .md soubor v src/content/aktualne/
 * (viz src/content/aktualne/README.md).
 */
const aktualne = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!README.md'], base: './src/content/aktualne' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { aktualne };
