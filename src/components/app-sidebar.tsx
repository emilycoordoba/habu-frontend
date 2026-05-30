"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building04Icon,
  FileManagementIcon,
  Invoice03Icon,
  Wrench01Icon,
  AiChat01Icon,
  HelpCircleIcon,
  UserSettings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HabuLogoHouse } from "@/components/habu-logo"
import { getUsuario } from "@/lib/session"
import type { UsuarioSesion } from "@/lib/session"

// ---------------------------------------------------------------------------
// Nav items base (visibles para todos los roles)
// ---------------------------------------------------------------------------

const NAV_BASE = [
  {
    title: "Inmuebles",
    url: "/inmuebles",
    icon: <HugeiconsIcon icon={Building04Icon} strokeWidth={2} />,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: <HugeiconsIcon icon={UserIcon} strokeWidth={2} />,
  },
  {
    title: "Contratos",
    url: "/contratos",
    icon: <HugeiconsIcon icon={FileManagementIcon} strokeWidth={2} />,
  },
  {
    title: "Pagos y Mora",
    url: "/pagos",
    icon: <HugeiconsIcon icon={Invoice03Icon} strokeWidth={2} />,
    items: [
      { title: "Reporte de ingresos", url: "/pagos/reportes" },
      { title: "Cobros en mora",      url: "/pagos/mora" },
    ],
  },
  {
    title: "Mantenimiento",
    url: "/mantenimiento",
    icon: <HugeiconsIcon icon={Wrench01Icon} strokeWidth={2} />,
  },
  {
    title: "Chatbot",
    url: "/chatbot",
    icon: <HugeiconsIcon icon={AiChat01Icon} strokeWidth={2} />,
  },
]

const NAV_ADMIN = {
  title: "Administración",
  url: "/administracion",
  icon: <HugeiconsIcon icon={UserSettings01Icon} strokeWidth={2} />,
}

const NAV_SECONDARY = [
  {
    title: "Ayuda",
    url: "#",
    icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
  },
]

// ---------------------------------------------------------------------------

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [usuario, setUsuario] = React.useState<UsuarioSesion | null>(null)

  React.useEffect(() => {
    setUsuario(getUsuario())
  }, [])

  const navItems = usuario?.rol === "administrador"
    ? [...NAV_BASE, NAV_ADMIN]
    : NAV_BASE

  const navUser = {
    name:   usuario?.nombre ?? "Usuario",
    email:  usuario?.correo ?? "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <HabuLogoHouse className="size-5! text-sidebar-primary" />
                <span className="text-base font-semibold">Habu</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={NAV_SECONDARY} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
