import { Space_Grotesk, Fira_Code } from "next/font/google"

import "./globals.css"

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

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
        className={`${primaryFont.variable} ${secondaryFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
