# SEO Configuration Guide

This application implements comprehensive SEO optimization using Next.js 16's metadata APIs and structured data. This guide covers how the system works and how to customize it for your needs.

---

## Table of Contents

1. [Overview](#overview)
2. [Implementation](#implementation)
3. [Using the SEO System](#using-the-seo-system)
4. [Testing & Validation](#testing--validation)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Related Documentation](#related-documentation)

---

## Overview

The SEO system provides:

- ✅ **Multi-language Support** - Integrated with i18n for localized metadata
- ✅ **Rich Social Previews** - Open Graph and Twitter Card support
- ✅ **Structured Data** - JSON-LD schemas for search engines
- ✅ **Dynamic Sitemap** - Automatically generated at `/sitemap.xml`
- ✅ **PWA Ready** - Web app manifest for installation
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Hreflang Tags** - Proper language version signals

---

## Implementation

### Structure

All SEO configuration is organized in dedicated locations:

```
portfolio-next/
├── app/
│   ├── [locale]/
│   │   └── layout.tsx        # Root layout with metadata
│   ├── sitemap.ts            # Dynamic sitemap
│   ├── robots.ts             # Robots.txt configuration
│   └── manifest.ts           # PWA manifest
│
├── lib/
│   └── seo/
│       ├── config.ts         # Central SEO configuration
│       ├── schema.ts         # Structured data helpers
│       └── README.md         # This file
│
└── public/
    ├── og-image.png          # Default Open Graph image
    └── favicon.ico           # Site favicon
```

### Integration Steps

#### 1. Site Configuration

All SEO values are centralized in [lib/seo/config.ts](../../lib/seo/config.ts) for easy maintenance:

```typescript
export const siteConfig = {
  name: "iZak Code - Full Stack Developer",
  description:
    "Full-stack developer specializing in React, Next.js, and TypeScript.",
  url: "https://izakcode.com",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/Zakaria-Bli",
    linkedin: "https://linkedin.com/in/zakaria-bli",
  },
  author: {
    name: "Zakaria-Bli - iZak Code",
    email: "contact@izakcode.com",
    url: "https://izakcode.com",
  },
  keywords: [
    "zakaria bouali",
    "portfolio",
    "web developer",
    "full stack developer",
    "next.js",
    "react",
    "typescript",
  ],
}
```

**To customize:** Update these values with your own information.

#### 2. Metadata Generation

The `getMetadata()` function generates locale-aware metadata:

```typescript
export async function getMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`, // Page-specific titles
    },
    description: t("description"),
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    openGraph: {
      type: "website",
      locale: locale,
      url: `${siteConfig.url}/${locale}`,
      title: t("title"),
      description: t("description"),
      siteName: t("title"),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        ar: `${siteConfig.url}/ar`,
        fr: `${siteConfig.url}/fr`,
      },
    },
  }
}
```

### i18n Integration

Metadata pulls translations from [lib/i18n/messages](../i18n/messages/):

**en.json:**

```json
{
  "Metadata": {
    "title": "iZak Code - Full Stack Developer",
    "description": "Full-stack developer specializing in React, Next.js, and TypeScript."
  }
}
```

**ar.json:**

```json
{
  "Metadata": {
    "title": "iZak Code - مطور شامل",
    "description": "مطور شامل متخصص في React و Next.js و TypeScript."
  }
}
```

This integrates with the i18n system to pull translations from [lib/i18n/messages](../i18n/messages/), ensuring titles and descriptions are properly localized.

#### 3. Structured Data Helpers

Helper functions in [lib/seo/schema.ts](../../lib/seo/schema.ts) generate JSON-LD structured data:

**`websiteSchema()`** - Website information:

```typescript
export function websiteSchema(locale: Locale = "en"): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  }
}
```

**`personSchema()`** - Person/author information (for portfolios):

```typescript
export function personSchema(
  overrides?: Partial<Person>,
  locale: Locale = "en"
): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    email: siteConfig.author.email,
    inLanguage: locale,
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    ...overrides,
  }
}
```

**Usage:** Include these in your page layouts to provide rich search engine data.

#### 4. Special Files Configuration

Next.js special files are configured for SEO:

**Sitemap** ([app/sitemap.ts](../../app/sitemap.ts)) - Automatically served at `/sitemap.xml`:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ]
}
```

**Robots.txt** ([app/robots.ts](../../app/robots.ts)) - Controls crawler access:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

**Web Manifest** ([app/manifest.ts](../../app/manifest.ts)) - PWA support:

```typescript
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
      /* ... */
    ],
  }
}
```

---

## Using the SEO System

### Setting Up Page Metadata

To add metadata to a page, use the `getMetadata()` function in your page's `generateMetadata` export:

```typescript
// app/[locale]/(root)/(home)/page.tsx
import { getMetadata } from "@/lib/seo/config"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return getMetadata({
    locale,
    title: t("title"),
    description: t("description"),
  })
}
```

This automatically generates all necessary metadata including Open Graph tags, alternate language links, and robots directives.

### Adding Structured Data

To include JSON-LD structured data in your layout or page:

```typescript
// app/[locale]/layout.tsx
import { websiteSchema, personSchema } from "@/lib/seo/schema"

export default function Layout() {
  const locale = "en" // or get from params

  return (
    <html>
      <head>
        {/* Website schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema(locale)),
          }}
        />

        {/* Person schema for portfolio sites */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema({}, locale)),
          }}
        />
      </head>
      <body>{/* ... */}</body>
    </html>
  )
}
```

### Extending the Sitemap

To add more routes to [app/sitemap.ts](../../app/sitemap.ts), extend the routes array:

````typescript
import { siteConfig } from "@/lib/seo/config"

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
```typescript
const routes = [
  {
    url: `${siteConfig.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  },
  {
    url: `${siteConfig.url}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: `${siteConfig.url}/projects`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
]
````

For multi-locale sitemaps, map over locales:

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

### Customizing Robots.txt

To block additional paths in [app/robots.ts](../../app/robots.ts), extend the `disallow` array:

```typescript
disallow: ["/api/", "/private/", "/admin/", "/_next/"],
```

### Customizing the Web Manifest

The PWA manifest in [app/manifest.ts](../../app/manifest.ts) can be extended with additional properties:

```typescript
return {
  name: siteConfig.name,
  short_name: siteConfig.name,
  description: siteConfig.description,
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#000000",
  categories: ["productivity", "development"],
  screenshots: [
    {
      src: "/screenshot-wide.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide",
    },
  ],
  icons: [
    /* ... */
  ],
}
```

---

## Testing & Validation

### Verifying Metadata

Check that metadata is generated correctly:

1. **View Page Source** - Right-click → "View Page Source" and search for `<meta>` tags
2. **Next.js DevTools** - Inspect the metadata object in the browser console
3. **Lighthouse** - Run a Lighthouse audit in Chrome DevTools

### Validating Structured Data

Test JSON-LD schemas with Google's Rich Results Test:

1. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your page URL
3. Check for validation errors or warnings

Alternatively, use the [Schema.org validator](https://validator.schema.org/).

### Sitemap Verification

Check that your sitemap is accessible:

```bash
curl http://localhost:3000/sitemap.xml
# or visit in browser: http://localhost:3000/sitemap.xml
```

Submit to search engines:

- **Google Search Console**: Add property → Sitemaps → Submit `https://yourdomain.com/sitemap.xml`
- **Bing Webmaster Tools**: Configure → Sitemaps → Submit URL

### Robots.txt Testing

Verify robots.txt configuration:

```bash
curl http://localhost:3000/robots.txt
```

Test with [Google's robots.txt Tester](https://support.google.com/webmasters/answer/6062598).

---

## Best Practices

### SEO Checklist

- ✅ **Unique Titles**: Every page should have a unique, descriptive title
- ✅ **Meta Descriptions**: Write compelling descriptions (150-160 characters)
- ✅ **Open Graph Tags**: Include og:title, og:description, og:image for social sharing
- ✅ **Canonical URLs**: Set canonical URLs to prevent duplicate content issues
- ✅ **Structured Data**: Add relevant JSON-LD schemas (Website, Person, Breadcrumb)
- ✅ **Sitemap**: Keep sitemap updated with all public pages
- ✅ **Robots.txt**: Block private/admin routes from crawlers
- ✅ **Locale Alternates**: Include `<link rel="alternate" hreflang="x">` for i18n

### Performance Tips

1. **Lazy Load Images**: Use `next/image` with proper `loading` attributes
2. **Optimize Fonts**: Load only necessary font weights and subsets
3. **Minimize Render-Blocking**: Use async/defer for non-critical scripts
4. **Compress Assets**: Enable gzip/brotli compression
5. **CDN for Static Assets**: Use a CDN for images and static files

### Content Optimization

1. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
2. **Alt Text for Images**: Provide descriptive alt text for accessibility and SEO
3. **Internal Linking**: Link related pages to improve navigation and crawlability
4. **Mobile-First**: Ensure responsive design works well on all devices
5. **Page Speed**: Aim for fast Time to First Byte (TTFB) and Largest Contentful Paint (LCP)

---

## Troubleshooting

### Metadata Not Showing

**Issue**: Open Graph tags don't appear when sharing links.

**Solution**:

1. Check that `generateMetadata` is exported from the page
2. Verify metadata is in `<head>` by viewing page source
3. Clear social media cache (e.g., [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/))

### Sitemap 404 Error

**Issue**: `/sitemap.xml` returns 404.

**Solution**:

- Ensure [app/sitemap.ts](../../app/sitemap.ts) exports a default function
- Check that it returns `MetadataRoute.Sitemap` type
- Restart dev server: `pnpm dev`

### Structured Data Errors

**Issue**: Google Rich Results Test shows validation errors.

**Solution**:

1. Check JSON-LD syntax - ensure no trailing commas
2. Verify all required properties are present (name, url, etc.)
3. Use `JSON.stringify()` when rendering to ensure proper escaping

### Wrong Locale in Metadata

**Issue**: Metadata shows wrong language.

**Solution**:

- Verify `locale` is passed correctly to `getMetadata()`
- Check that translation keys exist in [lib/i18n/messages](../i18n/messages/)
- Ensure `getTranslations()` uses correct namespace: `"Metadata"`

---

## Related Documentation

- **i18n System**: [lib/i18n/README.md](../i18n/README.md) - Internationalization setup
- **Next.js Metadata**: [Next.js Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- **Schema.org**: [Schema.org Documentation](https://schema.org/)
- **Open Graph**: [Open Graph Protocol](https://ogp.me/)

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={renderJsonLd(websiteSchema(locale as Locale))}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={renderJsonLd(personSchema(undefined, locale as Locale))}
          />
        </head>
        <body>{children}</body>
      </html>

  )
  }

````

---

## Using Metadata

### Overriding Default Metadata

Customize metadata for individual pages:

```tsx
// app/[locale]/(root)/about/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about my background and experience",
  openGraph: {
    title: "About Me",
    description: "Learn more about my background and experience",
    images: ["/about-og.png"],
  },
}

export default function AboutPage() {
  return <div>About content</div>
}
````

### Dynamic Metadata

For dynamic pages, use `generateMetadata`:

```tsx
// app/[locale]/(root)/projects/[slug]/page.tsx
import { getMetadata } from "@/lib/seo/config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const project = await getProject(slug)
  const baseMetadata = await getMetadata(locale as Locale)

  return {
    ...baseMetadata,
    title: project.title,
    description: project.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  }
}
```

---

## Open Graph Images

### Static Images

Place your default Open Graph image at `/public/og-image.png` (1200×630px):

```
public/
└── og-image.png  # 1200×630px
```

Referenced in [lib/seo/config.ts](../../lib/seo/config.ts):

```typescript
ogImage: "/og-image.png",
```

### Dynamic OG Images (Optional)

For dynamic Open Graph images, create `app/[locale]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        iZak Code
      </div>
    ),
    { ...size }
  )
}
```

---

## Testing & Validation

### Local Testing

Test locally by running the dev server:

```bash
pnpm dev
```

Then visit:

- `http://localhost:3000` - View page source for meta tags
- `http://localhost:3000/sitemap.xml` - Check sitemap
- `http://localhost:3000/robots.txt` - Check robots.txt
- `http://localhost:3000/manifest.webmanifest` - Check manifest

### Build Validation

Before deploying, always build to catch TypeScript errors:

```bash
pnpm build
```

This ensures all metadata is correctly typed and structured data is valid.

### SEO Testing Tools

After deployment, validate with:

1. **[Google Rich Results Test](https://search.google.com/test/rich-results)** - Validates structured data
2. **[Twitter Card Validator](https://cards-dev.twitter.com/validator)** - Tests Twitter previews
3. **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)** - Tests Facebook previews
4. **[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)** - Tests LinkedIn previews
5. **Chrome Lighthouse** - Run SEO audit (DevTools → Lighthouse → SEO category)
6. **Google Search Console** - Monitor indexing status and coverage

---

## Best Practices

### 1. Unique Titles and Descriptions

Each page should have unique, descriptive metadata:

```typescript
// Good
export const metadata: Metadata = {
  title: "React Performance Optimization Guide",
  description: "Learn advanced techniques for optimizing React applications...",
}

// Bad (duplicate content)
export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Welcome to my portfolio",
}
```

### 2. Semantic HTML

Use proper HTML5 semantic elements:

```tsx
<main>
  <article>
    <header>
      <h1>Page Title</h1>
    </header>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>
```

### 3. Image Optimization

Always use Next.js `Image` component with descriptive `alt` text:

```tsx
import Image from "next/image"

;<Image
  src="/project-screenshot.jpg"
  alt="Screenshot of the portfolio project showing the home page design"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

### 4. Internal Linking

Link related pages to help crawlers understand site structure:

```tsx
import { Link } from "@/lib/i18n/navigation"

;<nav>
  <Link href="/about">About</Link>
  <Link href="/projects">Projects</Link>
  <Link href="/contact">Contact</Link>
</nav>
```

### 5. Performance Optimization

- Minimize JavaScript bundle size
- Optimize images (use WebP format)
- Implement lazy loading for below-the-fold content
- Use proper caching headers (handled by Next.js)
- Leverage Server Components (reduces client-side JavaScript)

### 6. Mobile Optimization

- Responsive design (using Tailwind)
- Proper viewport meta tag (automatically added by Next.js)
- Touch-friendly UI elements
- Fast loading on slow networks

---

## Troubleshooting

### Issue: Social media previews not updating

**Cause:** Platforms cache Open Graph images and metadata.

**Solution:** Clear cache on each platform:

- **Twitter:** Use [Card Validator](https://cards-dev.twitter.com/validator)
- **Facebook:** Use [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **LinkedIn:** Use [Post Inspector](https://www.linkedin.com/post-inspector/)

Click "Fetch new scrape info" or similar button to force a refresh.

### Issue: Sitemap not showing all pages

**Cause:** Routes not added to `sitemap.ts`.

**Solution:** Manually add routes or implement dynamic discovery:

```typescript
// For dynamic routes
const projects = await getProjects()
const projectUrls = projects.map((p) => ({
  url: `${baseUrl}/projects/${p.slug}`,
  lastModified: p.updatedAt,
}))
```

### Issue: Robots.txt blocking important pages

**Cause:** Overly restrictive `disallow` rules.

**Solution:** Update [app/robots.ts](../../app/robots.ts):

```typescript
disallow: ["/api/", "/private/"],  // Only block necessary paths
```

### Issue: Missing hreflang tags

**Cause:** `alternates.languages` not configured.

**Solution:** Ensure metadata includes all locales:

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

### Issue: Structured data errors

**Cause:** Invalid JSON-LD format or missing required properties.

**Solution:**

1. Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Check [Schema.org documentation](https://schema.org/) for required properties
3. Ensure TypeScript types match schema requirements

---

## Customization Checklist

When setting up for a new project, update:

1. ✅ **Site Config** - Update [lib/seo/config.ts](../../lib/seo/config.ts) with your details
2. ✅ **Translations** - Update `Metadata` namespace in [lib/i18n/messages](../i18n/messages/)
3. ✅ **OG Image** - Create `/public/og-image.png` (1200×630px)
4. ✅ **Favicon** - Add `/public/favicon.ico` and other icon sizes
5. ✅ **Sitemap** - Add routes in [app/sitemap.ts](../../app/sitemap.ts)
6. ✅ **Robots** - Adjust crawler rules in [app/robots.ts](../../app/robots.ts)
7. ✅ **Manifest** - Customize PWA settings in [app/manifest.ts](../../app/manifest.ts)
8. ✅ **Structured Data** - Review schemas in [lib/seo/schema.ts](../../lib/seo/schema.ts)

---

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)

---

For questions or issues related to SEO, please check the [main documentation](../../README.md) or open an issue in the repository.
