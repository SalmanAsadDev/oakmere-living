import { RoomPlanner } from "@/components/previews/room-planner";
import { getProducts } from "@/lib/domain/catalogue";
export const metadata = {
  title: "Plan your room",
  description:
    "Create a private photo moodboard with sofas from the Oakmere collection. Position, resize and save your ideas.",
  alternates: { canonical: "/room-planner" },
};
export default async function RoomPlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const products = await getProducts();
  const choices = products
    .filter((p) => p.images.some((i) => i.url.startsWith("/images/")))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      categories: p.categories,
      materials: p.materials,
      dimensions: p.dimensions,
      variants: p.variants,
      image: p.images.find((i) => i.url.startsWith("/images/"))!.url,
    }));
  return (
    <div className="container section">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-5 text-muted-foreground">The room studio</p>
        <h1 className="display text-5xl sm:text-6xl">Picture it at home.</h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Bring your favourite sofa into the picture. Upload your room, choose
          from our collection and make a moodboard to keep.
        </p>
      </div>
      <RoomPlanner products={choices} initialSlug={product} />
    </div>
  );
}
