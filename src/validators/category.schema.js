import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const categoryBodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isVisible: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional()
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  })
});

export const listCategoriesSchema = z.object({
  query: z.object({
    includeHidden: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
  })
});

export const createCategorySchema = z.object({
  body: categoryBodySchema
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  }),
  body: categoryBodySchema.partial()
});
