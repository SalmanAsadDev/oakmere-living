import { z } from "zod";

export const variantSchema = z.object({
  sku: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  priceAdjustment: z.number().default(0),
  stockLevel: z.number().int().min(0).default(0),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().uuid().optional(),
  description: z.string().optional(),
  basePrice: z.number().positive("Price must be positive"),
  isActive: z.boolean().default(true),
  variants: z.array(variantSchema).optional(),
});

export type ProductPayload = z.infer<typeof productSchema>;
export type VariantPayload = z.infer<typeof variantSchema>;
