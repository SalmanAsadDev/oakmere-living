"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PlanningProduct } from "@/lib/domain/planning";

export default function SwatchRequest({
  products,
}: {
  products: PlanningProduct[];
}) {
  const [slug, setSlug] = useState(products[0]?.slug || "");
  const [selected, setSelected] = useState<string[]>([]);
  const product = products.find((p) => p.slug === slug);
  const options = products.flatMap((p) =>
    p.variants.map((v) => ({
      id: v.id,
      label: `${p.name}: ${v.label}`,
      hex: v.hex,
    })),
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.notes = [
      "Requested catalogue samples:",
      ...selected.map((id) => options.find((o) => o.id === id)?.label || ""),
      "Additional notes:",
      String(data.notes || ""),
    ].join("\n");

    try {
      const response = await fetch("/api/swatches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit request");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  return (
    <div className="container section max-w-6xl">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="eyebrow mb-5 text-muted-foreground">
            A colour you love. A texture that feels right.
          </p>
          <h1 className="display text-5xl mb-6">Find your favourite finish.</h1>
          <p className="text-muted-foreground mb-6">
            We understand that choosing a sofa is a tactile experience. Request
            up to <strong>four fabric swatches</strong> to compare colour in
            your room's lighting and feel the quality of our materials before
            you buy.
          </p>

          <div className="bg-muted/30 p-6 rounded-lg border border-border mb-8">
            <h2 className="font-serif text-lg text-primary mb-2">
              How it works
            </h2>
            <ol className="list-decimal pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Select up to four fabrics you'd like to see.</li>
              <li>Fill in your delivery details in the form.</li>
              <li>
                The team will confirm sample availability and delivery
                arrangements.
              </li>
              <li>
                Use them to check against your decor, lighting, and carpets.
              </li>
            </ol>
          </div>

          <label className="field">
            Choose a sofa
            <select
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {product?.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={
                  status === "loading" ||
                  (selected.length >= 4 && !selected.includes(v.id))
                }
                aria-pressed={selected.includes(v.id)}
                className={`swatch-button flex min-h-20 items-center gap-4 border p-4 text-left text-sm disabled:opacity-40 ${selected.includes(v.id) ? "border-primary bg-accent" : "bg-white"}`}
                onClick={() =>
                  setSelected((old) =>
                    old.includes(v.id)
                      ? old.filter((id) => id !== v.id)
                      : old.length < 4
                        ? [...old, v.id]
                        : old,
                  )
                }
              >
                <span
                  className="size-10 shrink-0 rounded-full border"
                  style={{ backgroundColor: v.hex }}
                />
                <span>{v.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Colour dots are screen approximations. The team will confirm the
            fabric for your selected sofa.
          </p>
          <div className="mt-6 border-t pt-5">
            <p role="status" className="text-sm">
              {selected.length} of 4 samples selected
            </p>
            <ul className="mt-3 space-y-3">
              {selected.map((id) => (
                <li
                  key={id}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <span>{options.find((o) => o.id === id)?.label}</span>
                  <button
                    type="button"
                    disabled={status === "loading"}
                    aria-label={`Remove ${options.find((o) => o.id === id)?.label}`}
                    className="min-h-11 link-underline"
                    onClick={() =>
                      setSelected((old) => old.filter((v) => v !== id))
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-muted/10 p-6 sm:p-8 rounded-lg border border-border">
          {status === "success" ? (
            <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
              <p className="font-medium">Request submitted successfully!</p>
              <p className="text-sm mt-1">
                Your request has been saved. The team will confirm availability
                and arrangements.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setStatus("idle");
                  setSelected([]);
                }}
              >
                Request more
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                  {errorMessage}
                </div>
              )}
              <fieldset disabled={status === "loading"} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="For dispatch updates"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Postal Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    required
                    placeholder="Include house name/number, street, town, and postcode"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional notes (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Anything the team should know about your choices?"
                    maxLength={1000}
                    rows={2}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={status === "loading" || !selected.length}
                >
                  {status === "loading" ? "Submitting..." : "Request Swatches"}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Your details will only be used to send your swatches. See our{" "}
                  <a href="/privacy" className="underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
