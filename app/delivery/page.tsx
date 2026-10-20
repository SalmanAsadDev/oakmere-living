import Link from "next/link";
import { DeliveryCheck } from "@/components/storefront/delivery-check";
import { deliveryPolicy } from "@/lib/domain/delivery.mjs";
import { money } from "@/lib/presentation/format";

export const metadata = {
  title: "Delivery information",
  description:
    "Check a delivery estimate, understand dispatch and production lead times, and prepare your space for your sofa.",
};
export default function DeliveryPage() {
  return (
    <div className="container section max-w-4xl">
      <p className="eyebrow mb-5 text-muted-foreground">
        From our collection to your home
      </p>
      <h1 className="display text-4xl sm:text-6xl">A considered arrival.</h1>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">
        Check your delivery area and discuss access with the team before
        ordering. Delivery windows are estimates after dispatch; production and
        supplier lead times are additional.
      </p>
      <div className="my-10">
        <DeliveryCheck />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          [
            "Standard mainland",
            "Free estimate",
            "Allow 5–7 working days after dispatch. Coverage and room access are confirmed with the team.",
          ],
          [
            "Express enquiry",
            money(deliveryPolicy.expressPence),
            "Indicative 2–3 working days after dispatch, where available. Ask the team to confirm before choosing this service.",
          ],
          [
            "Old sofa removal",
            money(deliveryPolicy.removalPence),
            "Indicative service price. Ask about availability, the item to be collected and access arrangements.",
          ],
        ].map(([title, price, body]) => (
          <section key={title} className="border-t pt-6">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="my-4 text-lg">{price}</p>
            <p className="text-sm leading-7 text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
      <div className="mt-14 space-y-10 text-sm leading-7">
        <section>
          <h2 className="mb-4 font-serif text-2xl">Before dispatch</h2>
          <p className="text-muted-foreground">
            Made-to-order furniture can require an indicative 2–4 weeks of
            production before dispatch. Your selected sofa may be stocked or
            supplier-sourced instead; the team will confirm its own availability
            and lead time. An express delivery estimate does not shorten
            production.
          </p>
        </section>
        <section>
          <h2 className="mb-4 font-serif text-2xl">Your delivery area</h2>
          <p className="text-muted-foreground">
            Standard mainland delivery is estimated as free. Northern Ireland,
            the Highlands, offshore islands and other locations needing
            additional arrangements require a team-confirmed quote. A correctly
            formatted postcode does not establish coverage or guarantee a
            delivery date.
          </p>
        </section>
        <section>
          <h2 className="mb-4 font-serif text-2xl">
            Let’s get the access right.
          </h2>
          <p className="text-muted-foreground">
            Measure doorways, corridors, stair turns and the final room. Tell
            the team about your floor, lift, parking and any narrow access.
            Confirm room-of-choice delivery, stairs, assembly and packaging
            removal with the team; these are not automatically booked by the
            postcode checker.
          </p>
          <Link
            href="/guides/measuring-for-delivery"
            className="mt-3 inline-block link-underline"
          >
            Read the measuring guide →
          </Link>
        </section>
        <section>
          <h2 className="mb-4 font-serif text-2xl">Pay on delivery</h2>
          <p className="text-muted-foreground">
            Cash and card on delivery remain the payment options for Oakmere.
            You will not be asked to enter card details on this website.
          </p>
        </section>
      </div>
      <Link
        href="/contact?message=Please%20help%20me%20confirm%20delivery%20coverage%2C%20timing%20and%20access%20for%20my%20sofa."
        className="editorial-link mt-10 inline-flex min-h-12 items-center border-b text-sm"
      >
        Ask the team about delivery →
      </Link>
    </div>
  );
}
