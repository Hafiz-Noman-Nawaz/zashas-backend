import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "paid",
  "shipped",
  "delivered",
  "cancelled"
]);

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  })
});

export const listOrdersSchema = z.object({
  query: z.object({
    status: orderStatusSchema.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().regex(objectIdRegex, "Invalid id"),
          quantity: z.coerce.number().int().min(1),
          selectedVariant: z.string().optional()
        })
      )
      .min(1),
    customerDetails: z.object({
      fullName: z.string().min(1, "Name is required"),
      email: z.string().optional(),
      phone: z.string().min(1, "Phone is required"),
      whatsapp: z.string().optional(),
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      province: z.string().optional(),
      postalCode: z.string().optional(),
      notes: z.string().optional()
    }),
    paymentDetails: z.object({
      method: z.string().min(1, "Payment method is required")
    }),
    currency: z.string().optional(),
    status: orderStatusSchema.optional()
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid id")
  }),
  body: z.object({
    status: orderStatusSchema,
    courierDetails: z.object({
      courierName: z.string().optional(),
      trackingNumber: z.string().optional(),
      trackingUrl: z.string().optional(),
      dispatchedAt: z.coerce.date().optional()
    }).optional()
  })
});

export const trackOrderSchema = z.object({
  query: z.object({
    orderId: z.string().optional(),
    phone: z.string().optional()
  }).refine((data) => Boolean(data.orderId || data.phone), {
    message: "Either orderId or phone must be provided to track an order"
  })
});

