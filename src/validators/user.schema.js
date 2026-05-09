import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const roleSchema = z.enum(["admin", "manager"]);

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  })
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
  })
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: roleSchema.optional(),
    isActive: z.boolean().optional()
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: roleSchema.optional(),
    isActive: z.boolean().optional()
  })
});
