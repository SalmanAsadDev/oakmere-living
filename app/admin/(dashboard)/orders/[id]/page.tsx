import { createAdminClient } from "@/lib/server/supabase";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "./actions";
import { Button } from "@/components/ui/button";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif text-primary">Order {order.id.split("-")[0]}</h1>
          <p className="text-muted-foreground mt-1">
            Placed on {format(new Date(order.created_at), "dd MMMM yyyy 'at' HH:mm")}
          </p>
        </div>
        <div className="bg-card p-4 rounded-md border border-border">
          <form action={updateOrderStatus} className="flex items-center gap-3">
            <input type="hidden" name="order_id" value={order.id} />
            <select 
              name="status" 
              defaultValue={order.status}
              className="text-sm rounded-md border-border bg-background p-2"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button type="submit" size="sm">Update Status</Button>
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-md border border-border">
          <h2 className="font-serif text-xl mb-4 text-primary">Customer Details</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-muted-foreground w-24 inline-block">Name:</span> {order.customer_name}</p>
            <p><span className="font-medium text-muted-foreground w-24 inline-block">Email:</span> <a href={`mailto:${order.customer_email}`} className="text-primary hover:underline">{order.customer_email}</a></p>
            <p><span className="font-medium text-muted-foreground w-24 inline-block">Phone:</span> {order.customer_phone || "Not provided"}</p>
            <p><span className="font-medium text-muted-foreground w-24 inline-block">Payment:</span> <span className="uppercase">{order.payment_method.replace(/_/g, " ")}</span></p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-md border border-border">
          <h2 className="font-serif text-xl mb-4 text-primary">Delivery Address</h2>
          <div className="text-sm whitespace-pre-wrap">
            {order.delivery_address?.line1}
            {order.delivery_address?.line2 && `\n${order.delivery_address.line2}`}
            {order.delivery_address?.city && `\n${order.delivery_address.city}`}
            {order.delivery_address?.county && `\n${order.delivery_address.county}`}
            {order.delivery_address?.postcode && `\n${order.delivery_address.postcode}`}
            {order.delivery_address?.country && `\n${order.delivery_address.country}`}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-md border border-border overflow-hidden mt-8">
        <h2 className="font-serif text-xl p-6 border-b border-border text-primary">Order Items</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Quantity</th>
              <th className="px-6 py-4 font-medium">Unit Price</th>
              <th className="px-6 py-4 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {order.order_items?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-medium">
                  {item.product_name}
                  {item.variant_id && <div className="text-xs text-muted-foreground mt-1">Variant: {item.variant_id}</div>}
                </td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">£{item.unit_price.toFixed(2)}</td>
                <td className="px-6 py-4 font-medium">£{item.total_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/50 border-t border-border">
            <tr>
              <td colSpan={3} className="px-6 py-3 text-right text-muted-foreground">Subtotal</td>
              <td className="px-6 py-3 font-medium">£{order.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-3 text-right text-muted-foreground">Delivery</td>
              <td className="px-6 py-3 font-medium">£{order.delivery_cost.toFixed(2)}</td>
            </tr>
            <tr className="border-t border-border bg-muted/80">
              <td colSpan={3} className="px-6 py-4 text-right font-medium">Total</td>
              <td className="px-6 py-4 font-bold text-base">£{order.total_amount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
