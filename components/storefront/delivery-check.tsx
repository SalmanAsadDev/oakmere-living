"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { estimateDelivery } from "@/lib/domain/delivery.mjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DeliveryCheck() {
  const id = useId();
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState<ReturnType<
    typeof estimateDelivery
  > | null>(null);
  return (
    <section
      className="border bg-background p-5"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className="font-serif text-xl">
        A little closer to home.
      </h2>
      <p
        id={`${id}-help`}
        className="mt-2 text-xs leading-5 text-muted-foreground"
      >
        Check an indicative delivery estimate. Your postcode stays on this page.
      </p>
      <form
        className="mt-4 flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(estimateDelivery(postcode));
        }}
      >
        <label className="sr-only" htmlFor={id}>
          Delivery postcode
        </label>
        <Input
          id={id}
          value={postcode}
          maxLength={12}
          autoComplete="postal-code"
          spellCheck={false}
          placeholder="UK postcode"
          aria-describedby={`${id}-help`}
          className="h-11 min-w-32 flex-1 uppercase"
          onChange={(event) => {
            setPostcode(event.target.value);
            setResult(null);
          }}
        />
        <Button type="submit" variant="outline" className="h-11">
          Check delivery
        </Button>
      </form>
      {result && (
        <div
          className="mt-4 text-xs leading-6"
          role={result.status === "invalid" ? "alert" : "status"}
        >
          {result.postcode && (
            <p className="mb-1 font-medium">{result.postcode}</p>
          )}
          <p>{result.message}</p>
          {result.status === "review" && (
            <Link
              href={`/contact?message=${encodeURIComponent(`Please confirm delivery coverage, cost and timing for ${result.postcode}.`)}`}
              className="mt-2 inline-block link-underline"
            >
              Ask about delivery →
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
