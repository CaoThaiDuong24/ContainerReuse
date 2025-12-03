"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, AlertCircle, Container, Shield, TrendingUp, Users } from "lucide-react"

interface LoginResponse {
  token: string
  username: string
  accuserkey: string
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
      console.log("Sending login request with:", formData)
      
      // API yêu cầu format: { "user": "...", "password": "..." }
      const requestBody = {
        user: formData.username,
        password: formData.password
      }
      
      console.log("Request body:", JSON.stringify(requestBody))
      
      const response = await fetch("https://apiedepottest.gsotgroup.vn/api/Users/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody)
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)
      
      // Đọc response text trước để debug
      const responseText = await response.text()
      console.log("Response text:", responseText)
      
      // Parse JSON
      let data: LoginResponse
      try {
        data = JSON.parse(responseText)
        console.log("Parsed response data:", data)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        setError(`Lỗi phản hồi từ server: ${responseText}`)
        return
      }

      if (response.ok && data.token) {
        // Lưu token và user info vào localStorage
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify({
          id: data.accuserkey,
          username: data.username,
          accuserkey: data.accuserkey
        }))
        
        setSuccess(`Đăng nhập thành công! Chào mừng ${data.username}`)
        
        // Redirect sau 1.5 giây
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        const errorMsg = `Đăng nhập thất bại (${response.status}). ${responseText}`
        console.error("Login failed:", errorMsg)
        setError(errorMsg)
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error instanceof Error) {
        setError(`Lỗi: ${error.message}`)
      } else {
        setError("Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Logo & Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Container className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Container Management</h1>
          </div>
          <p className="text-blue-100 ml-15">Quản lý container hiện đại & hiệu quả</p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Giải pháp quản lý container<br />thông minh cho doanh nghiệp
            </h2>
            <p className="text-blue-100 text-lg">
              Tối ưu hóa quy trình vận hành, theo dõi thời gian thực và nâng cao hiệu quả kinh doanh
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Bảo mật tuyệt đối</h3>
                <p className="text-blue-100 text-sm">Mã hóa dữ liệu và xác thực đa lớp</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Phân tích thông minh</h3>
                <p className="text-blue-100 text-sm">Báo cáo chi tiết và dự đoán xu hướng</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Cộng tác nhóm</h3>
                <p className="text-blue-100 text-sm">Quản lý nhiều người dùng và phân quyền linh hoạt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-blue-100 text-sm">
          © 2025 Container Management System. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Container className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Container Management</h1>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">
                Chào mừng trở lại
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Đăng nhập để tiếp tục sử dụng hệ thống
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-200 bg-green-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                    Tên đăng nhập
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập của bạn"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    autoComplete="username"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Mật khẩu
                    </Label>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => {/* TODO: Implement forgot password */}}
                    >
                      Quên mật khẩu?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu của bạn"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="h-11 pr-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-slate-600 font-normal cursor-pointer"
                  >
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40"
                  disabled={loading || !formData.username || !formData.password}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      Đang xử lý...
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
                
                <div className="text-center text-sm text-slate-600">
                  Bạn chưa có tài khoản?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold"
                    onClick={() => router.push("/register")}
                    type="button"
                  >
                    Đăng ký ngay
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Hệ thống hỗ trợ 24/7 qua hotline: <span className="font-semibold text-slate-700">1900 xxxx</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}