import { getProducts } from "@/lib/domain/catalogue";
import SwatchRequest from "@/components/storefront/swatch-request";
export const metadata = {
  title: "Fabric swatches",
  description:
    "Choose up to four listed sofa finishes and ask Oakmere for fabric samples to compare at home.",
};
export default async function SwatchesPage() {
  const products = await getProducts();
  const choices = products
    .filter((p) => p.variants.length > 0)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      categories: p.categories,
      materials: p.materials,
      dimensions: p.dimensions,
      variants: p.variants,
      image: p.images[0]?.url || "",
    }));
  return <SwatchRequest products={choices} />;
}
