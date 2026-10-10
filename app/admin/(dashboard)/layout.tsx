import { Metadata } from "next";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Palette,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/server/staff";

export const metadata: Metadata = {
  title: "Admin Dashboard | Oakmere Living",
  description: "Internal staff administration dashboard.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaff();
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-background border-r border-border shrink-0 flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-serif text-xl tracking-tight text-primary">
            Oakmere Admin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground">
            <Package className="h-4 w-4" />
            Catalogue
          </Link>
          <Link href="/admin/swatches" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground">
            <Palette className="h-4 w-4" />
            Swatch Requests
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground">
            <MessageSquare className="h-4 w-4" />
            Contact Enquiries
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" type="submit">
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
