/**
 * Internationalization Configuration
 *
 * This file defines the core i18n settings including:
 * - Supported locales
 * - Default locale
 * - Locale metadata (names, directions)
 * - RTL/LTR detection utilities
 */

export type Locale = "ar" | "fr" | "en"

export interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  direction: "ltr" | "rtl"
  flag: string
}

/**
 * List of all supported locales with metadata
 */
export const locales: LocaleConfig[] = [
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    flag: "🇩🇿",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    flag: "🇫🇷",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    flag: "🇬🇧",
  },
]

/**
 * List of supported locale codes
 */
export const localesCodes: Locale[] = locales.map((l) => l.code)

/**
 * Default locale for the application
 */
export const defaultLocale: Locale = "en"
