"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow text-center">
      <div>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Thank you for shopping with Oakmere Living.
        </p>
      </div>
      
      {orderId && (
        <div className="bg-gray-50 p-4 rounded text-sm text-gray-700">
          Order Reference: <span className="font-mono font-medium">{orderId}</span>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          We will contact you shortly to arrange delivery. Payment will be collected upon delivery as selected.
        </p>
        
        <div className="pt-4">
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
