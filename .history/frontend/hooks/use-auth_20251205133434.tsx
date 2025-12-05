"use client"

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  logout: () => void
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
      }
      setToken(newToken)
      setUser(newUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error saving auth state:", error)
    }
  }

  const logout = async () => {
    try {
      // Gọi AuthService để xử lý logout
      const { AuthService } = await import("@/lib/authService")
      await AuthService.logout()
      
      // Clear state
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      
      // Redirect về login
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      // Vẫn xóa dữ liệu local dù có lỗi
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    }
  }

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