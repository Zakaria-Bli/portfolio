import { siteConfig } from "@/lib/seo/config"

import type { MetadataRoute } from "next"

/**
 * Generate sitemap for search engines
 * This file is automatically served at /sitemap.xml
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Define your routes here
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    // Add more routes as you build your portfolio
    // Example:
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/projects`,
    //   lastModified: new Date(),
    //   changeFrequency: "weekly" as const,
    //   priority: 0.9,
    // },
  ]

  return routes
}
