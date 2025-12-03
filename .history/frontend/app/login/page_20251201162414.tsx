"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, Container, Truck, BarChart3, Shield, CheckCircle2, LogIn } from "lucide-react"

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
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    // Check for remembered credentials
    const savedUsername = localStorage.getItem("rememberedUsername")
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }))
      setRememberMe(true)
    }
  }, [])

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
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Sending login request with:", formData)
      
      // API yêu cầu format: { "user": "...", "password": "..." }
      const requestBody = {
        user: formData.username,
        password: formData.password
      }
      
      console.log("Request body:", JSON.stringify(requestBody))
      
      const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL || 'https://apiedepottest.gsotgroup.vn'
      const response = await fetch(`${apiUrl}/api/Users/Login`, {
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
        setError("Lỗi phản hồi từ server. Vui lòng thử lại sau.")
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
        
        // Save username if remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", data.username)
        } else {
          localStorage.removeItem("rememberedUsername")
        }
        
        setSuccess(`Đăng nhập thành công! Chào mừng ${data.username}`)
        
        // Redirect sau 1 giây
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        const errorMsg = response.status === 401 
          ? "Tên đăng nhập hoặc mật khẩu không chính xác"
          : "Đăng nhập thất bại. Vui lòng thử lại sau."
        console.error("Login failed:", errorMsg)
        setError(errorMsg)
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error instanceof Error) {
        setError("Lỗi kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-10 px-4 lg:px-8">
              {/* Logo & Brand */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Container className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-white text-2xl font-bold tracking-tight">Container Manager</h1>
                    <p className="text-blue-200 text-sm">Enterprise Solution</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <h2 className="text-white text-5xl lg:text-6xl font-bold leading-tight">
                    Quản lý<br />
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Container
                    </span><br />
                    Thông minh
                  </h2>
                  <p className="text-blue-100/90 text-lg leading-relaxed max-w-md">
                    Giải pháp toàn diện cho doanh nghiệp logistics hiện đại, tối ưu hóa quy trình quản lý container
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Real-time Tracking</h3>
                  <p className="text-blue-200 text-sm">Theo dõi liên tục 24/7</p>
                </div>

                <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Smart Logistics</h3>
                  <p className="text-blue-200 text-sm">Tối ưu vận chuyển</p>
                </div>

                <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Analytics</h3>
                  <p className="text-blue-200 text-sm">Báo cáo chi tiết</p>
                </div>

                <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Security</h3>
                  <p className="text-blue-200 text-sm">Bảo mật tối đa</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-10 pt-2">
                <div className="group">
                  <div className="text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">5000+</div>
                  <div className="text-blue-200 text-sm">Containers</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">50+</div>
                  <div className="text-blue-200 text-sm">Depots</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">99.9%</div>
                  <div className="text-blue-200 text-sm">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl">
                  <Container className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-2xl font-bold">Container Manager</h1>
                  <p className="text-blue-200 text-sm">Enterprise Solution</p>
                </div>
              </div>

              <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-black/20 overflow-hidden">
                <CardHeader className="space-y-2 pb-6 px-6 pt-8 sm:px-8">
                  <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Đăng nhập
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600">
                    Nhập thông tin để truy cập hệ thống
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-5 px-6 sm:px-8">
                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert className="border-green-200 bg-green-50/80 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 text-sm">{success}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="username" className="text-slate-700 font-semibold text-sm">
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
                        autoComplete="username"
                        autoFocus
                        className="h-12 bg-white border-slate-200 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        required
                        aria-label="Tên đăng nhập"
                        aria-required="true"
                      />
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">
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
                          autoComplete="current-password"
                          className="h-12 bg-white border-slate-200 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                          required
                          aria-label="Mật khẩu"
                          aria-required="true"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-10 w-10 hover:bg-slate-100 rounded-lg transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                          tabIndex={-1}
                          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2.5">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          disabled={loading}
                          className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          aria-label="Ghi nhớ đăng nhập"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-slate-600 cursor-pointer font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Ghi nhớ tài khoản
                        </Label>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        type="button"
                        disabled={loading}
                        tabIndex={0}
                      >
                        Quên mật khẩu?
                      </Button>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 px-6 sm:px-8">
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-base font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={loading || !formData.username || !formData.password}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2.5">
                          <Spinner className="h-5 w-5" />
                          <span>Đang đăng nhập...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <LogIn className="h-5 w-5" />
                          <span>Đăng nhập</span>
                        </div>
                      )}
                    </Button>

                    <div className="text-center text-sm text-slate-600 pt-2">
                      Chưa có tài khoản?{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold hover:underline"
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

              <p className="text-center text-xs text-blue-100/80 mt-6 max-w-sm mx-auto leading-relaxed">
                Bằng việc đăng nhập, bạn đồng ý với{" "}
                <a href="#" className="text-white hover:underline font-medium transition-colors">Điều khoản sử dụng</a>
                {" "}và{" "}
                <a href="#" className="text-white hover:underline font-medium transition-colors">Chính sách bảo mật</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}