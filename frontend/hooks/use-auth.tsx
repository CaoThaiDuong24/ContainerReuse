"use client"

import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import { deleteCookie, setSharedCookie } from "@/lib/sso/cookies"
import { initCrossDomainLogoutListener, LOGOUT_FLAG_KEY } from "@/lib/sso/crossDomainLogoutListener"

const normalizeOrigin = (url?: string | null) => {
  if (!url) return null
  try {
    const normalized = new URL(url)
    normalized.pathname = ""
    normalized.search = ""
    normalized.hash = ""
    return normalized.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

const DEFAULT_HUB_ORIGIN = "https://hub1.ltacv.com"
const HUB_ORIGIN = normalizeOrigin(process.env.NEXT_PUBLIC_RCS_URL) ?? DEFAULT_HUB_ORIGIN

export interface User {
  id: string
  username: string
  email?: string
  role?: string
  accuserkey?: string // ID người dùng từ HRMS API
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: (options?: { skipRedirect?: boolean }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check auth state on app load
    try {
      if (typeof window !== "undefined") {
        const savedToken = localStorage.getItem("authToken")
        const savedUserStr = localStorage.getItem("user")

        if (savedToken && savedUserStr) {
          const savedUser = JSON.parse(savedUserStr)
          setToken(savedToken)
          setUser(savedUser)
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error("Error loading auth state:", error)
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", newToken)
        localStorage.setItem("user", JSON.stringify(newUser))
        // sync basic ids for downstream usage
        if (newUser.id) {
          localStorage.setItem("userId", newUser.id)
        }
        if (newUser.username) {
          localStorage.setItem("userName", newUser.username)
        }

        // Store shared cookies for cross-subdomain access (production only)
        if (process.env.NODE_ENV === "production") {
          setSharedCookie("authToken", newToken, 7, "/", true)
          setSharedCookie("user", JSON.stringify(newUser), 7, "/", true)
          if (newUser.id) {
            setSharedCookie("userId", newUser.id, 7, "/", true)
          }
          if (newUser.username) {
            setSharedCookie("userName", newUser.username, 7, "/", true)
          }
        }
      }
      setToken(newToken)
      setUser(newUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error saving auth state:", error)
    }
  }

  const broadcastLogout = useCallback(() => {
    if (typeof window === "undefined") return
    const flag = Date.now().toString()
    localStorage.setItem(LOGOUT_FLAG_KEY, flag)

    // Write shared cookie so Container Hub can detect even when our tab is closed
    setSharedCookie(LOGOUT_FLAG_KEY, flag, 1, "/", true)

    // Notify Container Hub via postMessage for real-time logout
    window.postMessage(
      {
        type: "CROSS_DOMAIN_LOGOUT",
        source: "cloud-yards",
      },
      HUB_ORIGIN,
    )
  }, [])

  const logout = useCallback(
    async (options?: { skipRedirect?: boolean }) => {
      try {
        const { AuthService } = await import("@/lib/authService")
        await AuthService.logout()
      } catch (error) {
        console.error("Error during logout:", error)
      } finally {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          localStorage.removeItem("userId")
          localStorage.removeItem("userName")
          broadcastLogout()
        }

        // Clear cookies across domains
        deleteCookie("authToken", "/", true)
        deleteCookie("user", "/", true)
        deleteCookie("currentUser", "/", true)
        deleteCookie("userId", "/", true)
        deleteCookie("userName", "/", true)
        deleteCookie(LOGOUT_FLAG_KEY, "/", true)

        setToken(null)
        setUser(null)
        setIsAuthenticated(false)

        if (!options?.skipRedirect) {
          router.push("/login")
        }
      }
    },
    [broadcastLogout, router],
  )

  useEffect(() => {
    // Initialize cross-domain logout listener
    const cleanup = initCrossDomainLogoutListener(() => {
      void logout()
    })

    return cleanup
  }, [logout])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}