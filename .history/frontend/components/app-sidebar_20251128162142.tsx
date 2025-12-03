"use client"

import * as React from "react"
import {
  LayoutDashboard,
  MessageSquare,
  Ticket,
  Settings as SettingsIcon,
  Users,
  ChevronRight,
  ChevronDown,
  UserCog,
  Palette,
  BookOpen,
  FileText,
  Megaphone,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Messenger",
    icon: MessageSquare,
    url: "/dashboard/messenger",
  },
]

const agentsUsersItems = [
  {
    title: "Tickets",
    icon: Ticket,
    url: "/dashboard/tickets",
    hasSubmenu: true,
  },
  {
    title: "Ticket Configuration",
    icon: null,
    url: null,
    isParent: true,
    subItems: [
      { title: "General Configuration", url: "/dashboard/tickets/general" },
      { title: "Triggering", url: "/dashboard/tickets/triggering" },
      { title: "Ticket Status", url: "/dashboard/tickets/status" },
      { title: "Products", url: "/dashboard/tickets/products" },
    ],
  },
  {
    title: "Agent Management",
    icon: UserCog,
    url: "/dashboard/agents",
    hasSubmenu: true,
  },
  {
    title: "Manage User",
    icon: Users,
    url: "/dashboard/users",
    hasSubmenu: true,
  },
]

const appearanceOthersItems = [
  {
    title: "Appearance Settings",
    icon: Palette,
    url: "/dashboard/appearance",
    hasSubmenu: true,
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    url: "/dashboard/knowledge",
    hasSubmenu: true,
  },
  {
    title: "Article Administration",
    icon: FileText,
    url: "/dashboard/articles",
    hasSubmenu: true,
  },
  {
    title: "Marketing Promotion",
    icon: Megaphone,
    url: "/dashboard/marketing",
    hasSubmenu: true,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [ticketConfigOpen, setTicketConfigOpen] = React.useState(true)

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
            <span className="text-[10px] text-gray-500">studio</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        {/* MENU Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "text-gray-600 hover:bg-purple-50"}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
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
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            AGENTS & USERS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Tickets with submenu */}
              <Collapsible open={ticketConfigOpen} onOpenChange={setTicketConfigOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="text-gray-600 hover:bg-purple-50 data-[state=open]:bg-purple-50"
                    >
                      <div className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Ticket className="h-5 w-5" />
                          <span className="text-sm font-medium">Tickets</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${ticketConfigOpen ? 'rotate-90' : ''}`} />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>

                {/* Ticket Configuration Parent */}
                <CollapsibleContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="text-gray-600 hover:bg-purple-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full pl-8 pr-3 py-2 rounded-lg">
                        <span className="text-sm">Ticket Configuration</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Submenu items */}
                  <SidebarMenuSub className="ml-8 border-l-2 border-gray-200 pl-4 py-1">
                    {agentsUsersItems[1].subItems?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                          className={pathname === subItem.url ? "text-purple-700" : "text-gray-600 hover:text-gray-900"}
                        >
                          <Link href={subItem.url} className="py-1.5">
                            <span className="text-[13px]">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              {/* Agent Management */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/agents"}
                  className={pathname === "/dashboard/agents" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "text-gray-600 hover:bg-purple-50"}
                >
                  <Link href="/dashboard/agents" className="flex items-center justify-between px-3 py-2.5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCog className="h-5 w-5" />
                      <span className="text-sm font-medium">Agent Management</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Manage User */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/users"}
                  className={pathname === "/dashboard/users" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "text-gray-600 hover:bg-purple-50"}
                >
                  <Link href="/dashboard/users" className="flex items-center justify-between px-3 py-2.5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span className="text-sm font-medium">Manage User</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* APPEARANCE & OTHERS Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            APPEARANCE & OTHERS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {appearanceOthersItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "text-gray-600 hover:bg-purple-50"}
                  >
                    <Link href={item.url!} className="flex items-center justify-between px-3 py-2.5 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.hasSubmenu && <ChevronRight className="h-4 w-4" />}
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
