/**
 * Request Configuration for next-intl
 *
 * This file provides request-scoped configuration for Server Components:
 * - Loads locale-specific messages
 * - Handles locale detection
 * - Provides fallback locale
 */

import { getRequestConfig } from "next-intl/server"

import { Locale } from "./config"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the requested locale from the URL (e.g., /ar/*, /fr/*, /en/*)
  const requestedLocale = await requestLocale

  // Ensure a valid locale is used
  const locale =
    requestedLocale && routing.locales.includes(requestedLocale as Locale)
      ? requestedLocale
      : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
