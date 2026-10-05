import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each Markdown file in src/content/projects/ is one project. These are the
// fields allowed at the top of those files; the build stops with a clear error
// if a required one is missing or a field name is misspelled.
const projects = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*.md'], base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        year: z.union([z.number(), z.string()]),
        type: z.string().default('Personal project'),
        tags: z.array(z.string()).default([]),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        demo: z.string().optional(),
        demoLabel: z.string().optional(),
        repo: z.string().optional(),
        featured: z.boolean().default(false),
        order: z.number().default(100),
        highlights: z.array(z.string()).optional(),
        stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
        caseStudy: z.string().optional(),
        draft: z.boolean().default(false),
      })
      .strict(),
});

export const collections = { projects };
