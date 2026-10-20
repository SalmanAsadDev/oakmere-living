import { z } from "zod";
import { normalisePostcode } from "@/lib/domain/delivery.mjs";

export const termsVersion = "2026-10-20";
export const deliveryAddressSchema = z
  .object({
    line1: z.string().trim().min(3).max(200),
    line2: z.string().trim().max(200).default(""),
    city: z.string().trim().min(2).max(100),
    postcode: z
      .string()
      .max(12)
      .transform((v) => normalisePostcode(v))
      .pipe(z.string()),
    country: z.literal("United Kingdom"),
    accessNotes: z.string().trim().max(1500).default(""),
  })
  .strict();
export const quotePayloadSchema = z
  .object({
    address: deliveryAddressSchema,
    items: z
      .array(
        z
          .object({
            variantId: z.string().min(1).max(200),
            quantity: z.number().int().min(1).max(10),
          })
          .strict(),
      )
      .min(1)
      .max(30),
  })
  .strict();
export const checkoutPayloadSchema = z
  .object({
    quoteId: z.uuid(),
    idempotencyKey: z.uuid(),
    contact: z
      .object({
        name: z.string().trim().min(2).max(180),
        email: z
          .email()
          .max(254)
          .transform((v) => v.toLowerCase()),
        phone: z
          .string()
          .trim()
          .min(7)
          .max(40)
          .regex(/^[+\d\s()\-]+$/),
      })
      .strict(),
    paymentMethod: z.enum(["cash_on_delivery", "card_on_delivery"]),
    termsVersion: z.literal(termsVersion),
    termsAccepted: z.literal(true),
    deliveryConfirmationAccepted: z.literal(true),
  })
  .strict();
export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
export type DeliveryAddress = z.infer<typeof deliveryAddressSchema>;
export type CheckoutQuote = {
  id: string;
  items: {
    variantId: string;
    productId: string;
    name: string;
    label: string;
    quantity: number;
    unitPence: number;
    totalPence: number;
  }[];
  subtotalPence: number;
  deliveryPence: number;
  totalPence: number;
  expiresAt: string;
  policyVersion: string;
};
