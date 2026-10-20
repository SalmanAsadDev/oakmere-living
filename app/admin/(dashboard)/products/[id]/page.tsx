import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/server/staff";
import {
  ProductEditor,
  type EditableProduct,
} from "@/components/admin/product-editor";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const client = await requireStaff(["admin"]);
  const { id } = await params;
  const [categories, result, query] = await Promise.all([
    client.from("categories").select("id,name").order("name"),
    client
      .from("products")
      .select("*,variants(*),media_assets(*)")
      .eq("id", id)
      .maybeSingle(),
    searchParams,
  ]);
  if (categories.error || result.error)
    throw new Error("Could not load the product editor");
  if (!result.data) notFound();
  const row = result.data;
  const assets = row.media_assets as {
    variant_id: string | null;
    url: string;
    display_order: number;
  }[];
  const product: EditableProduct = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    category_id: row.category_id,
    dimensions: row.dimensions,
    materials: row.materials ?? [],
    price_type: row.price_type,
    is_active: row.is_active,
    images: assets
      .filter((a) => !a.variant_id)
      .sort((a, b) => a.display_order - b.display_order)
      .map((a) => a.url),
    variants: row.variants.map((v: EditableProduct["variants"][number]) => ({
      ...v,
      image: assets.find((a) => a.variant_id === v.id)?.url ?? "",
    })),
  };
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/admin/products" className="underline">
        Back to products
      </Link>
      <h1 className="text-2xl font-semibold">Edit {row.name}</h1>
      {query.saved === "1" ? (
        <p role="status" className="rounded bg-green-50 p-3 text-green-800">
          Product saved. Published changes are now available in the shop.
        </p>
      ) : null}
      <ProductEditor
        key={row.updated_at}
        categories={categories.data ?? []}
        product={product}
      />
    </div>
  );
}
