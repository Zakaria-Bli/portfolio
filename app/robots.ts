import { siteConfig } from "@/lib/seo/config"

import type { MetadataRoute } from "next"

/**
 * Generate robots.txt for search engine crawlers
 * This file is automatically served at /robots.txt
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
