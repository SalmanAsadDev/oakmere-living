import Link from "next/link";
import { Reveal } from "@/components/storefront/reveal";
export const metadata = {
  title: "Our story",
  description: "Meet the family behind Oakmere Living.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <div className="container section">
      <Reveal className="mx-auto max-w-3xl">
        <p className="eyebrow text-muted-foreground">
          A warm welcome from our family
        </p>
        <h1 className="line-mask display my-6 text-5xl sm:text-7xl">
          <span>A place to call home.</span>
        </h1>
        <p className="font-serif text-2xl leading-relaxed">
          We’re Sami and his brothers. We believe choosing furniture should feel
          personal.
        </p>
        <div className="mt-8 space-y-6 text-sm leading-8 text-muted-foreground">
          <p>
            Our business began by sharing sofas and furniture through social
            media. Oakmere Living is the next step: a place to explore our
            collection, compare the details and find something that fits your
            home.
          </p>
          <p>
            Behind the website is our family team. We handle enquiries, confirm
            orders and organise fulfilment, so there are real people looking
            after the details.
          </p>
          <p>
            Whether you’re furnishing your first home or making a little more
            room for the family, take your time. Have a look around. Make
            yourself comfortable.
          </p>
        </div>
        <Link
          href="/shop"
          className="mt-10 inline-block bg-primary px-7 py-4 text-xs text-white"
        >
          Explore the collection →
        </Link>
      </Reveal>
    </div>
  );
}
