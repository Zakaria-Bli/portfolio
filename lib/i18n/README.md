# Internationalization (i18n)

This application implements a comprehensive multi-language system using `next-intl` integrated with Next.js 16. This guide covers how the system works, how to use translations, and how to extend it.

---

## Table of Contents

1. [Overview](#overview)
2. [Implementation](#implementation)
3. [Using Translations](#using-translations)
4. [Adding New Translations](#adding-new-translations)
5. [Working with RTL/LTR](#working-with-rtlltr)
6. [SEO Integration](#seo-integration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The i18n system provides:

- ✅ **3 Languages** - English (default), Arabic (RTL), French
- ✅ **Clean URLs** - Locale-based routing like `/en/*`, `/ar/*`, `/fr/*`
- ✅ **Type-safe** - TypeScript integration for translation keys
- ✅ **RTL/LTR Support** - Automatic text direction and font handling
- ✅ **SEO Optimized** - Locale-aware metadata and hreflang tags
- ✅ **Server & Client** - Works in both Server and Client Components
- ✅ **Built with next-intl** - First-class Next.js 16 App Router support

---

## Supported Locales

The application supports three locales:

| Locale | Language          | Direction | Default |
| ------ | ----------------- | --------- | ------- |
| `en`   | English           | LTR       | ✅ Yes  |
| `ar`   | Arabic (العربية)  | RTL       | No      |
| `fr`   | French (Français) | LTR       | No      |

**English** is the default locale since it has the widest reach. All routes automatically include the locale prefix in the URL.

---

## Implementation

### Structure

The i18n implementation follows Feature-Sliced Design principles, centralizing all internationalization concerns in a dedicated library:

```
portfolio-next/
├── app/
│   ├── [locale]/              # Dynamic locale segment
│   │   ├── layout.tsx        # Root layout with i18n provider
│   │   ├── globals.css       # Styles with RTL/LTR overrides
│   │   └── (root)/           # Public pages
│   ├── manifest.ts           # PWA manifest
│   ├── robots.ts             # Robots.txt
│   └── sitemap.ts            # Sitemap
│
├── components/
│   └── shared/
│       └── LocaleSwitcher.tsx # Language switcher component
│
├── lib/
│   └── i18n/                 # i18n library (all-in-one)
│       ├── config.ts         # Locale definitions
│       ├── routing.ts        # Routing configuration
│       ├── request.ts        # Server-side config
│       ├── navigation.ts     # Type-safe navigation wrappers
│       ├── utils.ts          # Helper functions
│       ├── index.ts          # Public API
│       └── messages/         # Translation files
│           ├── ar.json
│           ├── en.json
│           └── fr.json
│
└── proxy.ts                  # Routing proxy configuration
```

### Integration Steps

#### 1. Locale Configuration

[lib/i18n/config.ts](../../lib/i18n/config.ts) defines all supported locales with metadata:

```typescript
export type Locale = "ar" | "fr" | "en"

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

export const defaultLocale: Locale = "en"
```

This provides a single source of truth for locale information including native names for the UI and the critical `direction` field for RTL support.

#### 2. Utility Functions

Helper functions in [lib/i18n/utils.ts](../../lib/i18n/utils.ts) work with locales throughout the app:

- `isRTL(locale)` - Check if locale is right-to-left
- `getDirection(locale)` - Get "ltr" or "rtl" for CSS `dir` attribute
- `getLocaleConfig(locale)` - Get full locale metadata
- `isValidLocale(locale)` - Type-safe validation
- `getFontClassName(locale)` - Get appropriate font class based on direction

#### 3. next-intl Integration

`next-intl` is configured in [lib/i18n/routing.ts](../../lib/i18n/routing.ts) to handle URL-based routing:

```typescript
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: localesCodes, // ["ar", "fr", "en"]
  defaultLocale: defaultLocale, // "en"
  localePrefix: "always", // Always show locale in URL
})
```

This configuration ensures every URL includes the locale prefix (e.g., `/en/about`, `/ar/about`) for clarity and SEO.

#### 4. Type-Safe Navigation

Navigation wrappers in [lib/i18n/navigation.ts](../../lib/i18n/navigation.ts) automatically handle locale prefixes:

```typescript
import { createNavigation } from "next-intl/navigation"

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
```

**Usage:** Import from `@/lib/i18n/navigation` instead of Next.js:

```typescript
import { Link, useRouter } from "@/lib/i18n/navigation"
```

These automatically:

- Add locale prefixes to all URLs
- Maintain locale context during navigation
- Provide type-safe route handling

#### 5. Server-Side Message Loading

[lib/i18n/request.ts](../../lib/i18n/request.ts) loads translations based on the detected locale:

```typescript
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale

  // Fallback to default if invalid
  const locale =
    requestedLocale && routing.locales.includes(requestedLocale as Locale)
      ? requestedLocale
      : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

This ensures messages are only loaded when needed (dynamic imports) and falls back to English for invalid locales.

#### 6. Routing Proxy

[proxy.ts](../../proxy.ts) integrates next-intl's routing with Next.js 16:

```typescript
import createMiddleware from "next-intl/middleware"
import { routing } from "./lib/i18n/routing"

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  return handleI18nRouting(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|icons|.*\\..*).*)"],
}
```

This handles locale detection, validation, and request rewriting automatically.

### Routing Behavior

The routing configuration in [lib/i18n/routing.ts](../../lib/i18n/routing.ts) ensures:

- Every URL includes the locale prefix (e.g., `/en/about`, `/ar/about`)
- Invalid locales automatically redirect to the default (English)
- Clean, SEO-friendly URLs for all languages

### Message Loading

Translations are loaded automatically based on the current locale. The system in [lib/i18n/request.ts](../../lib/i18n/request.ts):

- Detects the locale from the URL
- Loads the corresponding translation file from `messages/`
- Falls back to English if the locale is invalid
- Uses dynamic imports for optimal performance

### Navigation Utilities

Use the type-safe navigation utilities from [lib/i18n/navigation.ts](../../lib/i18n/navigation.ts) instead of Next.js defaults:

```typescript
import { createNavigation } from "next-intl/navigation"

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
```

This is crucial - using these instead of Next.js defaults prevents broken links and maintains locale context.

### 5. Proxy Configuration ([proxy.ts](../../proxy.ts))

In Next.js 16, middleware is now called `proxy`. I configured it to handle internationalized routing:

```typescript
import createMiddleware from "next-intl/middleware"

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  // Handles locale detection, redirects, and route rewriting
  return handleI18nRouting(request)
}

// Exclude static files and API routes
export const config = {
  matcher: ["/((?!api|_next|_vercel|images|icons|.*\\..*).*)"],
}
```

The proxy automatically:

- Detects the user's locale from their URL
- Validates the locale is supported
- Rewrites the request to the correct locale folder

---

## Using Translations

### In Server Components

Most pages are Server Components. Access translations with the `useTranslations` hook:

```typescript
import { useTranslations } from "next-intl"

export default function HomePage() {
  const t = useTranslations("HomePage")

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  )
}
```

The `useTranslations` hook works seamlessly in Server Components - no client-side JavaScript needed!

### In Client Components

For interactive components, mark them with `"use client"`:

```typescript
"use client"

import { useTranslations } from "next-intl"

export default function InteractiveButton() {
  const t = useTranslations("common")

  return <button onClick={() => alert("Clicked!")}>{t("submit")}</button>
}
```

### Type-Safe Navigation

Always use the i18n-aware navigation utilities instead of Next.js defaults:

```typescript
import { Link, useRouter, usePathname } from "@/lib/i18n/navigation"

// Link component - automatically adds locale prefix
;<Link href="/about">About Me</Link> // Becomes /en/about

// Programmatic navigation
const router = useRouter()
router.push("/projects") // Becomes /en/projects

// Get current pathname (without locale prefix)
const pathname = usePathname() // Returns "/about" even if URL is "/en/about"
```

### Getting Current Locale

```typescript
import { useLocale } from "next-intl"

export default function Component() {
  const locale = useLocale() // "ar" | "fr" | "en"

  return <div>Current locale: {locale}</div>
}
```

### Formatting Dates and Numbers

Leverage next-intl's formatting utilities for locale-aware output:

```typescript
import { useFormatter } from "next-intl"

export default function Component() {
  const format = useFormatter()
  const now = new Date()

  return (
    <div>
      {/* Date: adjusts format based on locale */}
      <p>{format.dateTime(now, { dateStyle: "full" })}</p>

      {/* Number: handles RTL numbers for Arabic */}
      <p>{format.number(12345.67, { style: "currency", currency: "USD" })}</p>
    </div>
  )
}
```

### Rich Text Formatting

For translations with HTML elements, use the `t.rich()` method:

```typescript
const t = useTranslations("HomePage")

{
  t.rich("description", {
    templates: (chunks) => (
      <a href="https://example.com" className="font-medium">
        {chunks}
      </a>
    ),
    learning: (chunks) => (
      <a href="https://learn.example.com" className="font-medium">
        {chunks}
      </a>
    ),
  })
}
```

In the JSON file:

```json
{
  "description": "Visit <templates>Templates</templates> or <learning>Learning Center</learning>."
}
```

---

## Adding New Translations

### Update All Locale Files

Add new translation keys to all locale files to avoid missing translations:

**[lib/i18n/messages/en.json](../../lib/i18n/messages/en.json):**

```json
{
  "projects": {
    "title": "Projects",
    "addToCart": "Add to Cart",
    "price": "Price"
  }
}
```

**[lib/i18n/messages/ar.json](../../lib/i18n/messages/ar.json):**

```json
{
  "projects": {
    "title": "المشاريع",
    "addToCart": "أضف إلى السلة",
    "price": "السعر"
  }
}
```

**[lib/i18n/messages/fr.json](../../lib/i18n/messages/fr.json):**

```json
{
  "projects": {
    "title": "Projets",
    "addToCart": "Ajouter au panier",
    "price": "Prix"
  }
}
```

### Use in Components

```typescript
import { useTranslations } from "next-intl"

export default function ProjectCard() {
  const t = useTranslations("projects")

  return (
    <div>
      <h2>{t("title")}</h2>
      <button>{t("addToCart")}</button>
    </div>
  )
}
```

### Organize with Nested Keys

Use hierarchical structure for better maintainability:

```json
{
  "dashboard": {
    "user": {
      "profile": {
        "title": "Profile",
        "edit": "Edit"
      }
    }
  }
}
```

Usage:

```typescript
const t = useTranslations("dashboard.user.profile")
t("title") // "Profile"
```

### Dynamic Values with Interpolation

Use placeholders for dynamic content:

```json
{
  "greeting": "Hello {name}",
  "itemCount": "You have {count} items"
}
```

```typescript
t("greeting", { name: "Zak" }) // "Hello Zak"
t("itemCount", { count: 5 }) // "You have 5 items"
```

---

## Working with RTL/LTR

### Automatic Direction Handling

The `<html>` tag automatically receives the correct `dir` attribute:

```tsx
// app/[locale]/layout.tsx
export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  const dir = getDirection(locale as Locale)

  return (
    <html lang={locale} dir={dir}>
      {/* ... */}
    </html>
  )
}
```

Results:

- English: `<html lang="en" dir="ltr">`
- Arabic: `<html lang="ar" dir="rtl">`
- French: `<html lang="fr" dir="ltr">`

### CSS Direction Overrides

CSS overrides in [globals.css](../../app/[locale]/globals.css) handle RTL layouts:

```css
/* RTL-specific overrides */
[dir="rtl"] .text-left {
  text-align: right;
}

[dir="rtl"] .text-right {
  text-align: left;
}

[dir="rtl"] .ml-auto {
  margin-right: auto;
  margin-left: 0;
}

/* Prefer CSS logical properties */
[dir="rtl"] .ms-4 {
  margin-inline-start: 1rem;
}
```

### Font Configuration

Different fonts are loaded based on text direction:

```tsx
// app/[locale]/layout.tsx
const primaryFont = Space_Grotesk({
  variable: "--font-primary",
  subsets: ["latin"],
})

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})
```

Apply conditionally in CSS:

```css
[dir="rtl"] body {
  font-family: var(--font-arabic), sans-serif;
}

[dir="ltr"] body {
  font-family: var(--font-primary), sans-serif;
}
```

### Using Directional Utilities

Use helper functions to adapt UI dynamically:

```typescript
import { getDirection, isRTL } from "@/lib/i18n"

export default function Component({ locale }: { locale: Locale }) {
  const dir = getDirection(locale)
  const isRightToLeft = isRTL(locale)

  return (
    <div dir={dir}>
      <Icon className={isRightToLeft ? "rotate-180" : ""} />
    </div>
  )
}
```

---

## SEO Integration

### Locale-Aware Metadata

The i18n system integrates with SEO metadata generation:

```tsx
// app/[locale]/layout.tsx
import { getMetadata } from "@/lib/seo/config"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return getMetadata(locale as Locale)
}
```

The [lib/seo/config.ts](../../lib/seo/config.ts) file uses `getTranslations` to load locale-specific metadata:

```typescript
export async function getMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      locale: locale,
      url: `${siteConfig.url}/${locale}`,
      title: t("title"),
      description: t("description"),
    },
    // ...
  }
}
```

### Hreflang Tags

Next.js automatically generates hreflang tags based on the `alternates` configuration:

```typescript
alternates: {
  canonical: `${siteConfig.url}/${locale}`,
  languages: {
    "en": `${siteConfig.url}/en`,
    "ar": `${siteConfig.url}/ar`,
    "fr": `${siteConfig.url}/fr`,
  },
}
```

This tells search engines about all language versions of each page.

### Structured Data

Locale information is included in JSON-LD structured data:

```tsx
// app/[locale]/layout.tsx
<head>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={renderJsonLd(websiteSchema(locale as Locale))}
  />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={renderJsonLd(
      personSchema(undefined, locale as Locale)
    )}
  />
</head>
```

The [lib/seo/schema.ts](../../lib/seo/schema.ts) functions accept a locale parameter to set the `inLanguage` property:

```typescript
export function websiteSchema(locale: Locale = "en"): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: locale, // Critical for SEO
    // ...
  }
}
```

### Sitemap Generation

For a multi-locale sitemap, update [app/sitemap.ts](../../app/sitemap.ts):

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/projects"]
  const locales = ["en", "ar", "fr"]

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
    }))
  )
}
```

---

## Best Practices

### 1. Always Use Translation Keys

Never hardcode text:

❌ **Avoid:**

```typescript
<h1>Welcome to our store</h1>
```

✅ **Prefer:**

```typescript
<h1>{t("welcome")}</h1>
```

### 2. Organize Translations Logically

Group related translations under namespaces:

```json
{
  "common": {
    /* shared strings */
  },
  "auth": {
    /* authentication */
  },
  "projects": {
    /* project-related */
  },
  "HomePage": {
    /* home page specific */
  }
}
```

### 3. Always Use i18n Navigation

Always use i18n-aware navigation utilities:

❌ **Avoid:**

```typescript
import Link from "next/link"
;<Link href="/about">About</Link> // Breaks locale routing!
```

✅ **Prefer:**

```typescript
import { Link } from "@/lib/i18n/navigation"
;<Link href="/about">About</Link> // Becomes /en/about automatically
```

### 4. Provide Fallback Values

For optional translations, provide defaults:

```typescript
t("optional.key", { defaultValue: "Fallback text" })
```

### 5. Test All Locales

Test your UI in all three locales to ensure:

- Translations exist and make sense
- RTL layout works correctly
- Fonts load properly
- No layout breaks with longer/shorter text

### 6. Use CSS Logical Properties

Prefer CSS logical properties for better RTL support:

❌ **Avoid:**

```css
margin-left: 1rem;
padding-right: 2rem;
```

✅ **Prefer:**

```css
margin-inline-start: 1rem;
padding-inline-end: 2rem;
```

---

## Troubleshooting

### Issue: "Locale not found" Error

**Solution:** Ensure the locale exists in [lib/i18n/config.ts](../../lib/i18n/config.ts) and is included in the routing configuration.

### Issue: Translations Not Loading

**Check:**

1. Message files exist in `lib/i18n/messages/` folder
2. JSON is valid (no syntax errors)
3. File names match locale codes exactly (`ar.json`, `en.json`, `fr.json`)
4. Translation keys match exactly (they're case-sensitive)
5. The namespace is correct (`useTranslations("HomePage")` needs a `HomePage` key in JSON)

### Issue: Wrong Text Direction

**Check:**

1. `getDirection()` is called in [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
2. `dir` attribute is set on `<html>` tag
3. CSS overrides in [globals.css](../../app/[locale]/globals.css) are loaded
4. Locale configuration has correct `direction` value

### Issue: Links Not Working with Locale

**Solution:** Use `Link` from `@/lib/i18n/navigation`, not `next/link`:

```typescript
import { Link } from "@/lib/i18n/navigation"
```

### Issue: Middleware/Proxy Not Running

**Check:**

1. File is named `proxy.ts` in the root (Next.js 16 requirement)
2. `config.matcher` includes your routes
3. No syntax errors in the proxy function
4. File is exporting both `proxy` and `config`

### Issue: SEO Metadata Not Updating

**Solution:** Ensure `generateMetadata` is async and calls `getMetadata(locale)`:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return getMetadata(locale as Locale)
}
```

---

## Adding a New Locale

To add a new locale (e.g., Spanish):

### 1. Update Locale Config

```typescript
// lib/i18n/config.ts
export type Locale = "ar" | "fr" | "en" | "es"

export const locales: LocaleConfig[] = [
  // ... existing locales
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    flag: "🇪🇸",
  },
]
```

### 2. Create Message File

```bash
touch lib/i18n/messages/es.json
```

Copy and translate all keys from `en.json`.

### 3. Update Static Params

```typescript
// app/[locale]/layout.tsx
export function generateStaticParams() {
  return [
    { locale: "ar" },
    { locale: "fr" },
    { locale: "en" },
    { locale: "es" }, // Add new locale
  ]
}
```

### 4. Update SEO Config (Optional)

If needed, add Spanish-specific SEO overrides in [lib/seo/config.ts](../../lib/seo/config.ts).

That's it! The routing, navigation, and UI will automatically support the new locale.

---

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [RTL Styling Guide](https://rtlstyling.com/)
- [Schema.org inLanguage](https://schema.org/inLanguage)

---

For questions or issues related to i18n, please check the [main documentation](../../README.md) or open an issue in the repository.
