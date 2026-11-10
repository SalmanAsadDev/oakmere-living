import { getProducts, getCategories } from "@/lib/domain/catalogue";
import { SofaBuilder } from "@/components/storefront/sofa-builder";
export const metadata = {
  title: "Build your sofa",
  description:
    "Choose a shape, design and real catalogue configuration. Build a sofa shortlist or send a custom design enquiry to Oakmere.",
  alternates: { canonical: "/build" },
};
export default async function BuildPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const choices = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    categories: p.categories,
    materials: p.materials,
    dimensions: p.dimensions,
    variants: p.variants,
    image: p.images[0]?.url || "",
  }));
  return (
    <div className="container section">
      <p className="eyebrow mb-5 text-muted-foreground">The sofa studio</p>
      <h1 className="display text-5xl sm:text-6xl">
        Made for the way you live.
      </h1>
      <p className="my-6 max-w-xl text-sm leading-7 text-muted-foreground">
        Find your shape. Pick your favourite. Explore the details. Build from
        our collection, or prepare a brief for something a little different.
      </p>
      <SofaBuilder products={choices} categories={categories} />
    </div>
  );
}
