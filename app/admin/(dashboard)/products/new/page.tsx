import Link from "next/link";
import { requireStaff } from "@/lib/server/staff";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function NewProductPage() {
  const client = await requireStaff(["admin"]);
  const { data, error } = await client
    .from("categories")
    .select("id,name")
    .order("name");
  if (error) throw new Error("Could not load categories");
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/admin/products" className="underline">
        Back to products
      </Link>
      <h1 className="text-2xl font-semibold">New product</h1>
      <ProductEditor categories={data ?? []} />
    </div>
  );
}
