"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

interface LoginResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: {
      id: string
      username: string
      email: string
      role: string
    }
  }
}

export default function SimpleLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("Form submitted:", formData)
    
    if (!formData.username || !formData.password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Sending login request...")
      
      const response = await fetch("https://apiedepottest.gsotgroup.vn/api/Users/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      console.log("Response status:", response.status)
      
      const data: LoginResponse = await response.json()
      console.log("Response data:", data)

      if (response.ok && data.success && data.data) {
        setSuccess(`Đăng nhập thành công! Chào mừng ${data.data.user.username}`)
        console.log("Login successful:", data.data)
      } else {
        setError(data.message || "Đăng nhập thất bại. Vui lòng thử lại.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">▢</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            Đăng nhập
          </div>
          <CardDescription className="text-slate-600">
            Nhập thông tin tài khoản của bạn để tiếp tục
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                className="transition-colors focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="pr-10 transition-colors focus:border-blue-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            
            <div className="text-center text-sm text-slate-600 mt-4">
              Test API: https://apiedepottest.gsotgroup.vn/api/Users/Login
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}