import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout | Oakmere Living",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutForm />
      </div>
    </main>
  );
}
