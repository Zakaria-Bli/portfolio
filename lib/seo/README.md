# SEO Configuration Guide

This Next.js application includes a comprehensive, modern SEO setup following the latest App Router best practices.

## 📁 File Structure

```
lib/seo/
├── config.ts          # Central SEO configuration
└── schema.ts          # Structured data utilities

app/
├── layout.tsx         # Root layout with metadata
├── sitemap.ts         # Dynamic sitemap generation
├── robots.ts          # Robots.txt generation
└── manifest.ts        # Web app manifest
```

## 🔧 Configuration

### Site Configuration (`lib/seo/config.ts`)

Update the following values in `lib/seo/config.ts` to match your portfolio:

```typescript
export const siteConfig = {
  name: "Your Portfolio",                    // Your site name
  description: "...",                        // Site description
  url: "https://yourportfolio.com",         // Production URL
  ogImage: "/og-image.png",                 // Open Graph image path
  links: {
    github: "https://github.com/...",       // Your GitHub
    linkedin: "https://linkedin.com/in/...", // Your LinkedIn
    twitter: "https://twitter.com/...",     // Your Twitter
  },
  author: {
    name: "Your Name",                       // Your name
    email: "your.email@example.com",        // Your email
    url: "https://yourportfolio.com",       // Your website
  },
  keywords: [...],                           // SEO keywords
}
```

### Metadata Features

The configuration includes:

- ✅ **Title Templates** - Automatic page title formatting
- ✅ **Meta Descriptions** - SEO-friendly descriptions
- ✅ **Open Graph** - Social media preview cards
- ✅ **Twitter Cards** - Twitter-specific metadata
- ✅ **Viewport & Theme** - Mobile optimization
- ✅ **Icons & Manifest** - PWA support
- ✅ **Robots Directives** - Search engine instructions

## 🗺️ Special Files

### Sitemap (`app/sitemap.ts`)

Automatically generates `/sitemap.xml` for search engines.

**To add routes:**

```typescript
const routes = [
  {
    url: `${baseUrl}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  // Add more routes...
]
```

### Robots.txt (`app/robots.ts`)

Automatically generates `/robots.txt` with crawler directives.

**To block specific paths:**

```typescript
disallow: ["/api/", "/private/", "/admin/"],
```

### Web Manifest (`app/manifest.ts`)

Generates `/manifest.webmanifest` for PWA support.

**Customize theme colors:**

```typescript
background_color: "#ffffff",  // Your background color
theme_color: "#000000",       // Your theme color
```

## 📊 Structured Data

### Available Schemas

The `lib/seo/schema.ts` file provides utilities for generating JSON-LD structured data:

- **`websiteSchema()`** - Website information
- **`personSchema()`** - Person/author information
- **`organizationSchema()`** - Organization information
- **`breadcrumbSchema()`** - Navigation breadcrumbs

### Usage in Pages

Add structured data to any page:

```tsx
import { personSchema, renderJsonLd } from "@/lib/seo/schema"

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(personSchema({
          jobTitle: "Software Engineer"
        }))}
      />
      {/* Page content */}
    </>
  )
}
```

## 🎨 Page-Specific Metadata

Override metadata for individual pages:

```tsx
// app/about/page.tsx
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
```

## 🖼️ Open Graph Images

### Static Images

Add an image to `/public/og-image.png` and reference it in `config.ts`:

```typescript
ogImage: "/og-image.png",
```

**Recommended size:** 1200×630 pixels

### Dynamic OG Images

For dynamic Open Graph images, create `app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ /* Your design */ }}>
        Dynamic OG Image
      </div>
    ),
    { ...size }
  )
}
```

## ✅ Verification

### Build Check

```bash
pnpm build
```

Ensures TypeScript types are correct and the app builds successfully.

### Local Testing

```bash
pnpm dev
```

Then visit:
- `http://localhost:3000` - View page source for meta tags
- `http://localhost:3000/sitemap.xml` - Check sitemap
- `http://localhost:3000/robots.txt` - Check robots.txt
- `http://localhost:3000/manifest.webmanifest` - Check manifest

### SEO Testing Tools

After deployment, test with:

- **[Google Rich Results Test](https://search.google.com/test/rich-results)** - Validate structured data
- **[Twitter Card Validator](https://cards-dev.twitter.com/validator)** - Test Twitter previews
- **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)** - Test Facebook previews
- **[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)** - Test LinkedIn previews
- **Chrome Lighthouse** - Run SEO audit (DevTools → Lighthouse → SEO)

## 📝 Best Practices

### 1. Unique Titles & Descriptions

Each page should have unique metadata:

```tsx
export const metadata: Metadata = {
  title: "Unique Page Title",
  description: "Unique page description (150-160 characters)",
}
```

### 2. Semantic HTML

Use proper HTML5 semantic elements:

```tsx
<main>
  <article>
    <h1>Page Title</h1>
    <section>Content</section>
  </article>
</main>
```

### 3. Image Optimization

Use Next.js `Image` component with `alt` text:

```tsx
import Image from "next/image"

<Image
  src="/photo.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
/>
```

### 4. Internal Linking

Use Next.js `Link` component for navigation:

```tsx
import Link from "next/link"

<Link href="/about">About Me</Link>
```

### 5. Performance

- Minimize JavaScript bundle size
- Optimize images (WebP format)
- Use lazy loading for below-fold content
- Implement proper caching headers

## 🔍 Common Issues

### Issue: Social media previews not updating

**Solution:** Clear the cache on social media platforms:
- Twitter: Use the [Card Validator](https://cards-dev.twitter.com/validator)
- Facebook: Use the [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- LinkedIn: Use the [Post Inspector](https://www.linkedin.com/post-inspector/)

### Issue: Sitemap not showing all pages

**Solution:** Add routes manually in `app/sitemap.ts` or implement dynamic route discovery.

### Issue: Robots.txt blocking important pages

**Solution:** Update the `allow` rules in `app/robots.ts`.

## 📚 Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## 🎯 Next Steps

1. **Customize Configuration** - Update `lib/seo/config.ts` with your information
2. **Add OG Image** - Create `/public/og-image.png` (1200×630px)
3. **Add Routes** - Update `app/sitemap.ts` as you add pages
4. **Test Locally** - Verify metadata in page source
5. **Deploy & Validate** - Test with SEO tools after deployment
6. **Monitor** - Use Google Search Console to track performance
