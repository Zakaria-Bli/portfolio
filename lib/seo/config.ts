import { getTranslations } from "next-intl/server"

import { Locale, localesCodes } from "@/lib/i18n"

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
 * Generate default metadata for a given locale
 */
export async function getMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
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
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        localesCodes.map((code) => [code, `/${code}`])
      ),
    },
  }
}
