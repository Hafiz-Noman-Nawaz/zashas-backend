import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const typeEnum = z.enum(["manual", "gateway", "cod"]);
const providerEnum = z.enum(["cod", "jazzcash", "easypaisa", "bank", "custom"]);

export const createPaymentMethodSchema = z.object({
  body: z.object({
    methodId: z.string().min(1, "Method ID is required"),
    name: z.string().min(1, "Name is required"),
    type: typeEnum.optional(),
    provider: providerEnum.optional(),
    accountNumber: z.string().optional(),
    accountTitle: z.string().optional(),
    bankName: z.string().optional(),
    iban: z.string().optional(),
    instructions: z.string().optional(),
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
    type: typeEnum.optional(),
    provider: providerEnum.optional(),
    accountNumber: z.string().optional(),
    accountTitle: z.string().optional(),
    bankName: z.string().optional(),
    iban: z.string().optional(),
    instructions: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

export const paymentMethodIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  })
});

export const togglePaymentMethodSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  }),
  body: z.object({
    isActive: z.boolean().optional()
  }).optional()
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().regex(objectIdRegex, "Invalid order id"),
    provider: z.string().min(1),
    transactionId: z.string().optional(),
    payload: z.record(z.any()).optional()
  })
});
