import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
export const metadata = {
  title: "Help with your order",
  robots: { index: false, follow: false },
};
export default function MyOrdersPage() {
  return (
    <div className="container section max-w-3xl">
      <p className="eyebrow mb-5 text-muted-foreground">
        Here after you choose
      </p>
      <h1 className="display text-5xl">Let’s look after your order.</h1>
      <div className="my-9 border bg-white p-8">
        <Package size={30} strokeWidth={1} />
        <h2 className="mt-5 font-serif text-2xl">Ask the team for an update</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Have your order reference ready and contact us using the email address
          supplied with your order. The team will verify the details before
          sharing an update.
        </p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Self-service tracking is not available yet. Please don’t send
          payment-card details or identity documents through the contact form.
        </p>
        <Link
          className="editorial-link mt-6 inline-flex items-center gap-4 link-underline text-sm"
          href="/contact?message=Please%20help%20me%20with%20an%20update%20on%20my%20order."
        >
          Get order help <ArrowRight size={16} />
        </Link>
      </div>
      <Link href="/cart" className="text-sm link-underline">
        Still choosing? Return to your basket
      </Link>
    </div>
  );
}
