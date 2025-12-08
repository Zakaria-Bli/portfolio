import type { Metadata } from "next"

/**
 * Site-wide SEO configuration
 * Update these values to match your portfolio details
 */
export const siteConfig = {
  name: "iZak Code - Full Stack Developer",
  description:
    "Full-stack developer specializing in React, Next.js, and TypeScript. Building modern web applications with great UX.",
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
    "zakaria-bli",
    "zakaria bli",
    "izak code",
    "izakcode",
    "izakcode.com",
    "izak codes",
    "izakcodes",
    "izakcodes.com",
    "portfolio",
    "web developer",
    "software engineer",
    "full stack developer",
    "next.js",
    "react",
    "typescript",
  ],
}

/**
 * Default metadata configuration for the application
 * This can be extended or overridden in individual pages
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
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
}
