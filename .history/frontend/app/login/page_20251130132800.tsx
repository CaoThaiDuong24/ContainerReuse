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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
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
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-8 px-8">
              {/* Logo & Brand */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Container className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-white text-2xl font-bold tracking-tight">Container Manager</h1>
                    <p className="text-blue-200 text-sm">Enterprise Solution</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-white text-5xl font-bold leading-tight">
                    Quản lý<br />
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Container
                    </span><br />
                    Thông minh
                  </h2>
                  <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                    Giải pháp toàn diện cho doanh nghiệp logistics hiện đại
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Real-time Tracking</h3>
                  <p className="text-blue-200 text-sm">Theo dõi liên tục 24/7</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Smart Logistics</h3>
                  <p className="text-blue-200 text-sm">Tối ưu vận chuyển</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Analytics</h3>
                  <p className="text-blue-200 text-sm">Báo cáo chi tiết</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Security</h3>
                  <p className="text-blue-200 text-sm">Bảo mật tối đa</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">5000+</div>
                  <div className="text-blue-200 text-sm">Containers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">50+</div>
                  <div className="text-blue-200 text-sm">Depots</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">99.9%</div>
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

              <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-black/20">
                <CardHeader className="space-y-2 pb-6">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Đăng nhập
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600">
                    Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-5">
                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm animate-in slide-in-from-top-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert className="border-green-200 bg-green-50/80 backdrop-blur-sm animate-in slide-in-from-top-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
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
                        className="h-12 bg-white border-slate-200 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
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
                          className="h-12 bg-white border-slate-200 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-10 w-10 hover:bg-slate-100 rounded-lg transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                          tabIndex={-1}
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
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          disabled={loading}
                          className="border-slate-300"
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
                        className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-base font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                      disabled={loading || !formData.username || !formData.password}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Spinner className="h-5 w-5" />
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
                        <span className="bg-white px-3 text-slate-500 font-medium">hoặc tiếp tục với</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        GitHub
                      </Button>
                    </div>

                    <div className="text-center text-sm text-slate-600 pt-2">
                      Chưa có tài khoản?{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold"
                        onClick={() => router.push("/register")}
                        type="button"
                        disabled={loading}
                      >
                        Đăng ký miễn phí
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Card>

              <p className="text-center text-xs text-blue-100 mt-6">
                Bằng việc đăng nhập, bạn đồng ý với{" "}
                <a href="#" className="text-white hover:underline font-medium">Điều khoản</a>
                {" "}và{" "}
                <a href="#" className="text-white hover:underline font-medium">Chính sách bảo mật</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}