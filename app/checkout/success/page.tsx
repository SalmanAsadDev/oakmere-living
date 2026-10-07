import { Suspense } from "react";
import SuccessContent from "./success-content";

export const metadata = {
  title: "Order Confirmed | Oakmere Living",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center p-8">Loading order details...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
