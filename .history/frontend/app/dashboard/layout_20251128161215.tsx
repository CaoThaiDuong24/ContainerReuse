"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, RefreshCw, Settings, Globe, User, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: string
  username: string
  email: string
  role: string
}

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
      <div className="flex min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6 shadow-sm">
            <div className="flex-1 flex items-center gap-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Good Morning, John</h2>
                <p className="text-xs text-gray-500">Your latest system updates here</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Cron Run */}
              <Button variant="ghost" size="sm" className="text-xs text-gray-600 hover:bg-purple-50">
                <RefreshCw className="h-3 w-3 mr-1" />
                Cron run
                <span className="ml-1 text-purple-600">Just now ▼</span>
              </Button>

              {/* Sort By */}
              <Select defaultValue="all-time">
                <SelectTrigger className="w-32 h-8 text-xs border-gray-200">
                  <div className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All-Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>

              {/* Icons */}
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4 text-gray-600" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Globe className="h-4 w-4 text-gray-600" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-purple-50 rounded-lg px-2 py-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-400 text-white text-xs">
                        JS
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900">John Smith</span>
                      <span className="text-xs text-gray-500">@admin</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
