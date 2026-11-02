import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Guides = articles in src/content/guides/*.md
// Files starting with "_" (like _TEMPLATE.md) are ignored.
const guides = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string().max(70), // shown in Google results; keep under ~60 characters
    description: z.string().max(170), // the snippet under the title in Google
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // Optional Q&A list: shown at the end of the article and marked up for Google/AI answers
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { guides };
