import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Measuring for Delivery Guide",
  description: "Learn how to accurately measure your doorways, hallways, and room to ensure your new sofa fits perfectly.",
  alternates: { canonical: "/guides/measuring-for-delivery" },
};

export default function MeasuringGuidePage() {
  return (
    <div className="container section max-w-3xl">
      <div className="mb-8">
        <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
          &larr; Back to Guides
        </Link>
      </div>
      
      <h1 className="display text-4xl mb-4">Measuring for Delivery</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Finding the perfect sofa is only half the journey. Ensuring it can be delivered into your home 
        and fits your space is just as important. Follow this simple guide to avoid delivery day disappointment.
      </p>

      <div className="prose prose-sm md:prose-base text-foreground max-w-none space-y-8">
        
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">1. Measure Your Space</h2>
          <p>
            Before you buy, map out exactly where the sofa will sit in your room. 
            Use masking tape or newspaper on the floor to outline the sofa's dimensions (Width x Depth).
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
            <li>Ensure there's enough space to walk around the sofa comfortably.</li>
            <li>Check clearance for any opening doors, drawers, or cupboards nearby.</li>
            <li>Leave a gap between the sofa and any radiators to prevent heat damage.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">2. Check Doorways and Access</h2>
          <p>
            You need to confirm that the sofa can fit through every door from the street to your room.
          </p>
          <div className="bg-muted/30 p-6 rounded-lg my-6">
            <h3 className="font-semibold mb-2">How to measure:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
              <li>Open your front door as wide as possible. Measure the narrowest point across the width (from the inside of the door frame to the inside of the door).</li>
              <li>Compare this measurement to the sofa's <strong>Height</strong>. The doorway width needs to be greater than the sofa's height, as sofas are typically carried through on their side.</li>
              <li>If the doorway is narrower than the sofa's height, check the sofa's <strong>Depth</strong>. Sometimes a sofa can be manoeuvred through if the depth is smaller than the doorway.</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">3. Hallways and Stairs</h2>
          <p>
            Hallways and stairs are common pinch points. You need to ensure there is enough room to turn 
            corners if the route to your room isn't straight.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
            <li>Measure the width of the hallway at its narrowest point.</li>
            <li>Check the ceiling height in the hallway and on stairways to ensure the sofa can be stood on end if necessary to turn a corner.</li>
            <li>Note any non-removable obstacles like banisters, light fixtures, or low bulkheads.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">4. Lifts and Flats</h2>
          <p>
            If you live in a flat, you must measure the lift dimensions (height, width, and depth) and the lift doorway width. 
            If the sofa cannot fit in the lift, or if you don't have one, please measure the width of the staircase and check 
            for turning space on the landings.
          </p>
          <p className="mt-4 text-sm bg-accent/50 p-4 rounded-md border border-border">
            <strong>Note:</strong> We offer an upper floor delivery service for flats without lifts, from £20 per flight of stairs. 
            Please inform us in advance so we can allocate the right delivery team.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="font-serif text-xl mb-4">Still unsure?</h3>
        <p className="text-muted-foreground mb-6">
          If you have any doubts about whether a sofa will fit, please contact our team before ordering. 
          It helps to have your measurements ready, and photos of the access route can also be useful.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Our Team</Link>
        </Button>
      </div>
    </div>
  );
}
