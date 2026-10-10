"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "./product-image";
import { useBasket } from "./basket-provider";
import { money } from "@/lib/presentation/format";
import type { PlanningProduct } from "@/lib/domain/planning";

const steps = [
  "Shape",
  "Design",
  "Colour",
  "Fabric",
  "Piping",
  "Extras",
  "Your sofa",
];
export function SofaBuilder({
  products,
  categories,
}: {
  products: PlanningProduct[];
  categories: { name: string; slug: string }[];
}) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [variantId, setVariantId] = useState("");
  const [piping, setPiping] = useState(false);
  const [extras, setExtras] = useState("");
  const [added, setAdded] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const basket = useBasket();
  const product = products.find((p) => p.slug === slug);
  const variant = product?.variants.find((v) => v.id === variantId);
  const custom = piping || Boolean(extras.trim()) || !variant;
  const canContinue =
    step === 0
      ? Boolean(category)
      : step === 1
        ? Boolean(product)
        : step === 2
          ? Boolean(variant || product?.variants.length === 0)
          : true;
  const photo = variant?.image || product?.image;
  const brief = product
    ? [
        `Sofa design enquiry: ${product.name}`,
        `Configuration: ${variant?.label || "Please confirm available configurations"}`,
        `Listed materials: ${product.materials.join(", ") || "Please confirm"}`,
        `Piping: ${piping ? "Please discuss custom piping" : "As photographed"}`,
        `Additional requests: ${extras.trim() || "None"}`,
        "Please confirm availability, measurements and any quotation before ordering.",
      ].join("\n")
    : "";
  function go(next: number) {
    setStep(next);
    setAdded(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  return (
    <div>
      <ol
        aria-label="Sofa builder progress"
        className="mb-10 grid grid-cols-4 gap-2 border-y py-5 sm:grid-cols-7"
      >
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              disabled={index > step}
              aria-current={step === index ? "step" : undefined}
              className={`flex min-h-11 items-center gap-2 text-xs disabled:opacity-35 ${step === index ? "font-bold text-primary" : "text-muted-foreground"}`}
              onClick={() => go(index)}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border ${step === index ? "border-primary bg-primary text-white" : ""}`}
              >
                {index < step ? <Check size={12} /> : index + 1}
              </span>
              {label}
            </button>
          </li>
        ))}
      </ol>
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="eyebrow mb-3 text-muted-foreground">
            Step {step + 1} of 7
          </p>
          <h2
            ref={heading}
            tabIndex={-1}
            className="font-serif text-3xl focus:outline-none"
          >
            {
              [
                "Start with the shape.",
                "Find your favourite.",
                "Choose your configuration.",
                "Get a feel for the fabric.",
                "Consider the finishing touches.",
                "Make a little room for detail.",
                "Meet your next sofa.",
              ][step]
            }
          </h2>
          <div className="mt-7">
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {categories
                  .filter((c) =>
                    products.some((p) => p.categories.includes(c.slug)),
                  )
                  .map((c) => (
                    <button
                      className={`journey-card flex min-h-20 items-center justify-between border p-5 text-left font-serif text-xl ${category === c.slug ? "border-primary bg-accent" : "bg-white"}`}
                      key={c.slug}
                      aria-pressed={category === c.slug}
                      onClick={() => {
                        setCategory(c.slug);
                        setSlug("");
                        setVariantId("");
                        setPiping(false);
                        setExtras("");
                      }}
                    >
                      {c.name}
                      <ArrowRight size={16} />
                    </button>
                  ))}
              </div>
            )}
            {step === 1 && (
              <div className="grid max-h-[650px] gap-5 overflow-y-auto p-1 sm:grid-cols-2">
                {products
                  .filter((p) => p.categories.includes(category))
                  .map((p) => (
                    <button
                      key={p.slug}
                      aria-pressed={slug === p.slug}
                      className={`group border p-3 text-left ${slug === p.slug ? "border-primary bg-accent" : "bg-white"}`}
                      onClick={() => {
                        setSlug(p.slug);
                        setVariantId(
                          p.variants.length === 1 ? p.variants[0].id : "",
                        );
                        setPiping(false);
                        setExtras("");
                      }}
                    >
                      <span className="relative block aspect-[5/4] overflow-hidden bg-muted">
                        <ProductImage
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width:640px) 90vw, 30vw"
                          className="product-photo object-cover"
                        />
                      </span>
                      <span className="mt-3 block font-serif text-lg">
                        {p.name}
                      </span>
                    </button>
                  ))}
              </div>
            )}
            {step === 2 && product && (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  Select an actual listed configuration. Colour and material
                  options vary by sofa.
                </p>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    aria-pressed={variantId === v.id}
                    className={`swatch-button flex w-full items-center justify-between gap-4 border p-4 text-left text-sm ${variantId === v.id ? "border-primary bg-accent" : "bg-white"}`}
                    onClick={() => setVariantId(v.id)}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="size-5 shrink-0 rounded-full border"
                        style={{ backgroundColor: v.hex }}
                      />
                      {v.label}
                    </span>
                    <span>{money(v.price)}</span>
                  </button>
                ))}
                {!product.variants.length && (
                  <p className="border bg-muted p-5 text-sm">
                    This design needs the team to confirm its configuration and
                    price. Continue to prepare an enquiry.
                  </p>
                )}
              </div>
            )}
            {step === 3 && (
              <div className="space-y-5 text-sm leading-7">
                <p>
                  The catalogue lists{" "}
                  <strong>
                    {product?.materials.join(", ") ||
                      "materials to be confirmed"}
                  </strong>{" "}
                  for this design. Your selected configuration is{" "}
                  <strong>{variant?.label || "awaiting confirmation"}</strong>.
                </p>
                <p className="text-muted-foreground">
                  See and feel the fabric in your own light before deciding. A
                  different fabric may need a separate quotation; add that
                  request in the extras step.
                </p>
                <Button asChild variant="outline">
                  <Link href="/swatches" target="_blank" rel="noopener">
                    Explore fabric swatches ↗
                  </Link>
                </Button>
              </div>
            )}
            {step === 4 && (
              <fieldset className="space-y-3">
                <legend className="mb-4 text-sm text-muted-foreground">
                  Keep the photographed finish, or ask about a change.
                </legend>
                {[false, true].map((value) => (
                  <label
                    key={String(value)}
                    className={`flex cursor-pointer items-start gap-3 border p-5 ${piping === value ? "border-primary bg-accent" : "bg-white"}`}
                  >
                    <input
                      type="radio"
                      name="piping"
                      checked={piping === value}
                      onChange={() => setPiping(value)}
                      className="mt-1"
                    />
                    <span className="text-sm">
                      {value
                        ? "Discuss custom piping with the team"
                        : "Keep the finish as photographed"}
                      {value && (
                        <span className="mt-2 block text-xs text-muted-foreground">
                          Availability and price require a quotation.
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </fieldset>
            )}
            {step === 5 && (
              <label className="field">
                Anything else you have in mind? (optional)
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={extras}
                  onChange={(event) => setExtras(event.target.value)}
                  placeholder="For example, a different fabric, a footstool or a specific size. Please leave personal contact details out of your design brief."
                />
                <span className="text-xs text-muted-foreground">
                  Any extra request will go to the team for a quotation. We will
                  not add unconfirmed options to your basket.
                </span>
              </label>
            )}
            {step === 6 && product && (
              <div className="space-y-5">
                <dl className="grid gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Design</dt>
                    <dd className="mt-1 font-serif text-2xl">{product.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Configuration</dt>
                    <dd>{variant?.label || "To confirm with the team"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Dimensions</dt>
                    <dd>
                      {product.dimensions || "Please confirm before ordering"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Finish</dt>
                    <dd>
                      {piping ? "Custom piping requested" : "As photographed"}
                    </dd>
                  </div>
                  {extras.trim() && (
                    <div>
                      <dt className="text-muted-foreground">
                        Additional requests
                      </dt>
                      <dd className="whitespace-pre-wrap">{extras}</dd>
                    </div>
                  )}
                </dl>
                {custom ? (
                  <>
                    <p className="border bg-muted p-4 text-sm">
                      Your design needs a quotation. Send this brief to confirm
                      what is possible and the complete price.
                    </p>
                    <Button asChild className="h-12 rounded-none">
                      <Link
                        href={`/contact?message=${encodeURIComponent(brief)}`}
                      >
                        Continue to your enquiry <ArrowRight />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="font-serif text-3xl">
                      {money(variant!.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sofa price. Delivery availability and charges require
                      confirmation.
                    </p>
                    <Button
                      className="h-12 rounded-none"
                      disabled={added}
                      onClick={() => {
                        if (!variant) return;
                        basket.add({
                          productId: product.id,
                          variantId: variant.id,
                          slug: product.slug,
                          name: product.name,
                          label: variant.label,
                          image: variant.image || product.image,
                          price: variant.price,
                        });
                        setAdded(true);
                      }}
                    >
                      {added
                        ? "Added to your basket"
                        : "Add this sofa to basket"}
                      <ArrowRight />
                    </Button>
                    <p role="status">
                      {added && (
                        <Link href="/cart" className="link-underline text-sm">
                          View your basket →
                        </Link>
                      )}
                    </p>
                  </>
                )}
                <Link
                  className="block text-sm link-underline"
                  href={`/room-planner?product=${encodeURIComponent(product.slug)}`}
                >
                  Try this sofa in your room
                </Link>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-between border-t pt-6">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => go(step - 1)}
            >
              <ArrowLeft /> Back
            </Button>
            {step < 6 && (
              <Button disabled={!canContinue} onClick={() => go(step + 1)}>
                Continue <ArrowRight />
              </Button>
            )}
          </div>
        </section>
        <aside className="border bg-[#f0efe9] p-6 lg:sticky lg:top-6">
          <p className="eyebrow mb-5 text-muted-foreground">
            Your comfort, considered
          </p>
          {photo ? (
            <div className="relative aspect-square overflow-hidden">
              <ProductImage
                src={photo}
                alt={product?.name || "Selected sofa"}
                fill
                sizes="(max-width:1024px) 90vw, 320px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="grid aspect-square place-content-center border border-dashed p-8 text-center font-serif text-3xl text-muted-foreground">
              A place to call your own.
            </div>
          )}
          <h3 className="mt-5 font-serif text-2xl">
            {product?.name || "Your sofa starts here"}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {variant?.label || "Choose a shape and design to begin."}
          </p>
          {variant && (
            <p className="mt-4 text-sm">
              {custom ? "Design quotation required" : money(variant.price)}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
