"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
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
import { Building04Icon, FileManagementIcon, Invoice03Icon, Wrench01Icon, AiChat01Icon, HelpCircleIcon, Camera01Icon, File01Icon, UserSettings01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HabuLogoHouse, HabuLogoMonogram } from "@/components/habu-logo"

// Mock: reemplazar por el rol real del usuario autenticado al conectar la API
const ROL_USUARIO: "administrador" | "asesor" = "administrador"

const data = {
  user: {
    name: "Emily Perea",
    email: "emily@habu.com.co",
    avatar: "",
  },
  navMain: [
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
    ...(ROL_USUARIO === "administrador" ? [{
      title: "Administración",
      url: "/administracion",
      icon: <HugeiconsIcon icon={UserSettings01Icon} strokeWidth={2} />,
    }] : []),
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <HugeiconsIcon icon={Camera01Icon} strokeWidth={2} />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Ayuda",
      url: "#",
      icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
