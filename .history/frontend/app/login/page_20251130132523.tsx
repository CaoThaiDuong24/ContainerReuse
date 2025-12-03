"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, Container, Truck, BarChart3, Shield, CheckCircle2 } from "lucide-react"

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
  const [rememberMe, setRememberMe] = useState(false)
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
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Container className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Container Manager</h1>
              <p className="text-blue-100 text-sm">Quản lý container thông minh</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-white text-3xl font-bold mb-8">
              Giải pháp quản lý<br />container toàn diện
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Theo dõi real-time</h3>
                  <p className="text-blue-100 text-sm">Cập nhật trạng thái container liên tục từ depot</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Quản lý logistics</h3>
                  <p className="text-blue-100 text-sm">Tối ưu hóa vận chuyển và phân phối container</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Báo cáo chi tiết</h3>
                  <p className="text-blue-100 text-sm">Phân tích dữ liệu và báo cáo thống kê</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Bảo mật cao</h3>
                  <p className="text-blue-100 text-sm">Mã hóa dữ liệu và quản lý truy cập an toàn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-blue-100 text-sm">
            © 2025 Container Manager. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Container className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 text-2xl font-bold">Container Manager</h1>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-slate-900">
                Đăng nhập
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Nhập thông tin tài khoản để tiếp tục
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="mb-4 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 font-medium">
                    Tên đăng nhập
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="h-11 pr-10 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={loading}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-slate-600 cursor-pointer font-normal"
                    >
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700"
                    type="button"
                    disabled={loading}
                  >
                    Quên mật khẩu?
                  </Button>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-all text-base font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
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
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">hoặc</span>
                  </div>
                </div>

                <div className="text-center text-sm text-slate-600">
                  Bạn chưa có tài khoản?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold"
                    onClick={() => router.push("/register")}
                    type="button"
                    disabled={loading}
                  >
                    Đăng ký ngay
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>

          <p className="text-center text-xs text-slate-500 mt-6">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
            {" "}và{" "}
            <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </div>
  )
}