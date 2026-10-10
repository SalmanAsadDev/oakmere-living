import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/domain/catalogue";
import { ProductDetail } from "@/components/storefront/product-detail";
import { ProductCard } from "@/components/storefront/product-card";
import { Reveal } from "@/components/storefront/reveal";
import Link from "next/link";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProduct(slug);
  return {
    title: p?.name || "Sofa not found",
    description: p?.description.slice(0, 160),
    alternates: { canonical: `/products/${slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((category) => product.categories.includes(category)),
    )
    .slice(0, 4);
  return (
    <>
      <ProductDetail product={product} />
      <section className="container section border-t">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-4 text-muted-foreground">Keep exploring</p>
            <h2 className="font-serif text-4xl">More room to fall in love.</h2>
          </div>
          <Link className="link-underline text-sm" href="/shop">
            See all sofas →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, index) => (
            <Reveal key={p.id} index={index}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
