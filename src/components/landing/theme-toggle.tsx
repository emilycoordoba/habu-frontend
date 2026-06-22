"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun01Icon, Moon02Icon } from "@hugeicons/core-free-icons"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita el mismatch de hidratación: el tema resuelto solo se conoce en cliente.
  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Cambiar tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && (
        <HugeiconsIcon
          icon={isDark ? Sun01Icon : Moon02Icon}
          size={18}
          strokeWidth={2}
        />
      )}
    </Button>
  )
}
