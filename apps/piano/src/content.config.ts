import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),   // vlastní meta <title> (H1 zůstává = title)
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    categories: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
