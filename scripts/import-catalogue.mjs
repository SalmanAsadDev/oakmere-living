import fs from "node:fs/promises";
import { normaliseProduct } from "../lib/domain/catalogue-core.mjs";
import { databaseClient } from "./lib/postgres.mjs";

const source = JSON.parse(
  await fs.readFile(
    new URL("../sofa-catalogue-for-codex.json", import.meta.url),
    "utf8",
  ),
);
const media = JSON.parse(
  await fs.readFile(
    new URL("../lib/data/media-manifest.json", import.meta.url),
    "utf8",
  ),
);
const client = databaseClient();
try {
  await client.connect();
  await client.query("begin");
  await client.query(
    "select pg_advisory_xact_lock(hashtext('oakmere_catalogue_import'))",
  );
  const {
    rows: [count],
  } = await client.query("select count(*)::int as total from public.products");
  if (count.total)
    throw new Error(
      "The catalogue already contains products. Import stopped to preserve administrator edits.",
    );
  const categories = new Map();
  for (const category of source.categories) {
    const {
      rows: [row],
    } = await client.query(
      "insert into public.categories(name,slug) values($1,$2) on conflict(slug) do update set name=excluded.name returning id",
      [category.name, category.slug],
    );
    categories.set(category.slug, row.id);
  }
  let ready = 0,
    variants = 0,
    images = 0;
  for (const raw of source.products) {
    const product = normaliseProduct(raw);
    const published = product.status === "ready";
    const priceType = ["base", "from", "ask"].includes(product.priceType)
      ? product.priceType
      : "base";
    await client.query(
      "insert into public.products(id,category_id,name,slug,description,base_price,price_type,is_active,category_slugs,materials,dimensions,catalogue_data) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
      [
        product.id,
        categories.get(product.category) ||
          categories.get(product.categories[0]) ||
          null,
        product.name,
        product.slug,
        product.description,
        product.price === null ? null : (product.price / 100).toFixed(2),
        priceType,
        published,
        product.categories,
        product.materials,
        product.dimensions,
        JSON.stringify({
          features: product.features,
          reviewFlags: product.reviewFlags,
          sourceStatus: product.status,
        }),
      ],
    );
    for (const variant of product.variants) {
      await client.query(
        "insert into public.variants(id,product_id,sku,name,colour,colour_hex,price_pence,stock_level,is_active) values($1,$2,$3,$4,$5,$6,$7,null,$8)",
        [
          variant.id,
          product.id,
          variant.id,
          variant.label,
          variant.colour,
          variant.hex,
          variant.price,
          published,
        ],
      );
      if (variant.image) {
        await client.query(
          "insert into public.media_assets(product_id,variant_id,url,alt_text,display_order) values($1,$2,$3,$4,0)",
          [
            product.id,
            variant.id,
            media[variant.image] || variant.image,
            `${product.name} — ${variant.label}`,
          ],
        );
        images++;
      }
      variants++;
    }
    const unique = [
      ...new Map(product.images.map((image) => [image.url, image])).values(),
    ];
    for (const [index, image] of unique.entries()) {
      await client.query(
        "insert into public.media_assets(product_id,url,alt_text,display_order) values($1,$2,$3,$4)",
        [
          product.id,
          media[image.url] || image.url,
          image.alt || product.name,
          index,
        ],
      );
      images++;
    }
    if (published) ready++;
  }
  await client.query("commit");
  console.log(
    JSON.stringify(
      {
        products: source.products.length,
        published: ready,
        drafts: source.products.length - ready,
        variants,
        images,
        stock: "unknown; confirmation required",
      },
      null,
      2,
    ),
  );
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("Import stopped:", error.code || error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
