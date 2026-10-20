import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/server/supabase";
import { guestCookie, sessionHash } from "@/lib/server/checkout";
import { money } from "@/lib/presentation/format";

export const metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const token = (await cookies()).get(guestCookie)?.value;
  if (
    !token ||
    !/^[a-f0-9]{64}$/.test(token) ||
    !z.uuid().safeParse(orderId).success
  )
    notFound();
  const { data: order, error } = await createAdminClient()
    .from("orders")
    .select(
      "id,total_amount,payment_method,status,order_items(product_name,quantity)",
    )
    .eq("id", orderId!)
    .eq("session_id", sessionHash(token))
    .maybeSingle();
  if (error || !order) notFound();
  return (
    <div className="container section max-w-2xl">
      <p className="eyebrow mb-5">Thank you</p>
      <h1 className="display text-4xl">Your order is received.</h1>
      <p className="mt-6 text-sm leading-7 text-muted-foreground">
        Our team will confirm availability and delivery arrangements before
        dispatch. No payment has been taken online. Save your reference below.
      </p>
      <div className="my-8 space-y-4 border p-6 text-sm">
        <p className="break-all">
          Order reference: <strong>{order.id}</strong>
        </p>
        {order.order_items.map(
          (item: { product_name: string; quantity: number }, index: number) => (
            <p key={index}>
              {item.quantity} × {item.product_name}
            </p>
          ),
        )}
        <p>
          Due on delivery:{" "}
          <strong>{money(Math.round(Number(order.total_amount) * 100))}</strong>
        </p>
        <p>
          Payment:{" "}
          {order.payment_method === "cash_on_delivery"
            ? "Cash on delivery"
            : "Card on delivery"}
        </p>
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <Link
          href={`/contact?order=${encodeURIComponent(order.id)}`}
          className="link-underline"
        >
          Ask about your order →
        </Link>
        <Link href="/shop" className="link-underline">
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
