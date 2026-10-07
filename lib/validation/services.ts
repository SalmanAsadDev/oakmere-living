import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  order: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export const swatchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(10, "Full postal address is required"),
  notes: z.string().optional(),
});
