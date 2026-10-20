import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using Oakmere Living and purchasing our products.",
};

export default function TermsPage() {
  return (
    <div className="container section max-w-3xl">
      <h1 className="display text-4xl mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: 20 October 2026
      </p>

      <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none space-y-6">
        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          1. General
        </h2>
        <p>
          These Terms of Service govern your use of our website and the purchase
          of products from Oakmere Living. By accessing this website and/or
          purchasing products, you agree to be bound by these terms.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          2. Products and Availability
        </h2>
        <p>
          We make every effort to display as accurately as possible the colours,
          dimensions, and features of our products. However, we cannot guarantee
          that your device's display of any colour will be completely accurate.
          All product measurements are approximate.
        </p>
        <p>
          All products are subject to availability. We reserve the right to
          limit the quantities of any products or services that we offer and to
          discontinue any product at any time.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          3. Pricing and Orders
        </h2>
        <p>
          Prices for our products are subject to change without notice. All
          prices include VAT at the applicable current rate.
        </p>
        <p>
          Your order on our website constitutes a request to purchase. Orders
          are confirmed and accepted only when our team reviews the order and
          confirms delivery availability and timescales.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          4. Payment
        </h2>
        <p>
          We currently accept Cash on Delivery and Card on Delivery. Payment
          must be made in full to our delivery team before goods are unloaded
          and placed in your property.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          5. Delivery
        </h2>
        <p>
          Delivery times are estimates and not guaranteed. We are not liable for
          any delays in delivery. It is your responsibility to ensure that the
          furniture you order will fit through all access points (doors, stairs,
          hallways) and into your room of choice.
        </p>
        <p>
          If a delivery fails due to lack of access or nobody being present to
          accept the delivery during the agreed time slot, a redelivery charge
          of £50 may apply.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          6. Cancellations and Returns
        </h2>
        <p>
          For standard stocked items, you may cancel your order at any time
          before delivery. Once delivered, you have 14 days to notify us if you
          wish to return the item in its original condition. A collection fee
          will apply.
        </p>
        <p>
          Made-to-order items cannot be cancelled or returned once production
          has begun, unless the item is faulty or not as described.
        </p>
        <p>
          If your item arrives faulty or damaged, please notify the delivery
          team immediately and contact our customer service team.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          7. Liability
        </h2>
        <p>
          Our liability for any claim relating to a product purchased from us
          shall not exceed the price of the product in question. We do not
          exclude or limit our liability for death or personal injury caused by
          our negligence, or for fraud.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          8. Governing Law
        </h2>
        <p>
          These Terms of Service and any separate agreements whereby we provide
          you Services shall be governed by and construed in accordance with the
          laws of England and Wales.
        </p>
      </div>
    </div>
  );
}
