import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { CatalogueGrid } from "@/components/storefront/catalogue-grid";
import { getProducts } from "@/lib/domain/catalogue";
import { absoluteUrl, site } from "@/lib/config/site";
import { getShopCategorySeo } from "@/lib/config/seo";

type ShopSearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = one(params.category);
  const categorySeo = getShopCategorySeo(category);
  const hasExtraFacet = Object.keys(params).some((key) => key !== "category");
  const canonical = categorySeo
    ? `/shop?category=${encodeURIComponent(category!)}`
    : "/shop";
  const title = categorySeo?.title || "Shop Sofas Online UK";
  const description =
    categorySeo?.description ||
    "Explore corner sofas, sofa sets, recliners, sofa beds and armchairs for UK homes. Filter by shape, material and price.";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: `${site.origin}${canonical}`,
      title,
      description,
    },
    ...(hasExtraFacet || (category && !categorySeo)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  // Keep product/filter HTML available to crawlers on the initial request.
  await connection();
  const params = await searchParams;
  const category = one(params.category);
  const categorySeo = getShopCategorySeo(category);
  const products = await getProducts();
  const listedProducts = categorySeo
    ? products.filter((product) => product.categories.includes(category!))
    : products;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categorySeo?.label || "Oakmere Living sofa collection",
    numberOfItems: listedProducts.length,
    itemListElement: listedProducts.slice(0, 50).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.origin}/products/${product.slug}`,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${site.origin}/products/${product.slug}`,
        ...(product.images[0]
          ? { image: absoluteUrl(product.images[0].url) }
          : {}),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <Suspense
        fallback={
          <div className="container section">Loading the collection…</div>
        }
      >
        <CatalogueGrid
          products={products}
          heading={categorySeo?.heading}
          intro={categorySeo?.description}
        />
      </Suspense>
    </>
  );
}
