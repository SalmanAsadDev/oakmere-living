"use client";

import { startTransition, useActionState, useState } from "react";
import { saveProduct } from "@/app/admin/(dashboard)/products/actions";
import { PhotoUpload } from "./photo-upload";

type Variant = {
  id: string;
  name: string;
  colour: string;
  colour_hex: string;
  price_pence: number;
  stock_level: number | null;
  is_active: boolean;
  image: string;
};
export type EditableProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  dimensions: string | null;
  materials: string[];
  price_type: string;
  is_active: boolean;
  images: string[];
  variants: Variant[];
};
const input =
  "mt-1 w-full rounded border border-stone-300 bg-white p-2 text-sm";
const fresh = (id: string): Variant => ({
  id,
  name: "",
  colour: "",
  colour_hex: "#a6a299",
  price_pence: 0,
  stock_level: null,
  is_active: true,
  image: "",
});

export function ProductEditor({
  categories,
  product,
}: {
  categories: { id: string; name: string }[];
  product?: EditableProduct;
}) {
  const [state, action, pending] = useActionState(saveProduct, { error: "" });
  const [variants, setVariants] = useState(
    () => product?.variants ?? [fresh("new-0")],
  );
  const [images, setImages] = useState(() => product?.images.join("\n") ?? "");
  return (
    <form
      action={action}
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        // Submit outside React's automatic form reset so validation errors preserve edits.
        startTransition(() => action(form));
      }}
      className="space-y-8 rounded border border-stone-200 bg-white p-6"
    >
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          Product name
          <input
            name="name"
            required
            maxLength={180}
            defaultValue={product?.name}
            className={input}
          />
        </label>
        <label>
          Product URL slug
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={180}
            readOnly={Boolean(product)}
            defaultValue={product?.slug}
            className={input}
          />
          <span className="text-xs text-stone-500">
            Existing URLs stay fixed to protect search links.
          </span>
        </label>
        <label>
          Primary category
          <select
            name="categoryId"
            required
            defaultValue={product?.category_id ?? ""}
            className={input}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price display
          <select
            name="priceType"
            defaultValue={product?.price_type ?? "base"}
            className={input}
          >
            <option value="base">Fixed price</option>
            <option value="from">From price</option>
            <option value="ask">Enquiry only</option>
          </select>
        </label>
        <label className="sm:col-span-2">
          Description
          <textarea
            name="description"
            rows={5}
            maxLength={20000}
            defaultValue={product?.description}
            className={input}
          />
        </label>
        <label>
          Dimensions
          <input
            name="dimensions"
            maxLength={500}
            defaultValue={product?.dimensions ?? ""}
            className={input}
          />
          <span className="text-xs text-stone-500">
            Include units. Leave unknown measurements blank.
          </span>
        </label>
        <label>
          Materials (comma separated)
          <input
            name="materials"
            defaultValue={product?.materials.join(", ")}
            className={input}
          />
        </label>
        <div className="space-y-4 sm:col-span-2">
          <PhotoUpload
            onUploaded={(url) =>
              setImages((current) =>
                [current.trim(), url].filter(Boolean).join("\n"),
              )
            }
          />
          <label className="block">
            Photograph URLs — one per line
            <textarea
              name="images"
              rows={4}
              value={images}
              onChange={(event) => setImages(event.target.value)}
              className={input}
            />
            <span className="text-xs text-stone-500">
              Use uploaded photographs, existing /images/ paths or approved
              catalogue URLs. First photograph is the cover. Copy its URL into a
              configuration image field when appropriate.
            </span>
          </label>
        </div>
      </div>
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Priced configurations</legend>
        <p className="text-sm text-stone-600">
          Add only available, verified configurations. The lowest active price
          determines the product price. Blank stock means unknown; zero means
          sold out. Removing a configuration disables it and preserves existing
          order history.
        </p>
        {variants.map((variant, index) => (
          <fieldset
            key={variant.id}
            className="grid gap-4 rounded border border-stone-200 p-4 sm:grid-cols-2"
          >
            <legend className="px-2 text-sm font-medium">
              Configuration {index + 1}
            </legend>
            <input type="hidden" name="variantKey" value={variant.id} />
            <label>
              Name
              <input
                name={`${variant.id}:name`}
                required
                maxLength={180}
                defaultValue={variant.name}
                className={input}
              />
            </label>
            <label>
              Price (£)
              <input
                name={`${variant.id}:price`}
                required
                inputMode="decimal"
                pattern="[0-9]+(\.[0-9]{1,2})?"
                defaultValue={
                  variant.price_pence
                    ? (variant.price_pence / 100).toFixed(2)
                    : ""
                }
                className={input}
              />
            </label>
            <label>
              Colour name
              <input
                name={`${variant.id}:colour`}
                maxLength={100}
                defaultValue={variant.colour}
                className={input}
              />
            </label>
            <label>
              Colour swatch
              <input
                type="color"
                name={`${variant.id}:hex`}
                defaultValue={variant.colour_hex || "#a6a299"}
                className="mt-1 block h-10 w-16"
              />
            </label>
            <label>
              Stock quantity
              <input
                name={`${variant.id}:stock`}
                type="number"
                min={0}
                max={9999999}
                step={1}
                defaultValue={variant.stock_level ?? ""}
                className={input}
              />
            </label>
            <label>
              Exact configuration image
              <input
                name={`${variant.id}:image`}
                defaultValue={variant.image}
                className={input}
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name={`${variant.id}:active`}
                defaultChecked={variant.is_active}
              />
              Available configuration
            </label>
            <button
              type="button"
              onClick={() =>
                setVariants((items) => items.filter((v) => v.id !== variant.id))
              }
              className="justify-self-start text-sm text-red-700 underline"
            >
              Remove configuration {index + 1}
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          disabled={variants.length >= 30}
          onClick={() =>
            setVariants((items) => [
              ...items,
              fresh(`new-${crypto.randomUUID()}`),
            ])
          }
          className="rounded border border-stone-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          Add configuration
        </button>
      </fieldset>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={product?.is_active ?? false}
        />
        Publish in shop
      </label>
      <p role="alert" className="text-sm text-red-700">
        {state.error}
      </p>
      <button
        disabled={pending}
        className="rounded bg-stone-900 px-6 py-3 text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
