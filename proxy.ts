/**
 * Proxy for Internationalization and Authentication
 *
 * This proxy combines next-intl routing with authentication logic:
 * 1. Handles locale-based routing (e.g., /ar/*, /fr/*, /en/*)
 */

import { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./lib/i18n/routing"

// Create the i18n middleware
const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  // Handle i18n routing first
  const response = handleI18nRouting(request)

  return response
}

// Apply proxy to all routes except static files and API
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|images|icons|.*\\..*).*)",
  ],
}
