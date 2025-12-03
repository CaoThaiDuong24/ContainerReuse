"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { User, getAuthState, clearAuthState } from "@/lib/auth"

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
    const authState = getAuthState()
    setUser(authState.user)
    setToken(authState.token)
    setIsAuthenticated(authState.isAuthenticated)
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("authToken", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
  }

  const logout = () => {
    clearAuthState()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}