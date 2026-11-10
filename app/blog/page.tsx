import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/lib/data/journal";
import { getFeaturedProducts } from "@/lib/domain/catalogue";
import { ProductImage } from "@/components/storefront/product-image";
import { Reveal } from "@/components/storefront/reveal";
export const metadata = {
  title: "The Oakmere journal",
  description:
    "Ideas for a comfortable home: furniture choices, fabric colour and making the most of your room.",
  alternates: { canonical: "/blog" },
};
export default async function BlogPage() {
  const photos = await getFeaturedProducts();
  return (
    <div className="container section">
      <p className="eyebrow mb-5 text-muted-foreground">Notes on living well</p>
      <h1 className="display text-5xl sm:text-6xl">The Oakmere journal.</h1>
      <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
        Small considerations. More comfortable spaces. A little inspiration for
        the place you call home.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal key={a.slug} index={i}>
            <Link className="group editorial-link" href={`/blog/${a.slug}`}>
              <div className="asset-mask relative aspect-[4/3] overflow-hidden bg-muted">
                {photos[i]?.images[0] && (
                  <ProductImage
                    src={photos[i].images[0].url}
                    alt={photos[i].name}
                    fill
                    sizes="(max-width:768px) 90vw, 30vw"
                    className="product-photo object-cover"
                  />
                )}
              </div>
              <p className="eyebrow mt-5 text-muted-foreground">{a.category}</p>
              <h2 className="mt-3 font-serif text-3xl">{a.title}</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {a.intro}
              </p>
              <span className="mt-5 inline-flex items-center gap-4 text-xs">
                Read the story <ArrowUpRight size={16} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
