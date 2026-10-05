import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /studio is the Sanity Studio admin UI, not public content. /api
      // holds only machine endpoints (the Sanity revalidation webhook).
      disallow: ["/studio", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
