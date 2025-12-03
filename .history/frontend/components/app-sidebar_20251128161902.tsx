"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Ticket,
  Settings as SettingsIcon,
  Users,
  ChevronRight,
  Truck,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
]

const managementItems = [
  {
    title: "Containers",
    icon: Ticket,
    url: "/dashboard/containers",
  },
  {
    title: "Logistics",
    icon: Truck,
    url: "/dashboard/logistics",
  },
  {
    title: "Users",
    icon: Users,
    url: "/dashboard/users",
  },
]

const otherItems = [
  {
    title: "Reports",
    icon: BarChart3,
    url: "/dashboard/reports",
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    url: "/dashboard/settings",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [ticketsOpen, setTicketsOpen] = React.useState(true)

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-purple-50 to-white">
      <SidebarHeader className="border-b border-purple-100 px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 shadow-lg">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">panze</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        {/* MENU Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "hover:bg-purple-50"}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AGENTS & USERS Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            AGENTS & USERS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {agentsUsersItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.hasSubmenu ? (
                    <Collapsible open={ticketsOpen} onOpenChange={setTicketsOpen}>
                      <CollapsibleTrigger className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium">
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${ticketsOpen ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 ml-8 space-y-1">
                        {item.submenu?.map((subitem) => (
                          <Link
                            key={subitem.title}
                            href={subitem.url}
                            className="block px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 rounded-lg"
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className={pathname === item.url ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "hover:bg-purple-50"}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* APPEARANCE & OTHERS Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            APPEARANCE & OTHERS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {appearanceOthersItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "hover:bg-purple-50"}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
