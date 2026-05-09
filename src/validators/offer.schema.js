import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const offerBodySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  discountPercentage: z.coerce.number().min(0).max(100),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  bannerImage: z.string().url().optional(),
  isActive: z.boolean().optional()
});

export const offerIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  })
});

export const listOffersSchema = z.object({
  query: z.object({
    active: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
  })
});

export const createOfferSchema = z.object({
  body: offerBodySchema
});

export const updateOfferSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  }),
  body: offerBodySchema.partial()
});
