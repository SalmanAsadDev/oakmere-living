import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/domain/catalogue";
import { ProductDetail } from "@/components/storefront/product-detail";
import { ProductCard } from "@/components/storefront/product-card";
import { Reveal } from "@/components/storefront/reveal";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/config/site";

function truncateDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s\S*$/, "") + "…";
}

export async function generateStaticParams() {
  const products = await getProducts().catch(() => []);
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Sofa not found" };
  const description = p.description
    ? truncateDescription(p.description)
    : undefined;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: p.name,
      description,
      type: "website",
      url: `${site.origin}/products/${slug}`,
      ...(p.images[0]
        ? { images: [{ url: absoluteUrl(p.images[0].url), alt: p.name }] }
        : {}),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, products] = await Promise.all([
    getProduct(slug),
    getProducts(),
  ]);
  if (!product) notFound();

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((category) => product.categories.includes(category)),
    )
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    url: `${site.origin}/products/${product.slug}`,
    ...(product.images.length
      ? { image: product.images.map((image) => absoluteUrl(image.url)) }
      : {}),
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            url: `${site.origin}/products/${product.slug}`,
            priceCurrency: "GBP",
            price: (product.price / 100).toFixed(2),
            priceSpecification: {
              "@type": "PriceSpecification",
              price: (product.price / 100).toFixed(2),
              priceCurrency: "GBP",
            },
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "OnlineStore", name: site.name },
          },
        }
      : {}),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.origin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop sofas",
        item: `${site.origin}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${site.origin}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
