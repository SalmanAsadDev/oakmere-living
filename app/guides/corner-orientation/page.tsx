import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Left vs Right Hand Corner Sofas Guide",
  description: "Confused about corner sofa orientation? Our simple guide explains how to choose the correct side.",
  alternates: { canonical: "/guides/corner-orientation" },
};

export default function CornerOrientationGuidePage() {
  return (
    <div className="container section max-w-3xl">
      <div className="mb-8">
        <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
          &larr; Back to Guides
        </Link>
      </div>
      
      <h1 className="display text-4xl mb-4">Left vs Right Hand Corner Sofas</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Choosing the correct orientation for your corner sofa is crucial, but it can often be confusing. 
        Different retailers use different rules, so it's important to understand how we define "left" and "right" at Oakmere Living.
      </p>

      <div className="prose prose-sm md:prose-base text-foreground max-w-none space-y-8">
        
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">The Oakmere Living Rule</h2>
          <div className="bg-muted/30 p-6 rounded-lg border border-border mb-6">
            <p className="font-semibold text-lg mb-0 text-primary">
              Always look at the sofa from the front, as if you are standing facing it.
            </p>
          </div>
          <p>
            When you stand directly in front of the sofa and look at it:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
            <li>If the corner piece or chaise extends out towards you on the <strong>left side</strong>, it is a <strong>Left-Hand Facing (LHF)</strong> sofa.</li>
            <li>If the corner piece or chaise extends out towards you on the <strong>right side</strong>, it is a <strong>Right-Hand Facing (RHF)</strong> sofa.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">Why does orientation matter?</h2>
          <p>
            Corner sofas are usually designed to fit snugly into the corner of a room to maximize space, 
            or to act as a room divider in open-plan living areas.
          </p>
          <p className="mt-4">
            If you order the wrong orientation, the long section may block doorways, walkways, or windows, 
            or it might simply face the wrong way for your TV and focal points.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">Symmetrical vs Asymmetrical</h2>
          <p>
            <strong>Asymmetrical Corner Sofas:</strong> These have one side longer than the other (e.g., a 3-seater section 
            meeting a 2-seater section). Orientation is critical here. You need to decide whether the longer side 
            should be on the left or the right.
          </p>
          <p className="mt-4">
            <strong>Symmetrical Corner Sofas:</strong> These have equal lengths on both sides (e.g., a 2-seater section 
            meeting a 2-seater section). For truly symmetrical sofas, left or right orientation may not matter, but always 
            check the product details carefully.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="font-serif text-xl mb-4">Ready to find your perfect sofa?</h3>
        <p className="text-muted-foreground mb-6">
          Now that you know how to choose the right orientation, explore our collection of corner sofas.
        </p>
        <Button asChild>
          <Link href="/shop?category=corner-sofas">Shop Corner Sofas</Link>
        </Button>
      </div>
    </div>
  );
}
