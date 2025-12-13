import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "project/**/*.md",
      schema: z.object({
        title: z.string().min(2).max(100),
        slug: z.string().min(2).max(100),
        type: z.string().min(2).max(100),
        year: z.string().length(4),
        description: z.string().min(2).max(1000),
        image: z.string().optional(),
        tech: z.array(z.string()).min(1),
        github: z.string().url().optional(),
        live: z.string().url().optional(),
        featured: z.boolean().default(false),
        order: z.number().default(0),
        status: z.string().optional(),
        duration: z.string().optional(),
        team_size: z.number().optional(),
        role: z.string().optional(),
      }),
    }),
  },
});
