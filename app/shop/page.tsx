import { Suspense } from "react";
import { connection } from "next/server";
import { CatalogueGrid } from "@/components/storefront/catalogue-grid";
import { products } from "@/lib/domain/catalogue";
export const metadata = {
  title: "Shop sofas",
  description:
    "Explore the Oakmere Living sofa collection. Filter by shape and material and find your favourite place.",
  alternates: { canonical: "/shop" },
};
export default async function ShopPage() {
  // Keep product/filter HTML available to crawlers on the initial request.
  await connection();
  return (
    <Suspense
      fallback={
        <div className="container section">Loading the collection…</div>
      }
    >
      <CatalogueGrid products={products} />
    </Suspense>
  );
}
