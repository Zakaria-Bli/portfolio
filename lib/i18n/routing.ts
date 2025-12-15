/**
 * Routing Configuration for next-intl
 *
 * This file defines the routing behavior for internationalized routes:
 * - Locale prefixes in URLs
 * - Default locale handling
 * - Localized pathname mappings
 */

import { defineRouting } from "next-intl/routing"

import { defaultLocale, localesCodes } from "./config"

export const routing = defineRouting({
  // All supported locales
  locales: localesCodes,

  // Default locale (Arabic)
  defaultLocale: defaultLocale,

  // Show locale prefix in URL for all locales including default
  // e.g., /ar/about, /fr/about
  localePrefix: "always",
})
