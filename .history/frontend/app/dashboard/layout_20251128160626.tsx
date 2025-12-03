"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string
  username: string
  email: string
  role: string
}
    title: "Logistics Tracking",
    href: "/dashboard/logistics",
    icon: TruckIcon,
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check auth state from localStorage
    try {
      const token = localStorage.getItem("authToken")
      const userStr = localStorage.getItem("user")
      
      if (token && userStr) {
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error loading auth state:", error)
      router.push("/login")
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Xin chào, <span className="font-semibold text-foreground">{user?.username || "3600610115"}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-64 pl-10"
                />
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h3 className="font-semibold">Thông báo</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Chưa có thông báo mới
                    </p>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
