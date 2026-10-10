import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const booksCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/books",
  }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    subject: z.string(),
    grade: z.string(),
    bookType: z.string().default("Podręcznik"),
    frontPageImageSrc: z.string().optional(),
    slug: z.string(),
  }),
});

export const collections = {
  books: booksCollection,
};
