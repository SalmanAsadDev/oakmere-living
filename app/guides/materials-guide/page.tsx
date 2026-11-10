import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Fabric vs Leather Sofa Guide",
  description: "Compare the benefits of different materials to find the perfect match for your lifestyle.",
  alternates: { canonical: "/guides/materials-guide" },
};

export default function MaterialsGuidePage() {
  return (
    <div className="container section max-w-3xl">
      <div className="mb-8">
        <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
          &larr; Back to Guides
        </Link>
      </div>
      
      <h1 className="display text-4xl mb-4">Fabric vs Leather</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Choosing between a fabric or leather sofa is one of the biggest decisions you'll make when furnishing your living room. 
        Both materials have their own unique benefits and considerations. This guide will help you decide which is best for your lifestyle.
      </p>

      <div className="prose prose-sm md:prose-base text-foreground max-w-none space-y-12">
        
        <section>
          <h2 className="text-3xl font-serif text-primary mb-6">Fabric Sofas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">The Benefits</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><strong>Comfort:</strong> Fabric is generally softer and warmer to the touch than leather, making it cosy from the moment you sit down.</li>
                <li><strong>Variety:</strong> Available in an almost endless array of colours, patterns, and textures (from velvet to linen blends), allowing for greater personalization.</li>
                <li><strong>Cost:</strong> High-quality fabric sofas are often more affordable than top-grain leather sofas of the same size.</li>
                <li><strong>Scratch Resistance:</strong> Tightly woven fabrics can be more resistant to pet scratches than some leathers.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Considerations</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><strong>Stains:</strong> Spills can soak in quickly, though many modern fabrics are treated for stain resistance or feature removable, washable covers.</li>
                <li><strong>Allergens:</strong> Fabric can trap dust, pet hair, and allergens more easily than leather, requiring regular vacuuming.</li>
                <li><strong>Fading:</strong> Some fabrics may fade if exposed to direct sunlight over long periods.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pt-8 border-t border-border">
          <h2 className="text-3xl font-serif text-primary mb-6">Leather Sofas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">The Benefits</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><strong>Durability:</strong> Genuine leather is incredibly tough and can last for decades. It often looks better with age, developing a rich patina.</li>
                <li><strong>Easy to Clean:</strong> Most spills can simply be wiped away, making it ideal for busy families.</li>
                <li><strong>Hypoallergenic:</strong> Leather doesn't harbor dust mites, pet dander, or other allergens like fabric can.</li>
                <li><strong>Aesthetics:</strong> Leather adds a touch of classic elegance and luxury to any room.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Considerations</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><strong>Temperature:</strong> Leather can feel cold in winter and sticky in summer until it adjusts to your body temperature.</li>
                <li><strong>Maintenance:</strong> Requires periodic conditioning to prevent cracking and maintain its supple feel.</li>
                <li><strong>Cost:</strong> Quality genuine leather is typically more of an investment upfront.</li>
                <li><strong>Scratches:</strong> While tough, sharp pet claws or keys can scratch the surface.</li>
              </ul>
            </div>
          </div>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="font-serif text-xl mb-4">Try before you buy</h3>
        <p className="text-muted-foreground mb-6">
          Still not sure? The best way to decide is to feel the materials for yourself. 
          Request up to four free fabric or leather swatches to see how they look in your home.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/swatches">Request Swatches</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
