"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

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
        // Lưu token vào localStorage
        localStorage.setItem("authToken", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        
        setSuccess(`Đăng nhập thành công! Chào mừng ${data.data.user.username}`)
        
        // Redirect sau 1.5 giây
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
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
          <CardTitle className="text-2xl font-bold text-slate-900">
            Đăng nhập
          </CardTitle>
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
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </Button>
            
            <div className="text-center text-sm text-slate-600">
              Bạn chưa có tài khoản?{" "}
              <Button 
                variant="link" 
                className="p-0 text-blue-600 hover:text-blue-700"
                onClick={() => router.push("/register")}
                type="button"
              >
                Đăng ký ngay
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}