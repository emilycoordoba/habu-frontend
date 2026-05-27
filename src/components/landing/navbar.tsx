"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HabuLogoHouse } from "@/components/habu-logo"

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <HabuLogoHouse className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg tracking-tight">Habu</span>
        </Link>

        {/* CTA */}
        <Button asChild size="sm">
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </div>
    </header>
  )
}
