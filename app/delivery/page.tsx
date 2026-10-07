import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Information",
  description: "Find out everything you need to know about delivery areas, costs, timescales and preparing for your new furniture.",
};

export default function DeliveryPage() {
  return (
    <div className="container section max-w-3xl">
      <h1 className="display text-4xl mb-4">Delivery Information</h1>
      <p className="text-muted-foreground mb-12 text-lg">
        We want the arrival of your new furniture to be as exciting and stress-free as possible. 
        Here is everything you need to know about our delivery services, areas, and how to prepare.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-serif mb-4 text-primary">Delivery Costs & Areas</h2>
          <div className="bg-muted/50 border border-border p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-2">UK Mainland (Ground Floor)</h3>
            <p className="text-2xl font-bold text-primary mb-2">FREE</p>
            <p className="text-muted-foreground text-sm">
              Standard ground floor delivery is included at no extra cost for most UK mainland postcodes.
            </p>
          </div>
          <div className="prose prose-sm text-muted-foreground max-w-none">
            <p>
              We deliver to the majority of the UK mainland. Our checkout will verify if your specific postcode 
              qualifies for free delivery. 
            </p>
            <p className="mt-4">
              <strong>Remote areas and islands:</strong> For the Scottish Highlands, offshore islands, and Northern Ireland, 
              please contact us for a delivery quote before placing your order. These areas may incur additional charges and extended lead times.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-4 text-primary">Delivery Timescales</h2>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="border border-border p-6 rounded-lg">
              <h3 className="font-semibold mb-2">England</h3>
              <p className="text-muted-foreground">Estimated 2-4 working days for stocked items.</p>
            </div>
            <div className="border border-border p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Scotland & Wales</h3>
              <p className="text-muted-foreground">Estimated 5-7 working days for stocked items.</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            * Estimated delivery times are subject to confirmation by our team. Made-to-order items 
            will have specific lead times that will be communicated during checkout or by our team.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-4 text-primary">Additional Services</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="font-semibold">Upper Floor Delivery</h3>
                <p className="text-sm text-muted-foreground">If you live in a flat without a lift or need furniture taking upstairs.</p>
              </div>
              <span className="font-semibold whitespace-nowrap ml-4">From £20 per flight</span>
            </div>
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="font-semibold">Assembly Service</h3>
                <p className="text-sm text-muted-foreground">Our team will unbox and assemble your new furniture in your room of choice.</p>
              </div>
              <span className="font-semibold whitespace-nowrap ml-4">£20</span>
            </div>
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="font-semibold">Old Furniture Removal</h3>
                <p className="text-sm text-muted-foreground">Responsible disposal and recycling of your old sofa.</p>
              </div>
              <span className="font-semibold whitespace-nowrap ml-4">£10 per seat</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-4 text-primary">Preparing for Delivery</h2>
          <div className="prose prose-sm text-muted-foreground max-w-none">
            <p>
              To ensure a smooth delivery, please make sure you have accurately measured all doorways, 
              hallways, and staircases that the delivery team will need to navigate. 
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Clear the path of any trip hazards, rugs, or fragile items.</li>
              <li>Ensure there is adequate parking for our delivery vehicle.</li>
              <li>Someone over the age of 18 must be present to accept and sign for the delivery.</li>
            </ul>
            <p className="mt-4 text-sm text-destructive">
              <strong>Note:</strong> A missed delivery slot may result in a £50 redelivery charge. Please notify us 
              at least 48 hours in advance if you need to reschedule.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
