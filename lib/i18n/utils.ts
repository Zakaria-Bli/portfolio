/**
 * I18n Utility Functions
 *
 * Helper functions for working with internationalization:
 * - Direction detection (RTL/LTR)
 * - Locale validation
 * - Font class helpers
 */

import { Locale, LocaleConfig, locales, localesCodes } from "./config"

/**
 * Check if a locale is RTL (Right-to-Left)
 */
export function isRTL(locale: Locale): boolean {
  const localeConfig = locales.find((l) => l.code === locale)
  return localeConfig?.direction === "rtl"
}

/**
 * Get text direction for a locale
 */
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr"
}

/**
 * Get locale configuration by code
 */
export function getLocaleConfig(locale: Locale): LocaleConfig | undefined {
  return locales.find((l) => l.code === locale)
}

/**
 * Validate if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return localesCodes.includes(locale as Locale)
}

/**
 * Get CSS class name for font based on locale direction
 */
export function getFontClassName(locale: Locale): string {
  return isRTL(locale) ? "font-arabic" : "font-latin"
}

/**
 * Get locale display name in native language
 */
export function getLocaleDisplayName(locale: Locale): string {
  const config = getLocaleConfig(locale)
  return config?.nativeName || locale
}

/**
 * Get opposite direction for a locale (useful for overrides)
 */
export function getOppositeDirection(
  locale: Locale
): "ltr" | "rtl" | undefined {
  const direction = getDirection(locale)
  return direction === "rtl" ? "ltr" : "rtl"
}
