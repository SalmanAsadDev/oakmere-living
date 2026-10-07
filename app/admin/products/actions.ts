"use server";

import { createAdminClient } from "@/lib/server/supabase";
import { productSchema } from "@/lib/validation/catalogue";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = createAdminClient();

  const payload = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    basePrice: parseFloat(formData.get("basePrice") as string),
    categoryId: formData.get("categoryId") as string || undefined,
    isActive: formData.get("isActive") === "on",
  };

  const result = productSchema.safeParse(payload);

  if (!result.success) {
    throw new Error("Validation failed: " + JSON.stringify(result.error.format()));
  }

  const data = result.data;

  const { error } = await supabase.from("products").insert({
    name: data.name,
    slug: data.slug,
    description: data.description,
    base_price: data.basePrice,
    category_id: data.categoryId,
    is_active: data.isActive,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
