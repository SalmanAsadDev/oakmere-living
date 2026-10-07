"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutPayload } from "@/lib/validation/checkout";

// Simple mock for cart items
const mockCartItems = [
  {
    productId: "prod_1",
    productName: "Oakmere Corner Sofa",
    quantity: 1,
    unitPrice: 1250.00,
  }
];

export default function CheckoutForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    paymentMethod: "cash_on_delivery" as "cash_on_delivery" | "card_on_delivery",
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload: CheckoutPayload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      deliveryAddress: {
        line1: formData.line1,
        line2: formData.line2,
        city: formData.city,
        postcode: formData.postcode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      cartItems: mockCartItems,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch (err: any) {
      setError(err.message || "Failed to process checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-4">
          <h3 className="text-xl font-semibold">1. Delivery Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input required type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
              <input type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
          </div>

          <h4 className="text-lg font-medium mt-6">Address</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input required type="text" value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
              <input type="text" value={formData.line2} onChange={e => setFormData({...formData, line2: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Postcode</label>
                <input required type="text" value={formData.postcode} onChange={e => setFormData({...formData, postcode: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Continue to Payment
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-semibold">2. Payment & Confirmation</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="space-y-2 text-sm text-gray-600">
              {mockCartItems.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.quantity}x {item.productName}</span>
                  <span>£{(item.quantity * item.unitPrice).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-200 pt-2 font-medium text-gray-900">
                <span>Delivery (Estimated)</span>
                <span>£50.00</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Select Payment Method</h4>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === "cash_on_delivery"}
                  onChange={() => setFormData({...formData, paymentMethod: "cash_on_delivery"})}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" 
                />
                <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
              </label>
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card_on_delivery"
                  checked={formData.paymentMethod === "card_on_delivery"}
                  onChange={() => setFormData({...formData, paymentMethod: "card_on_delivery"})}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" 
                />
                <span className="ml-3 font-medium text-gray-900">Card on Delivery</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex space-x-4">
            <button 
              type="button" 
              onClick={() => setStep(1)}
              disabled={isLoading}
              className="w-1/3 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
