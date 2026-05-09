import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createPaymentMethodSchema = z.object({
  body: z.object({
    methodId: z.string().min(1, "Method ID is required"),
    name: z.string().min(1, "Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    accountTitle: z.string().min(1, "Account Title is required"),
    bankName: z.string().optional(),
    iban: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

export const updatePaymentMethodSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  }),
  body: z.object({
    methodId: z.string().optional(),
    name: z.string().optional(),
    accountNumber: z.string().optional(),
    accountTitle: z.string().optional(),
    bankName: z.string().optional(),
    iban: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

export const paymentMethodIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  })
});
