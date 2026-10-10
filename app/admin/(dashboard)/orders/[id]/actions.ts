"use server";

import { requireStaff } from "@/lib/server/staff";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
  const order_id = formData.get("order_id") as string;
  const status = formData.get("status") as string;

  if (!order_id || !status) return;

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
  revalidatePath(`/admin/orders/${order_id}`);
}
