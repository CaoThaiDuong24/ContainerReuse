"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
import { AuthService } from "@/lib/authService"

interface User {
  id: string
  username: string
  email: string
  role: string
  userId?: string
  userName?: string
}
import { useAuth } from "@/hooks/use-auth"

const RCS_BASE_URL =
  process.env.NEXT_PUBLIC_RCS_URL || "https://hub1.ltacv.com"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, login: authLogin, logout } = useAuth()
  const [initLoading, setInitLoading] = useState(true)
  const [initMessage] = useState("Đang đăng nhập thông qua token")
  const hasInitialized = useRef(false)

  const getUrlParams = () => {
    if (typeof window === "undefined") return { token: null, userId: null, userName: null, hasToken: false }
    const params = new URLSearchParams(window.location.search)
    return {
      token: params.get("token"),
      userId: params.get("userId"),
      userName: params.get("userName"),
      hasToken: params.has("token"),
    }
  }

  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      const part = parts.pop()
      if (!part) return null
      return part.split(";").shift() || null
    }
    return null
  }

const decodeValue = (value: string | null): string | null => {
  if (!value) return null
  try {
    return decodeURIComponent(value.replace(/\+/g, " "))
  } catch {
    return value
  }
}

const buildHubRedirectUrl = (currentUrl: string) => {
    // Append /login?redirectUrl=... to base URL
    const baseUrl = RCS_BASE_URL.replace(/\/$/, "") // Remove trailing slash if exists
    return `${baseUrl}/login?redirectUrl=${encodeURIComponent(currentUrl)}`
  }

  const redirectToHubLogin = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href
      window.location.href = buildHubRedirectUrl(currentUrl)
    } else {
      router.push("/login")
    }
  }

  const redirectToVerify = useCallback(() => {
    if (typeof window !== "undefined") {
      // Only use the base dashboard URL without query params
      const currentOrigin = window.location.origin
      const redirectUrl = `${currentOrigin}/dashboard`
      router.push(`/verify?redirectUrl=${encodeURIComponent(redirectUrl)}`)
    } else {
      router.push("/verify")
    }
  }, [router])

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initAuth = async () => {
      try {
        const { token: urlToken, userId: urlUserId, userName: urlUserName, hasToken } = getUrlParams()

        // Token rỗng khi có param → coi như không hợp lệ
        if (hasToken && (!urlToken || urlToken.trim() === "")) {
          redirectToVerify()
          return
        }

        // Chọn token ưu tiên: URL -> localStorage -> cookie
        const storedToken = localStorage.getItem("authToken")?.trim() || null
        const cookieToken = getCookie("authToken")?.trim() || null

        let candidateToken: string | null = null
        let tokenSource: "url" | "storage" | "cookie" | null = null

        if (urlToken && urlToken.trim()) {
          candidateToken = urlToken.trim()
          tokenSource = "url"
        } else if (storedToken) {
          candidateToken = storedToken
          tokenSource = "storage"
        } else if (cookieToken) {
          candidateToken = cookieToken
          tokenSource = "cookie"
        }

        if (!candidateToken) {
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          redirectToVerify()
          return
        }

        // Validate duy nhất 1 lần
        const isValid = await AuthService.validateToken(candidateToken)
        if (!isValid) {
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          redirectToVerify()
          return
        }

        // Lưu token + user info
        localStorage.setItem("authToken", candidateToken)

        // Lấy userId/userName ưu tiên: URL > cookie (nếu token từ cookie) > localStorage
        const cookieUserId = tokenSource === "cookie" ? decodeValue(getCookie("userId")) : null
        const cookieUserName = tokenSource === "cookie" ? decodeValue(getCookie("userName")) : null

        let userIdValue = decodeValue(urlUserId || cookieUserId || localStorage.getItem("userId"))
        let userNameValue = decodeValue(urlUserName || cookieUserName || localStorage.getItem("userName"))

        if (userIdValue) localStorage.setItem("userId", userIdValue)
        if (userNameValue) localStorage.setItem("userName", userNameValue)

        // Nếu token đến từ URL, xóa query
        if (tokenSource === "url" && typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname)
        }

        let userStr = localStorage.getItem("user")

        if (!userStr || userStr === "undefined") {
          const fallbackUser: User = {
            id: userIdValue || "",
            username: userNameValue || userIdValue || "User",
            email: "",
            role: "user",
            userId: userIdValue || undefined,
            userName: userNameValue || undefined,
          }
          userStr = JSON.stringify(fallbackUser)
          localStorage.setItem("user", userStr)
        }

        if (!userStr) {
          redirectToVerify()
          return
        }

        const userData = JSON.parse(userStr) as User

        const decodedUserId = decodeValue(userData.userId ?? null)
        if (decodedUserId) {
          userData.userId = decodedUserId
        }

        const decodedUserName = decodeValue(userData.userName ?? null)
        if (decodedUserName) {
          userData.userName = decodedUserName
          userData.username = decodedUserName
        }

        if (userIdValue && userData.userId !== userIdValue) {
          userData.userId = userIdValue
          userData.id = userIdValue
        }
        if (userNameValue && userData.userName !== userNameValue) {
          userData.userName = userNameValue
          userData.username = userNameValue
        }

        authLogin(candidateToken, userData)
        localStorage.setItem("user", JSON.stringify(userData))
      } catch (error) {
        console.error("Error loading auth state:", error)
        redirectToVerify()
      } finally {
        setInitLoading(false)
      }
    }

    void initAuth()
  }, [authLogin, redirectToVerify])

  useEffect(() => {
    if (initLoading) return
    if (!isLoading && !isAuthenticated) {
      redirectToVerify()
    }
  }, [initLoading, isAuthenticated, isLoading, redirectToVerify])

  if (isLoading || initLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{initMessage}</h1>
          <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout({ skipRedirect: true })

    // Get current origin (e.g., http://localhost:3001)
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : ""
    const redirectUrl = `${currentOrigin}/dashboard`

    // Build RCS logout URL with redirectUrl
    const baseUrl = RCS_BASE_URL.replace(/\/$/, "") // Remove trailing slash if exists
    const rcsLogoutUrl = `${baseUrl}/logout?redirectUrl=${encodeURIComponent(redirectUrl)}`

    // Redirect to RCS logout
    if (typeof window !== "undefined") {
      window.location.href = rcsLogoutUrl
    } else {
      router.push(rcsLogoutUrl)
    }
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
                <SidebarTrigger className="h-10 w-10 hover:bg-purple-50 transition-all duration-200 rounded-lg" />

                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                    {getGreeting()}, {user?.userName || user?.username || "John"}
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
                          {user?.userName || user?.username || "User"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                          {user?.userId || user?.role || "user"}
                        </span>
                      </div>
                      <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <div className="px-3 py-3 border-b border-gray-100 mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.userName || user?.username || "John Smith"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.userId || user?.email || ""}
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
