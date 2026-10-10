import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Reveal } from "@/components/storefront/reveal";
export const metadata = {
  title: "Customer reviews",
  description:
    "Real experiences belong here. Share your Oakmere Living feedback with our family team.",
};
export default function ReviewsPage() {
  return (
    <Reveal className="container section max-w-4xl">
      <p className="eyebrow mb-5 text-muted-foreground">
        From one home to another
      </p>
      <h1 className="line-mask display text-5xl sm:text-6xl">
        <span>Your experience matters.</span>
      </h1>
      <div className="my-10 border bg-muted/40 p-8 sm:p-12">
        <MessageSquare size={30} strokeWidth={1} />
        <h2 className="mt-6 font-serif text-3xl">
          Our story is just beginning here.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          We don’t have published customer reviews on this website yet. When
          customers share their experiences and give permission, this will be
          their space.
        </p>
        <Link
          href="/contact?message=I%20would%20like%20to%20share%20feedback%20about%20my%20Oakmere%20experience."
          className="editorial-link mt-6 inline-flex items-center gap-5 border-b pb-2 text-sm"
        >
          Share feedback with the team <ArrowRight size={16} />
        </Link>
      </div>
      <Link
        className="editorial-link inline-flex items-center gap-5 text-sm"
        href="/shop"
      >
        Explore the collection <ArrowRight size={16} />
      </Link>
    </Reveal>
  );
}
