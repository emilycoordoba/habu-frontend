"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HabuLogoHouse } from "@/components/habu-logo"
import { ThemeToggle } from "@/components/landing/theme-toggle"

const navLinks = [
  { label: "Características", href: "#caracteristicas" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Por qué Habu", href: "#por-que-habu" },
]

export function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Logo: el mark va directo en color de marca, sin caja */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground"
        >
          <HabuLogoHouse className="size-6 text-primary" />
          <span className="text-xl">Habu</span>
        </Link>

        {/* Navegación real a las secciones */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
