import { requireStaff } from "@/lib/server/staff";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
  const supabase = await requireStaff();
  
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded">Failed to load orders.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-primary">Orders</h1>
      </div>

      <div className="bg-card rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Order Date</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Payment</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  {format(new Date(order.created_at), "dd MMM yyyy, HH:mm")}
                  <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]" title={order.id}>
                    ID: {order.id.split('-')[0]}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">
                  {order.customer_name}
                  <div className="text-xs text-muted-foreground mt-1 font-normal">
                    <a href={`mailto:${order.customer_email}`} className="hover:underline">{order.customer_email}</a>
                  </div>
                  {order.customer_phone && (
                    <div className="text-xs text-muted-foreground font-normal">{order.customer_phone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  £{(order.total_amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-xs whitespace-nowrap uppercase tracking-wider">
                  {order.payment_method.replace(/_/g, ' ')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
