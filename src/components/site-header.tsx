"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const TITULO_POR_RUTA: Record<string, string> = {
  "/contratos":      "Contratos",
  "/pagos":          "Pagos y Mora",
  "/inmuebles":      "Inmuebles",
  "/mantenimiento":  "Mantenimiento",
  "/chatbot":        "Chatbot",
  "/administracion": "Administración",
  "/clientes":       "Clientes",
}

function getTitulo(pathname: string): string {
  const match = Object.keys(TITULO_POR_RUTA).find((ruta) =>
    pathname.startsWith(ruta)
  )
  return match ? TITULO_POR_RUTA[match] : "Habu"
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getTitulo(pathname)}</h1>
      </div>
    </header>
  )
}
