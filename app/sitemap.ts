import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/domain/catalogue";
import { articles } from "@/lib/data/journal";
import { site } from "@/lib/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.origin, priority: 1.0 },
    { url: `${site.origin}/shop`, priority: 0.9 },
    { url: `${site.origin}/about`, priority: 0.7 },
    { url: `${site.origin}/contact`, priority: 0.7 },
    { url: `${site.origin}/swatches`, priority: 0.7 },
    { url: `${site.origin}/build`, priority: 0.7 },
    { url: `${site.origin}/room-planner`, priority: 0.6 },
    { url: `${site.origin}/reviews`, priority: 0.6 },
    { url: `${site.origin}/delivery`, priority: 0.6 },
    { url: `${site.origin}/faqs`, priority: 0.6 },
    { url: `${site.origin}/guides`, priority: 0.6 },
    { url: `${site.origin}/guides/corner-orientation`, priority: 0.5 },
    { url: `${site.origin}/guides/measuring-for-delivery`, priority: 0.5 },
    { url: `${site.origin}/guides/materials-guide`, priority: 0.5 },
    { url: `${site.origin}/blog`, priority: 0.6 },
    { url: `${site.origin}/appointment`, priority: 0.5 },
  ].map((r) => ({
    ...r,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
  }));

  const blogRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${site.origin}/blog/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.origin}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogRoutes, ...productRoutes];
}
