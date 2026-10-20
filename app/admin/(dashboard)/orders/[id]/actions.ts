"use server";

import { requireStaff } from "@/lib/server/staff";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

export async function updateOrderStatus(formData: FormData) {
  const order_id = formData.get("order_id") as string;
  const status = formData.get("status") as string;

  if (
    !z.uuid().safeParse(order_id).success ||
    !z
      .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
      .safeParse(status).success
  )
    return;

  const supabase = await requireStaff(["admin", "sales"]);

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", order_id);

  if (error) {
    console.error("Failed to update order status", error);
    throw new Error("Failed to update order status");
  }

  revalidatePath("/admin/orders");
  updateTag("catalogue");
  revalidatePath(`/admin/orders/${order_id}`);
}
