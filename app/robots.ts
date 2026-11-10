import type { MetadataRoute } from "next";
import { searchIndexingEnabled, site } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!searchIndexingEnabled) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${site.origin}/sitemap.xml`,
    host: site.origin,
  };
}
