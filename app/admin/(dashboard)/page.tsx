import { createClient } from "@/lib/server/supabase";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, MessageSquare, Palette } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // NOTE: Auth logic is currently mocked or requires actual Supabase session
  // In a real scenario, we would verify the user is staff here.
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) redirect("/login");

  // Fetch some summary stats
  const [orders, contacts, swatches] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("contact_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("swatch_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome to the Oakmere Living administration panel.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Enquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Swatch Requests</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{swatches.count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">To be dispatched</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
