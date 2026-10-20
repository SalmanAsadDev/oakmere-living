import { toPence } from "./catalogue-core.mjs";
const strings = (value) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

export function databaseProduct(row) {
  if (
    !row ||
    typeof row.id !== "string" ||
    typeof row.name !== "string" ||
    typeof row.slug !== "string"
  )
    throw new Error("Invalid published catalogue record");
  const assets = Array.isArray(row.media_assets) ? row.media_assets : [];
  const general = assets.filter((asset) => !asset.variant_id);
  const images = (general.length ? general : assets)
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .filter((asset) => typeof asset.url === "string" && asset.url.length)
    .map((asset) => ({ url: asset.url, alt: asset.alt_text || row.name }));
  const variants = (Array.isArray(row.variants) ? row.variants : [])
    .filter(
      (variant) =>
        variant.is_active !== false &&
        variant.stock_level !== 0 &&
        Number.isSafeInteger(variant.price_pence) &&
        variant.price_pence > 0,
    )
    .map((variant) => ({
      id: variant.id,
      label: variant.name,
      colour: variant.colour || "",
      hex: /^#[0-9a-f]{6}$/i.test(variant.colour_hex || "")
        ? variant.colour_hex
        : "#a6a299",
      price: variant.price_pence,
      image: assets.find((asset) => asset.variant_id === variant.id)?.url || "",
    }));
  const categories = strings(row.category_slugs);
  const main = row.categories?.slug || categories[0] || "";
  if (main && !categories.includes(main)) categories.unshift(main);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: main,
    categories,
    price: row.base_price === null ? null : toPence(Number(row.base_price)),
    priceType: row.price_type || "base",
    description: row.description || "",
    dimensions: row.dimensions || null,
    materials: strings(row.materials),
    colours: [
      ...new Set(variants.map((variant) => variant.colour).filter(Boolean)),
    ],
    images: [...new Map(images.map((image) => [image.url, image])).values()],
    variants,
    features: strings(row.catalogue_data?.features),
    status: row.is_active ? "ready" : "draft",
    reviewFlags: strings(row.catalogue_data?.reviewFlags),
  };
}
