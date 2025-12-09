import {
  Space_Grotesk,
  Fira_Code,
  IBM_Plex_Sans_Arabic,
} from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import "./globals.css"

import { getDirection, Locale } from "@/lib/i18n"
import { defaultMetadata } from "@/lib/seo/config"
import { websiteSchema, personSchema, renderJsonLd } from "@/lib/seo/schema"

import type { Metadata } from "next"

const primaryFont = Space_Grotesk({
  variable: "--font-primary",
  subsets: ["latin"],
})

const secondaryFont = Fira_Code({
  variable: "--font-secondary",
  subsets: ["latin"],
})

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export const metadata: Metadata = defaultMetadata

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "fr" }, { locale: "en" }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<Props>) {
  const { locale } = await params

  // Get messages for the locale
  const messages = await getMessages()

  // Get text direction
  const dir = getDirection(locale as Locale)

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLd(websiteSchema())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLd(personSchema())}
        />
      </head>
      <body
        className={`${primaryFont.variable} ${secondaryFont.variable} ${ibmPlexSansArabic.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
