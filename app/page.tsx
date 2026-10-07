import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  HeartHandshake,
  Truck,
} from "lucide-react";
import { ProductImage as Image } from "@/components/storefront/product-image";
import { AssemblyHero } from "@/components/storefront/assembly-hero";
import { Reveal } from "@/components/storefront/reveal";
import { ProductCard } from "@/components/storefront/product-card";
import { products, getFeaturedProducts } from "@/lib/domain/catalogue";
export default function HomePage() {
  const featured = getFeaturedProducts();
  const hero = featured[0];
  const groups = [
    { name: "Room for everyone", label: "Corner sofas", slug: "corner-sofas" },
    {
      name: "Better together",
      label: "Sofa sets",
      slug: "3-2-seater-sofa-sets",
    },
    {
      name: "Time to unwind",
      label: "Electric recliners",
      slug: "electric-recliners",
    },
  ];
  return (
    <>
      <AssemblyHero />
      <div className="border-y bg-background">
        <div className="container flex flex-wrap justify-between gap-4 py-6 text-[10px] uppercase tracking-[.14em]">
          <span>A family furniture business</span>
          <span>Cash & card on delivery</span>
          <span>Made for everyday living</span>
        </div>
      </div>
      <Reveal className="container section">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow reveal-text mb-4 text-muted-foreground">
              Find your favourite place
            </p>
            <h2 className="line-mask display text-4xl sm:text-5xl">
              <span>Every room has a story.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="reveal-text inline-flex items-center gap-4 text-xs"
          >
            Explore all sofas <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {groups.map((group, i) => {
            const product =
              products.find(
                (p) =>
                  p.categories.includes(group.slug) &&
                  p.images[0]?.url.startsWith("/images/"),
              ) || hero;
            return (
              <Reveal index={i} key={group.slug}>
                <Link href={`/shop?category=${group.slug}`} className="group">
                  <div className="asset-mask relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={product.images[0].url}
                      alt={group.label}
                      fill
                      sizes="(max-width:768px) 95vw, 33vw"
                      className="product-photo object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-5">
                    <div>
                      <p className="eyebrow text-[10px] text-muted-foreground">
                        {group.label}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl">{group.name}</h3>
                    </div>
                    <ArrowUpRight size={20} />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Reveal>
      <section className="bg-[#f0efe9]">
        <Reveal className="container section">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow reveal-text mb-4 text-muted-foreground">
                The considered collection
              </p>
              <h2 className="line-mask display text-4xl sm:text-5xl">
                <span>Good days start here.</span>
              </h2>
            </div>
            <Link className="text-xs underline underline-offset-4" href="/shop">
              View all
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((product, i) => (
              <Reveal index={i} key={product.id}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>
      <Reveal className="container section grid items-center gap-12 md:grid-cols-2">
        <div className="asset-mask relative aspect-square bg-muted">
          <Image
            src={(featured[1] || hero).images[0].url}
            alt="A sofa from the Oakmere collection"
            fill
            sizes="(max-width:768px) 95vw, 45vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-md md:pl-8">
          <p className="eyebrow reveal-text mb-6 text-muted-foreground">
            Hello, we’re Oakmere.
          </p>
          <h2 className="line-mask display text-4xl sm:text-5xl">
            <span>
              A family business.
              <br />A feeling of home.
            </span>
          </h2>
          <p className="reveal-text mt-7 text-sm leading-7 text-muted-foreground">
            We’re Sami and his brothers. What began with sharing furniture on
            social media is finding a home of its own. Our aim is simple: help
            you find furniture that fits the way you live.
          </p>
          <Link
            href="/about"
            className="reveal-text mt-8 inline-flex items-center gap-8 border-b pb-3 text-xs"
          >
            Get to know us <ArrowUpRight size={18} />
          </Link>
        </div>
      </Reveal>
      <Reveal className="container pb-20">
        <div className="grid gap-8 border-t pt-10 md:grid-cols-3">
          {[
            {
              Icon: HeartHandshake,
              title: "People behind every order",
              text: "A family team to help you choose and confirm the details.",
            },
            {
              Icon: Truck,
              title: "Let’s get the fit right",
              text: "Check your space and delivery access before choosing your sofa.",
            },
            {
              Icon: CreditCard,
              title: "Pay on delivery",
              text: "Choose cash or card on delivery. No online card details required.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon strokeWidth={1.2} className="mb-5" size={26} />
              <h2 className="font-serif text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
      <section className="bg-primary py-20 text-white">
        <Reveal className="container flex flex-wrap items-center justify-between gap-8">
          <div>
            <p className="eyebrow mb-4 text-white/65">
              Your next chapter starts here
            </p>
            <h2 className="line-mask display text-4xl sm:text-5xl">
              <span>Come in. Get comfortable.</span>
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-8 border border-white/40 px-7 py-4 text-xs"
            href="/shop"
          >
            Find your sofa <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
