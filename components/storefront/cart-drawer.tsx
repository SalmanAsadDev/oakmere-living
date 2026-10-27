"use client";
import Link from "next/link";
import { ShoppingBag, ArrowRight, X } from "lucide-react";
import { useBasket } from "./basket-provider";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { money } from "@/lib/presentation/format";
import { ProductImage } from "./product-image";
import { QuantityControl } from "./quantity-control";
export function CartDrawer() {
  const basket = useBasket();
  const count = basket.items.reduce((n, i) => n + i.quantity, 0);
  return (
    <Sheet>
      <SheetTrigger
        className="icon-action relative flex min-h-11 items-center gap-2 p-2 text-xs"
        aria-label={`Open cart, ${count} items`}
      >
        <ShoppingBag size={20} />
        <span className="hidden sm:inline">Cart</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary text-[10px] text-white">
          {count}
        </span>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="border-b px-7 py-8">
          <SheetTitle className="font-serif text-3xl font-normal">
            Your next favourite place.
          </SheetTitle>
          <SheetDescription>
            {count} {count === 1 ? "item" : "items"} in your cart
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-7">
          {basket.items.length ? (
            basket.items.map((item) => (
              <article
                key={item.variantId}
                className="flex gap-4 border-b py-6"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-muted">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <SheetClose asChild>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-serif text-lg"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                  <p className="my-2 text-xs text-muted-foreground">
                    {item.label}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <QuantityControl
                      value={item.quantity}
                      label={item.name}
                      onAdjust={(delta) => basket.adjust(item.variantId, delta)}
                    />
                    <span className="text-sm">
                      {money(item.price * item.quantity)}
                    </span>
                    <button
                      aria-label={`Remove ${item.name}`}
                      onClick={() => basket.remove(item.variantId)}
                      className="-mr-2 flex h-11 w-11 items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="py-16 text-center">
              <ShoppingBag className="mx-auto mb-5" size={32} strokeWidth={1} />
              <p className="font-serif text-2xl">Room for something lovely.</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Your cart is waiting for its first sofa.
              </p>
              <SheetClose asChild>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex gap-4 bg-primary px-6 py-3 text-sm text-white"
                >
                  Explore sofas <ArrowRight size={16} />
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
        {basket.items.length > 0 && (
          <div className="border-t bg-muted/50 p-7">
            <div className="mb-3 flex justify-between">
              <span>Subtotal</span>
              <span>
                {money(
                  basket.items.reduce((n, i) => n + i.quantity * i.price, 0),
                )}
              </span>
            </div>
            <p className="mb-6 text-xs leading-5 text-muted-foreground">
              Confirm delivery and availability with the team. Cash or card on
              delivery.
            </p>
            <SheetClose asChild>
              <Link
                href="/cart"
                className="flex items-center justify-between bg-primary p-4 text-sm text-white"
              >
                View cart <ArrowRight size={16} />
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
