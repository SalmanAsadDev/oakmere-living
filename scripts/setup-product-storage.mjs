import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase server configuration is required");
const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: buckets, error } = await client.storage.listBuckets();
if (error) throw new Error(`Could not inspect product storage: ${error.name}`);
const existing = buckets.find((bucket) => bucket.id === "product-media");
if (
  existing &&
  (!existing.public ||
    Number(existing.file_size_limit) !== 900000 ||
    !existing.allowed_mime_types?.includes("image/webp"))
)
  throw new Error(
    "Existing product-media bucket needs review. Its access settings were not changed.",
  );
if (!existing) {
  const result = await client.storage.createBucket("product-media", {
    public: true,
    fileSizeLimit: 900000,
    allowedMimeTypes: ["image/webp"],
  });
  if (result.error)
    throw new Error(`Could not create product storage: ${result.error.name}`);
}
console.log(
  "Product photograph bucket ready: public read; uploads use a verified admin server action; WebP only, max 900 KB.",
);
