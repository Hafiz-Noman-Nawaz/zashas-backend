import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  })
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    categoryId: z.string().regex(objectIdRegex, "Invalid id").optional(),
    search: z.string().optional(),
    tags: z.string().optional(),
    isFeatured: z.string().optional(),
    isOnSale: z.string().optional(),
    isNewArrival: z.string().optional(),
    isVisible: z.string().optional(),
    includeHidden: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    sort: z.string().optional()
  })
});

const productBodySchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2).optional(),
  categoryId: z.string().regex(objectIdRegex, "Invalid id").optional(),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  discountedPrice: z.coerce.number().nonnegative().optional(),
  images: z.array(z.string().url()).optional(),
  fabric: z.string().optional(),
  colors: z.array(z.string()).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isVisible: z.boolean().optional()
});

export const createProductSchema = z.object({
  body: productBodySchema.refine(
    (data) => Boolean(data.category || data.categoryId),
    { message: "Category is required", path: ["category"] }
  )
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  }),
  body: productBodySchema.partial()
});
