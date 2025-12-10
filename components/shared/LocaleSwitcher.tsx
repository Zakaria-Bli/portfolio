"use client"

import { Languages, ChevronDown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { locales, type Locale } from "@/lib/i18n/config"
import { Link, usePathname } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"

type LocaleSwitcherProps = {
  className?: string
  variant?: "toggle" | "dropdown"
  showLabel?: boolean
}

export default function LocaleSwitcher({
  className = "",
  variant = "toggle",
  showLabel = true,
}: LocaleSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("common")
  const locale = useLocale() as Locale
  const pathname = usePathname()

  const currentLocale = locales.find((l) => l.code === locale) || locales[0]
  const otherLocale = locales.find((l) => l.code !== locale)

  // Toggle variant for 2 locales
  if (variant === "toggle" && locales.length === 2 && otherLocale) {
    return (
      <Link
        href={pathname || "/"}
        locale={otherLocale.code}
        scroll={false}
        className={cn(
          "group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          isPending && "pointer-events-none opacity-50",
          className
        )}
        aria-label={`${t("language")}: ${otherLocale.nativeName}`}
        onClick={() => {
          startTransition(() => {
            // Transition will handle the locale switch
          })
        }}
      >
        <span
          className="text-xl transition-transform group-hover:scale-110"
          role="img"
          aria-label={otherLocale.name}
        >
          {otherLocale.flag}
        </span>
        {showLabel && (
          <>
            <span className="hidden sm:inline" dir={otherLocale.direction}>
              {otherLocale.nativeName}
            </span>
            <span className="sm:hidden" dir={otherLocale.direction}>
              {otherLocale.code.toUpperCase()}
            </span>
          </>
        )}
        <Languages className="h-4 w-4 opacity-70" aria-hidden="true" />
      </Link>
    )
  }

  // Dropdown variant for multiple locales or explicit dropdown request
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          aria-label={`${t("language")}: ${currentLocale.nativeName}`}
          disabled={isPending}
        >
          <span className="text-xl" role="img" aria-label={currentLocale.name}>
            {currentLocale.flag}
          </span>
          {showLabel && (
            <>
              <span className="hidden sm:inline" dir={currentLocale.direction}>
                {currentLocale.nativeName}
              </span>
              <span className="sm:hidden" dir={currentLocale.direction}>
                {currentLocale.code.toUpperCase()}
              </span>
            </>
          )}
          <ChevronDown className="h-4 w-4 opacity-70" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[150px]">
        {locales.map((localeOption) => (
          <DropdownMenuItem
            key={localeOption.code}
            asChild
            disabled={localeOption.code === locale}
          >
            <Link
              href={pathname || "/"}
              locale={localeOption.code}
              scroll={false}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2",
                localeOption.code === locale && "bg-accent"
              )}
              aria-label={`${t("language")}: ${localeOption.nativeName}`}
              aria-current={localeOption.code === locale ? "true" : undefined}
              onClick={() => {
                startTransition(() => {
                  // Transition will handle the locale switch
                })
              }}
            >
              <span
                className="text-xl"
                role="img"
                aria-label={localeOption.name}
              >
                {localeOption.flag}
              </span>
              <span className="flex-1" dir={localeOption.direction}>
                {localeOption.nativeName}
              </span>
              {localeOption.code === locale && (
                <span className="text-xs opacity-70" aria-hidden="true">
                  ✓
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
