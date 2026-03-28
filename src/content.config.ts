import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  date: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Blog Author'),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  canonicalURL: z.string().url().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: blogSchema,
});

const drafts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/drafts' }),
  schema: blogSchema,
});

export const collections = { blog, drafts };
