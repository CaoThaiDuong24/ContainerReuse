"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  username: string
  email: string
  role: string
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check auth state on app load
    try {
      const savedToken = localStorage.getItem("authToken")
      const savedUserStr = localStorage.getItem("user")
      
      if (savedToken && savedUserStr) {
        const savedUser = JSON.parse(savedUserStr)
        setToken(savedToken)
        setUser(savedUser)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Error loading auth state:", error)
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    try {
      localStorage.setItem("authToken", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error saving auth state:", error)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const value = {
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}