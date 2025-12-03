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

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header - Redesigned */}
          <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur-md shadow-sm">
            <div className="flex h-20 items-center justify-between px-8">
              {/* Left Section - Greeting & Search */}
              <div className="flex items-center gap-6 flex-1">
                <SidebarTrigger className="lg:hidden" />
                
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                    {getGreeting()}, {user?.username || "John"}
                  </h1>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span>Your latest system updates here</span>
                  </p>
                </div>
              </div>

              {/* Right Section - Actions & Profile */}
              <div className="flex items-center gap-4">
                {/* Cron Status Badge */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <RefreshCw className="h-4 w-4 text-purple-600" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-700">Cron Status</span>
                      <span className="text-xs text-purple-600 font-semibold">Just now</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>

                {/* Divider */}
                <div className="hidden md:block h-8 w-px bg-gray-200" />

                {/* Time Period Selector */}
                <Select defaultValue="all-time">
                  <SelectTrigger className="w-36 h-10 text-sm border-gray-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All-Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                {/* Divider */}
                <div className="hidden md:block h-8 w-px bg-gray-200" />

                {/* Notification Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 relative hover:bg-purple-50 transition-all duration-200 rounded-lg"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                </Button>

                {/* Globe Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden md:flex h-10 w-10 hover:bg-purple-50 transition-all duration-200 rounded-lg"
                >
                  <Globe className="h-5 w-5 text-gray-600" />
                </Button>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200" />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl px-3 py-2 transition-all duration-200 group">
                      <Avatar className="h-10 w-10 ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white text-sm font-bold">
                          {getInitials(user?.username || "John Smith")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">
                          {user?.username || "John Smith"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                          {user?.role || "admin"}
                        </span>
                      </div>
                      <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <div className="px-3 py-3 border-b border-gray-100 mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.username || "John Smith"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.email || "john@example.com"}
                      </p>
                    </div>
                    <DropdownMenuItem className="cursor-pointer rounded-lg">
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="text-sm">Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg">
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="text-sm">Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="text-sm font-medium">Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
