import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/", // private, auth-gated
        "/auth/", // login/register hold no crawlable content
        "/login",
        "/signup",
        "/docs", // internal component library
        "/sell/upload", // multi-step form behind a payment gate
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
