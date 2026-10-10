"use client";
import Link from "next/link";
import { useBasket } from "@/components/storefront/basket-provider";
import { money } from "@/lib/presentation/format";
import { Button } from "@/components/ui/button";
import { QuantityControl } from "@/components/storefront/quantity-control";
import { ProductImage } from "@/components/storefront/product-image";
export default function BasketPage() {
  const basket = useBasket();
  return (
    <div className="container section">
      <p className="eyebrow text-muted-foreground">
        One step closer to comfortable
      </p>
      <h1 className="display my-5 text-5xl">Your basket</h1>
      {!basket.ready ? (
        <p>Loading your basket…</p>
      ) : !basket.items.length ? (
        <div className="py-12">
          <p className="mb-6">Your next favourite seat is waiting.</p>
          <Button asChild>
            <Link href="/shop">Explore sofas</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="divide-y">
            {basket.items.map((item) => (
              <article
                key={item.variantId}
                className="grid grid-cols-[80px_1fr] gap-5 py-6 sm:grid-cols-[140px_1fr_auto]"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative aspect-square overflow-hidden bg-muted"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width:640px) 80px, 140px"
                    className="object-cover"
                  />
                </Link>
                <div>
                  <Link
                    className="font-serif text-2xl"
                    href={`/products/${item.slug}`}
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.label}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <QuantityControl
                      value={item.quantity}
                      label={item.name}
                      onAdjust={(delta) => basket.adjust(item.variantId, delta)}
                    />
                    <button
                      className="text-xs underline"
                      onClick={() => basket.remove(item.variantId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="col-start-2 text-sm tabular-nums sm:col-start-auto">
                  {money(item.price * item.quantity)}
                </p>
              </article>
            ))}
          </div>
          <aside className="h-fit bg-muted p-8">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <p className="my-6 flex justify-between text-sm">
              <span>Items subtotal</span>
              <span>
                {money(
                  basket.items.reduce(
                    (sum, i) => sum + i.price * i.quantity,
                    0,
                  ),
                )}
              </span>
            </p>
            <p className="mb-6 text-xs leading-6 text-muted-foreground">
              Confirm delivery and final availability with the team. Pay by cash
              or card on delivery.
            </p>
            <Button asChild className="h-12 w-full rounded-none">
              <Link href="/checkout">Continue to checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
