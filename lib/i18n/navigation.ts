/**
 * Type-safe Navigation Utilities for next-intl
 *
 * This file provides typed navigation functions that are locale-aware:
 * - Link component
 * - useRouter hook
 * - usePathname hook
 * - redirect function
 */

import { createNavigation } from "next-intl/navigation"

import { routing } from "./routing"

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
