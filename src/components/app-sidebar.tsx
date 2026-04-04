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
import { Building04Icon, FileManagementIcon, Invoice03Icon, Wrench01Icon, AiChat01Icon, Camera01Icon, File01Icon, Settings05Icon, HelpCircleIcon, SearchIcon, Database01Icon, Analytics01Icon, CommandIcon } from "@hugeicons/core-free-icons"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inmuebles",
      url: "/inmuebles",
      icon: <HugeiconsIcon icon={Building04Icon} strokeWidth={2} />,
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
      title: "Settings",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
      ),
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Database01Icon} strokeWidth={2} />
      ),
    },
    {
      name: "Reports",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
      ),
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: (
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
      ),
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
                <HugeiconsIcon icon={CommandIcon} strokeWidth={2} className="size-5!" />
                <span className="text-base font-semibold">Habu</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
