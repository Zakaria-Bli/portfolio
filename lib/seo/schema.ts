import { siteConfig } from "./config"

/**
 * Type definitions for Schema.org structured data
 */
type WithContext<T> = T & {
  "@context": "https://schema.org"
}

type Thing = {
  "@type": string
  name?: string
  url?: string
  description?: string
}

type WebSite = Thing & {
  "@type": "WebSite"
  name: string
  url: string
  description?: string
  author?: Person
}

type Person = Thing & {
  "@type": "Person"
  name: string
  url?: string
  email?: string
  jobTitle?: string
  sameAs?: string[]
}

type Organization = Thing & {
  "@type": "Organization"
  name: string
  url: string
  logo?: string
  sameAs?: string[]
}

type BreadcrumbList = {
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item?: string
  }>
}

/**
 * Generate Website schema
 */
export function websiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  }
}

/**
 * Generate Person schema (for portfolio/personal sites)
 */
export function personSchema(overrides?: Partial<Person>): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    email: siteConfig.author.email,
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin].filter(
      Boolean
    ),
    ...overrides,
  }
}

/**
 * Generate Organization schema (for company/agency sites)
 */
export function organizationSchema(
  overrides?: Partial<Organization>
): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin].filter(
      Boolean
    ),
    ...overrides,
  }
}

/**
 * Generate Breadcrumb schema
 */
export function breadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Helper to render JSON-LD script tag
 */
export function renderJsonLd(data: WithContext<Thing | BreadcrumbList>) {
  return {
    __html: JSON.stringify(data),
  }
}
