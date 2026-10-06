import "server-only";
import source from "@/sofa-catalogue-for-codex.json";
import { normaliseProduct } from "./catalogue-core.mjs";
import manifest from "@/lib/data/media-manifest.json";

export type Variant = { id: string; label: string; colour: string; hex: string; price: number; image: string };
export type Product = {
  id: string; slug: string; name: string; category: string; categories: string[];
  price: number | null; priceType: string; description: string; dimensions: string | null;
  materials: string[]; colours: string[]; images: { url: string; alt: string }[];
  variants: Variant[]; features: string[]; status: string; reviewFlags: string[];
};
export const categories = source.categories;
const media = manifest as Record<string, string>;
export const allProducts: Product[] = source.products.map(normaliseProduct).map(product => ({ ...product,
  images: product.images.map((image: {url:string;alt:string}) => ({ ...image, url:media[image.url] || image.url })).sort((a:{url:string},b:{url:string})=>Number(b.url.startsWith("/images/"))-Number(a.url.startsWith("/images/"))),
  variants: product.variants.map((variant:Variant) => ({ ...variant, image:media[variant.image] || variant.image })),
}));
export const products = allProducts.filter(product => product.status === "ready");
export function getProduct(slug: string) { return products.find(product => product.slug === slug); }
export function getFeaturedProducts() {
  const names = ["uks-verona-high-back-4-seater-corner-2c1", "uks-salone-3and2-seater"];
  return [...products].sort((a, b) => (Number(b.images[0]?.url.startsWith("/images/"))*2+Number(names.includes(b.slug))) - (Number(a.images[0]?.url.startsWith("/images/"))*2+Number(names.includes(a.slug)))).slice(0, 8);
}
