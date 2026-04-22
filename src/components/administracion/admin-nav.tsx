"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { label: "Usuarios",      href: "/administracion/usuarios" },
  { label: "Roles",         href: "/administracion/roles" },
  { label: "Comisiones",    href: "/administracion/comisiones" },
  { label: "Documentos",    href: "/administracion/documentos" },
  { label: "Parámetros",    href: "/administracion/parametros" },
  { label: "Plantillas",    href: "/administracion/plantillas" },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 -mb-px">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
