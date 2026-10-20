"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBasket } from "@/components/storefront/basket-provider";
import { money } from "@/lib/presentation/format";
import {
  termsVersion,
  type CheckoutQuote,
  type DeliveryAddress,
} from "@/lib/validation/checkout";

const input =
  "mt-2 w-full border border-border bg-background px-3 py-3 text-sm focus:outline-primary";
export default function CheckoutForm() {
  const basket = useBasket();
  const router = useRouter();
  const [address, setAddress] = useState<DeliveryAddress>({
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    accessNotes: "",
  });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPayment] = useState<
    "cash_on_delivery" | "card_on_delivery"
  >("cash_on_delivery");
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [quoteBasket, setQuoteBasket] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const retry = useRef({ fingerprint: "", key: "" });
  const items = basket.items.map((i) => ({
    variantId: i.variantId,
    quantity: i.quantity,
  }));
  const fingerprint = JSON.stringify(items);
  const currentQuote = quoteBasket === fingerprint ? quote : null;
  async function review(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, items }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not obtain a delivery quote.");
      setQuote(result.quote);
      setQuoteBasket(fingerprint);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the team. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentQuote || pending) return;
    setPending(true);
    setError("");
    const identity = JSON.stringify({
      quoteId: currentQuote.id,
      contact,
      paymentMethod,
    });
    if (retry.current.fingerprint !== identity)
      retry.current = { fingerprint: identity, key: crypto.randomUUID() };
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: currentQuote.id,
          contact,
          paymentMethod,
          idempotencyKey: retry.current.key,
          termsVersion,
          termsAccepted: true,
          deliveryConfirmationAccepted: true,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) setQuote(null);
        throw new Error(result.error || "Order could not be confirmed.");
      }
      basket.clear();
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(result.orderId)}`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not confirm the order. Retry with the same details.",
      );
    } finally {
      setPending(false);
    }
  }
  if (!basket.ready) return <p role="status">Loading your basket…</p>;
  if (!basket.items.length)
    return (
      <div className="space-y-5">
        <h1 className="display text-4xl">Your basket is empty.</h1>
        <Link href="/shop" className="link-underline">
          Find your sofa →
        </Link>
      </div>
    );
  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="eyebrow mb-4">The final details</p>
        <h1 className="display text-4xl">Make yourself at home.</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Pay on delivery. Our team confirms stock, access and delivery
          arrangements before dispatch. No payment is taken online.
        </p>
        <p role="alert" className="my-5 text-sm text-red-700">
          {error}
        </p>
        {!currentQuote ? (
          <form onSubmit={review} className="space-y-6">
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-4 font-medium">1. Contact details</legend>
              <label className="sm:col-span-2">
                Full name
                <input
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={180}
                  value={contact.name}
                  onChange={(e) =>
                    setContact({ ...contact, name: e.target.value })
                  }
                  className={input}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                  className={input}
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  autoComplete="tel"
                  required
                  minLength={7}
                  maxLength={40}
                  value={contact.phone}
                  onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                  }
                  className={input}
                />
              </label>
            </fieldset>
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-4 font-medium">2. Delivery address</legend>
              <label className="sm:col-span-2">
                Address line 1
                <input
                  autoComplete="address-line1"
                  required
                  minLength={3}
                  maxLength={200}
                  value={address.line1}
                  onChange={(e) =>
                    setAddress({ ...address, line1: e.target.value })
                  }
                  className={input}
                />
              </label>
              <label className="sm:col-span-2">
                Address line 2 (optional)
                <input
                  autoComplete="address-line2"
                  maxLength={200}
                  value={address.line2}
                  onChange={(e) =>
                    setAddress({ ...address, line2: e.target.value })
                  }
                  className={input}
                />
              </label>
              <label>
                Town or city
                <input
                  autoComplete="address-level2"
                  required
                  minLength={2}
                  maxLength={100}
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className={input}
                />
              </label>
              <label>
                Postcode
                <input
                  autoComplete="postal-code"
                  required
                  maxLength={12}
                  value={address.postcode ?? ""}
                  onChange={(e) =>
                    setAddress({ ...address, postcode: e.target.value })
                  }
                  className={input}
                />
              </label>
              <label className="sm:col-span-2">
                Access information (optional)
                <textarea
                  rows={3}
                  maxLength={1500}
                  placeholder="Floor, stairs, narrow doors, parking or other access details"
                  value={address.accessNotes}
                  onChange={(e) =>
                    setAddress({ ...address, accessNotes: e.target.value })
                  }
                  className={input}
                />
              </label>
            </fieldset>
            <p className="text-xs leading-6 text-muted-foreground">
              UK delivery only. The postcode check validates format; it does not
              verify an address. Remote areas and extra services require a team
              quote.
            </p>
            <button
              disabled={pending}
              className="h-12 w-full bg-primary px-6 text-sm text-white disabled:opacity-60"
            >
              {pending
                ? "Checking prices and delivery…"
                : "Review your order →"}
            </button>
          </form>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <h2 className="font-medium">3. Review and place your order</h2>
            <div className="border p-5 text-sm leading-7">
              <p>
                {contact.name} · {contact.email}
              </p>
              <p>{contact.phone}</p>
              <p>
                {address.line1}, {address.line2 ? `${address.line2}, ` : ""}
                {address.city}, {address.postcode}
              </p>
              {address.accessNotes ? (
                <p>Access: {address.accessNotes}</p>
              ) : null}
              <button
                type="button"
                onClick={() => setQuote(null)}
                className="mt-3 underline"
              >
                Edit your details
              </button>
            </div>
            <fieldset className="space-y-3">
              <legend className="mb-3 text-sm font-medium">
                Payment on delivery
              </legend>
              {(["cash_on_delivery", "card_on_delivery"] as const).map(
                (method) => (
                  <label
                    key={method}
                    className="flex items-center gap-3 border p-4 text-sm"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPayment(method)}
                    />
                    {method === "cash_on_delivery"
                      ? "Cash on delivery"
                      : "Card on delivery"}
                  </label>
                ),
              )}
            </fieldset>
            <label className="flex items-start gap-3 text-sm leading-6">
              <input required type="checkbox" className="mt-1" />{" "}
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener"
                  className="underline"
                >
                  order terms
                </Link>{" "}
                and have read the{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener"
                  className="underline"
                >
                  privacy notice
                </Link>
                .
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm leading-6">
              <input required type="checkbox" className="mt-1" />
              <span>
                I understand that availability and delivery arrangements require
                team confirmation. Standard delivery is estimated at 5–7 working
                days after dispatch; production time is additional.
              </span>
            </label>
            <button
              disabled={pending}
              className="h-12 w-full bg-primary px-6 text-sm text-white disabled:opacity-60"
            >
              {pending
                ? "Placing your order…"
                : `Place order · ${money(currentQuote.totalPence)}`}
            </button>
          </form>
        )}
      </div>
      <aside className="h-fit border bg-muted/30 p-6 lg:sticky lg:top-28">
        <h2 className="display text-2xl">Your chosen pieces</h2>
        <div className="mt-6 divide-y">
          {basket.items.map((item) => {
            const priced = currentQuote?.items.find(
              (line) => line.variantId === item.variantId,
            );
            return (
              <div key={item.variantId} className="space-y-3 py-5">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center border">
                    <button
                      type="button"
                      disabled={pending || item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => basket.adjust(item.variantId, -1)}
                      className="size-11 disabled:opacity-40"
                    >
                      −
                    </button>
                    <span
                      aria-live="polite"
                      className="w-8 text-center text-sm"
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={pending || item.quantity >= 10}
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => basket.adjust(item.variantId, 1)}
                      className="size-11 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm">
                    {money(priced?.totalPence ?? item.price * item.quantity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {currentQuote ? (
          <dl className="space-y-3 border-t pt-5 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{money(currentQuote.subtotalPence)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Standard delivery</dt>
              <dd>{money(currentQuote.deliveryPence)}</dd>
            </div>
            <div className="flex justify-between pt-3 font-medium">
              <dt>Total due on delivery</dt>
              <dd>{money(currentQuote.totalPence)}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            Prices and delivery are checked against the current catalogue before
            you place an order.
          </p>
        )}
        <Link href="/cart" className="mt-6 inline-block text-xs underline">
          Return to basket
        </Link>
      </aside>
    </div>
  );
}
