"use server";

import { z } from "zod";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/server/staff";
import { createAdminClient } from "@/lib/server/supabase";

const image = z
  .string()
  .max(1500)
  .refine((value) => {
    if (/^\/images\/[a-zA-Z0-9_./%-]+$/.test(value) && !value.includes(".."))
      return true;
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        ((url.hostname === "res.cloudinary.com" &&
          url.pathname.startsWith("/dmlna04yk/")) ||
          (url.hostname ===
            new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname &&
            url.pathname.startsWith(
              "/storage/v1/object/public/product-media/",
            )) ||
          (url.hostname === "furnishingshub.co.uk" &&
            url.pathname.startsWith("/wp-content/uploads/")))
      );
    } catch {
      return false;
    }
  }, "Use an existing /images/ path or an approved catalogue image URL.");
const money = z
  .string()
  .regex(
    /^\d{1,6}(\.\d{1,2})?$/,
    "Enter a price with at most two decimal places.",
  )
  .transform((value) => {
    const [pounds, pennies = ""] = value.split(".");
    return Number(pounds) * 100 + Number(pennies.padEnd(2, "0"));
  })
  .pipe(z.number().int().min(1).max(10000000));
const schema = z.object({
  id: z.string().max(200).nullable(),
  name: z.string().trim().min(1).max(180),
  slug: z
    .string()
    .max(180)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  description: z.string().max(20000),
  categoryId: z.uuid(),
  dimensions: z.string().max(500),
  materials: z.array(z.string().max(100)).max(20),
  priceType: z.enum(["base", "from", "ask"]),
  isActive: z.boolean(),
  images: z.array(image).max(30),
  variants: z
    .array(
      z.object({
        id: z.string().min(1).max(200).nullable(),
        name: z.string().trim().min(1).max(180),
        colour: z.string().trim().max(100),
        hex: z.string().regex(/^#[0-9a-f]{6}$/i),
        pricePence: money,
        stockLevel: z
          .string()
          .regex(/^\d{0,7}$/)
          .transform((v) => (v === "" ? null : Number(v))),
        isActive: z.boolean(),
        image: z.union([z.literal(""), image]),
      }),
    )
    .max(30),
});

export async function uploadProductImage(
  form: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireStaff(["admin"]);
  const file = form.get("image");
  if (
    !(file instanceof File) ||
    file.type !== "image/webp" ||
    file.size < 12 ||
    file.size > 900000
  )
    return { error: "Choose a WebP image smaller than 900 KB." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (
    String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" ||
    String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP"
  )
    return { error: "The file is not a valid WebP image." };
  const client = createAdminClient();
  const path = `products/${crypto.randomUUID()}.webp`;
  const { error } = await client.storage
    .from("product-media")
    .upload(path, bytes, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) {
    console.error("Product image upload failed", error.name);
    return { error: "Upload failed. Please try again." };
  }
  return {
    url: client.storage.from("product-media").getPublicUrl(path).data.publicUrl,
  };
}

export async function saveProduct(
  _previous: { error: string },
  form: FormData,
) {
  const supabase = await requireStaff(["admin"]);
  const value = (name: string) => String(form.get(name) ?? "");
  const keys = form.getAll("variantKey").map(String);
  if (
    keys.length > 30 ||
    new Set(keys).size !== keys.length ||
    keys.some((k) => !/^[a-zA-Z0-9:-]+$/.test(k))
  )
    return {
      error: "Invalid configurations. Reload the editor and try again.",
    };
  const parsed = schema.safeParse({
    id: value("id") || null,
    name: value("name"),
    slug: value("slug"),
    description: value("description"),
    categoryId: value("categoryId"),
    dimensions: value("dimensions"),
    materials: value("materials")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    priceType: value("priceType"),
    isActive: form.has("isActive"),
    images: value("images")
      .split(/\r?\n/)
      .map((v) => v.trim())
      .filter(Boolean),
    variants: keys.map((key) => ({
      id: key.startsWith("new-") ? null : key,
      name: value(`${key}:name`),
      colour: value(`${key}:colour`),
      hex: value(`${key}:hex`),
      pricePence: value(`${key}:price`),
      stockLevel: value(`${key}:stock`),
      isActive: form.has(`${key}:active`),
      image: value(`${key}:image`).trim(),
    })),
  });
  if (!parsed.success)
    return {
      error: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .slice(0, 4)
        .join(" · "),
    };
  const { data, error } = await supabase.rpc("save_catalogue_product", {
    payload: parsed.data,
  });
  if (error || typeof data !== "string") {
    console.error("Catalogue save rejected", error?.code);
    return {
      error:
        error?.code === "23505"
          ? "That product URL is already in use."
          : "Could not save. Published products need a photograph and an active priced configuration; enquiry-only products must have no active configurations. Your changes have been kept in the editor.",
    };
  }
  updateTag("catalogue");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${encodeURIComponent(data)}?saved=1`);
}
