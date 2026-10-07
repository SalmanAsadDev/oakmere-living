import { z } from "zod";

export const deliveryAddressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().default("United Kingdom"),
});

export const checkoutPayloadSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  deliveryAddress: deliveryAddressSchema,
  paymentMethod: z.enum(["cash_on_delivery", "card_on_delivery"]),
  cartItems: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      productName: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(), // In a real app, unit prices are checked against the DB, but we pass them for structural completeness or fallback
    })
  ).min(1, "Cart cannot be empty"),
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
export type DeliveryAddress = z.infer<typeof deliveryAddressSchema>;
