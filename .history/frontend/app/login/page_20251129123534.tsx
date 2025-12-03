"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, AlertCircle, Container, Package, TrendingUp, Shield, CheckCircle2 } from "lucide-react"

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
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Logo & Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Container className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ContainerHub</h1>
              <p className="text-blue-100 text-sm">Depot Management System</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Quản lý container<br />thông minh và hiệu quả
            </h2>
            <p className="text-blue-100 text-lg">
              Giải pháp toàn diện cho việc quản lý kho container, theo dõi logistics và tối ưu hóa vận hành.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Theo dõi thời gian thực</h3>
                <p className="text-blue-100 text-sm">Giám sát vị trí và trạng thái container mọi lúc mọi nơi</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Báo cáo chi tiết</h3>
                <p className="text-blue-100 text-sm">Phân tích dữ liệu và tạo báo cáo tự động</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Bảo mật cao</h3>
                <p className="text-blue-100 text-sm">Mã hóa dữ liệu và xác thực đa lớp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-blue-100 text-sm">
          © 2025 ContainerHub. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Container className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">ContainerHub</h1>
              <p className="text-slate-600 text-xs">Depot Management</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Đăng nhập
              </h2>
              <p className="text-slate-600">
                Nhập thông tin tài khoản để tiếp tục
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
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
                  className="h-11 px-4 bg-slate-50 border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Mật khẩu
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="h-11 px-4 pr-11 bg-slate-50 border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0 hover:bg-slate-100 rounded-lg transition-colors"
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

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-700 cursor-pointer select-none">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                disabled={loading || !formData.username || !formData.password}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">hoặc</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <span className="text-sm text-slate-600">Bạn chưa có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
              {" "}và{" "}
              <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}