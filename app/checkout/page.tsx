import CheckoutForm from "@/components/checkout/checkout-form";
import Link from "next/link";
import {
  liveOrderingEnabled,
  checkoutImplementationReady,
} from "@/lib/config/site";

export const metadata = {
  title: "Checkout | Oakmere Living",
};

export default function CheckoutPage() {
  if (!liveOrderingEnabled || !checkoutImplementationReady)
    return (
      <div className="container section max-w-3xl">
        <p className="eyebrow mb-5 text-muted-foreground">
          A little help from the team
        </p>
        <h1 className="display text-4xl">Let’s confirm the details.</h1>
        <p className="mt-6 text-sm leading-7 text-muted-foreground">
          Online ordering is not available yet. Your chosen sofas remain in your
          basket. Contact us to confirm availability, delivery and the total
          price before arranging an order.
        </p>
        <div className="mt-8 flex flex-wrap gap-6 text-sm">
          <Link className="link-underline" href="/contact">
            Contact the team →
          </Link>
          <Link className="link-underline" href="/cart">
            Return to your basket
          </Link>
        </div>
      </div>
    );
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutForm />
      </div>
    </main>
  );
}
