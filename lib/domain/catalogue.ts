import "server-only";
import { cache } from "react";
import source from "@/sofa-catalogue-for-codex.json";
import { normaliseProduct } from "./catalogue-core.mjs";
import { databaseProduct } from "./catalogue-record.mjs";
import manifest from "@/lib/data/media-manifest.json";

export type Variant = {
  id: string;
  label: string;
  colour: string;
  hex: string;
  price: number;
  image: string;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categories: string[];
  price: number | null;
  priceType: string;
  description: string;
  dimensions: string | null;
  materials: string[];
  colours: string[];
  images: { url: string; alt: string }[];
  variants: Variant[];
  features: string[];
  status: string;
  reviewFlags: string[];
};
const media = manifest as Record<string, string>;
function demoProducts(): Product[] {
  return source.products
    .map(normaliseProduct)
    .filter((p) => p.status === "ready")
    .map((product) => ({
      ...product,
      images: product.images
        .map((image: { url: string; alt: string }) => ({
          ...image,
          url: media[image.url] || image.url,
        }))
        .sort(
          (a: { url: string }, b: { url: string }) =>
            Number(b.url.startsWith("/images/")) -
            Number(a.url.startsWith("/images/")),
        ),
      variants: product.variants.map((v: Variant) => ({
        ...v,
        image: media[v.image] || v.image,
      })),
    }));
}
async function publicCatalogueQuery(query: string): Promise<unknown[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error("The collection is temporarily unavailable.");
  const response = await fetch(`${url}/rest/v1/${query}`, {
    headers: { apikey: key },
    cache: "force-cache",
    next: { tags: ["catalogue"], revalidate: 300 },
  });
  if (!response.ok)
    throw new Error("The collection is temporarily unavailable.");
  const result: unknown = await response.json();
  if (!Array.isArray(result))
    throw new Error("The collection is temporarily unavailable.");
  return result;
}
export const getProducts = cache(async (): Promise<Product[]> => {
  if (process.env.ALLOW_DEMO_DATA === "true") return demoProducts();
  const rows = await publicCatalogueQuery(
    "products?select=id,name,slug,description,base_price,price_type,is_active,category_slugs,materials,dimensions,catalogue_data,categories(slug),variants(id,name,colour,colour_hex,price_pence,stock_level,is_active),media_assets(url,alt_text,variant_id,display_order)&is_active=eq.true&order=created_at.asc,id.asc",
  );
  return rows.map(databaseProduct);
});
export const getCategories = cache(
  async (): Promise<{ name: string; slug: string }[]> => {
    if (process.env.ALLOW_DEMO_DATA === "true") return source.categories;
    return (await publicCatalogueQuery(
      "categories?select=name,slug&order=name.asc",
    )) as { name: string; slug: string }[];
  },
);
export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}
export async function getFeaturedProducts() {
  const names = [
    "uks-verona-high-back-4-seater-corner-2c1",
    "uks-salone-3and2-seater",
  ];
  return (await getProducts())
    .filter((p) => p.images.length)
    .sort(
      (a, b) =>
        Number(b.images[0]?.url.startsWith("/images/")) * 2 +
        Number(names.includes(b.slug)) -
        (Number(a.images[0]?.url.startsWith("/images/")) * 2 +
          Number(names.includes(a.slug))),
    )
    .slice(0, 8);
}
