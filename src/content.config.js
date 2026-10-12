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
    chaptersPages: z
      .array(
        z.object({
          name: z.string(),
          page: z.number().int().positive(),
          subchapters: z
            .array(
              z.object({
                name: z.string(),
                page: z.number().int().positive(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = {
  books: booksCollection,
};
