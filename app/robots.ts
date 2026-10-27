import type { MetadataRoute } from "next";
import { site } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/checkout/", "/api/", "/try-in-your-room/"],
      },
    ],
    sitemap: `${site.origin}/sitemap.xml`,
  };
}
