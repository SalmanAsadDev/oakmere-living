"use client";
import { createContext, useContext, useEffect, useState } from "react";
export type BasketItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  label: string;
  image: string;
  price: number;
  quantity: number;
};
type BasketState = {
  items: BasketItem[];
  ready: boolean;
  add: (item: Omit<BasketItem, "quantity">) => void;
  quantity: (id: string, count: number) => void;
  adjust: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const BasketContext = createContext<BasketState | null>(null);
const key = "oakmere:basket:v1";
export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(stored))
        setItems(
          stored.filter(
            (item: BasketItem) =>
              item &&
              typeof item.variantId === "string" &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0 &&
              item.quantity <= 10 &&
              Number.isInteger(item.price) &&
              typeof item.name === "string" &&
              typeof item.slug === "string" &&
              typeof item.image === "string",
          ),
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(key, JSON.stringify(items));
      } catch {}
    }
  }, [items, ready]);
  return (
    <BasketContext.Provider
      value={{
        items,
        ready,
        add: (item) =>
          setItems((old) =>
            old.some((i) => i.variantId === item.variantId)
              ? old.map((i) =>
                  i.variantId === item.variantId
                    ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
                    : i,
                )
              : [...old, { ...item, quantity: 1 }],
          ),
        quantity: (id, count) => {
          if (Number.isInteger(count) && count >= 1 && count <= 10)
            setItems((old) =>
              old.map((i) =>
                i.variantId === id ? { ...i, quantity: count } : i,
              ),
            );
        },
        adjust: (id, delta) => {
          if (!Number.isInteger(delta)) return;
          setItems((old) =>
            old.map((item) =>
              item.variantId === id
                ? {
                    ...item,
                    quantity: Math.min(10, Math.max(1, item.quantity + delta)),
                  }
                : item,
            ),
          );
        },
        remove: (id) =>
          setItems((old) => old.filter((i) => i.variantId !== id)),
        clear: () => setItems([]),
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}
export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) throw new Error("Basket provider missing");
  return context;
}
