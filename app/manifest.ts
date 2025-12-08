import { siteConfig } from "@/lib/seo/config"

import type { MetadataRoute } from "next"

/**
 * Generate Web App Manifest for PWA support
 * This file is automatically served at /manifest.webmanifest
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */
/* eslint-disable camelcase */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
