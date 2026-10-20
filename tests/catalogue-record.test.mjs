import test from "node:test";
import assert from "node:assert/strict";
import { databaseProduct } from "../lib/domain/catalogue-record.mjs";

test("database edits override source content while exact basket identities and pence survive", () => {
  const record = databaseProduct({
    id: "source:product",
    slug: "updated-sofa",
    name: "Owner's updated name",
    base_price: "749.00",
    is_active: true,
    category_slugs: ["corner-sofas"],
    materials: ["Velvet"],
    variants: [
      {
        id: "source:product:grey",
        name: "Grey · Velvet",
        colour: "Grey",
        colour_hex: "#777777",
        price_pence: 74900,
      },
    ],
    media_assets: [
      { variant_id: "source:product:grey", url: "/images/grey.webp" },
      { variant_id: null, url: "/images/main.webp", display_order: 0 },
    ],
  });
  assert.equal(record.name, "Owner's updated name");
  assert.equal(record.id, "source:product");
  assert.equal(record.price, 74900);
  assert.equal(record.variants[0].id, "source:product:grey");
  assert.equal(record.variants[0].image, "/images/grey.webp");
  assert.equal(record.images[0].url, "/images/main.webp");
});
test("inactive variants are excluded and missing finish photos remain unknown", () => {
  const record = databaseProduct({
    id: "p",
    slug: "p",
    name: "Sofa",
    base_price: null,
    is_active: true,
    variants: [
      { id: "a", name: "Grey", price_pence: 100, is_active: false },
      { id: "b", name: "Black", price_pence: 200 },
      { id: "c", name: "Sold out", price_pence: 300, stock_level: 0 },
    ],
    media_assets: [{ url: "/images/grey.webp", variant_id: null }],
  });
  assert.deepEqual(
    record.variants.map((v) => v.id),
    ["b"],
  );
  assert.equal(record.variants[0].image, "");
  assert.equal(record.price, null);
});
