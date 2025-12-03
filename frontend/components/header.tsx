"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User } from "lucide-react"

interface UserData {
  id: string
  username: string
  email: string
  role: string
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
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
      }
    } catch (error) {
      console.error("Error loading auth state:", error)
    }
  }, [])

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">▢</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">Container Reuse</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
              Tính năng
            </a>
            <a href="#benefits" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
              Lợi ích
            </a>
            <a href="#stats" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
              Thống kê
            </a>
            <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
              Liên hệ
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <User className="h-4 w-4" />
                  <span>Xin chào, {user?.username}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Bắt đầu
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-3">
            <a href="#features" className="block text-foreground/70 hover:text-foreground text-sm py-2">
              Tính năng
            </a>
            <a href="#benefits" className="block text-foreground/70 hover:text-foreground text-sm py-2">
              Lợi ích
            </a>
            <a href="#stats" className="block text-foreground/70 hover:text-foreground text-sm py-2">
              Thống kê
            </a>
            <a href="#contact" className="block text-foreground/70 hover:text-foreground text-sm py-2">
              Liên hệ
            </a>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Đăng nhập
              </Button>
              <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                Bắt đầu
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
