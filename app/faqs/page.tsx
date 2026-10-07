import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about ordering, delivery, and caring for your Oakmere Living furniture.",
};

export default function FaqsPage() {
  return (
    <div className="container section max-w-3xl">
      <h1 className="display text-4xl mb-4">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-12">
        Find answers to common questions about ordering, delivery, and caring for your Oakmere Living furniture.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-serif mb-4 text-primary">Ordering & Payment</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We currently accept Cash on Delivery and Card on Delivery. There is no deposit required to place your order online.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change my order after it's been placed?</h3>
              <p className="text-muted-foreground">
                If you need to make changes to your order, please contact our team as soon as possible. Changes may affect your delivery date depending on whether the items have already been processed or dispatched.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-4 text-primary">Delivery & Access</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Where do you deliver?</h3>
              <p className="text-muted-foreground">
                We deliver across the UK mainland. For deliveries to Northern Ireland, the Scottish Highlands, or offshore islands, please contact us for a custom quote.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How long will delivery take?</h3>
              <p className="text-muted-foreground">
                Mainland deliveries typically take 2-4 working days for stocked items. For Scotland and Wales, please allow 5-7 working days. Made-to-order items will have their lead times clearly communicated during checkout.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Will the delivery team bring the sofa into my room of choice?</h3>
              <p className="text-muted-foreground">
                Standard delivery includes ground-floor room of choice. If you require delivery upstairs, this is available from £20 per flight of stairs. Please select this option during checkout or contact us in advance.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-4 text-primary">Product & Care</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Do you offer fabric samples?</h3>
              <p className="text-muted-foreground">
                Yes, you can request up to four fabric swatches free of charge. Visit our swatches page to make a request, and we'll post them to you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I know if a corner sofa is left or right-hand facing?</h3>
              <p className="text-muted-foreground">
                Our orientation always refers to the sofa as you are standing looking at it from the front. If the corner section is on your left, it is a left-hand facing sofa.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
