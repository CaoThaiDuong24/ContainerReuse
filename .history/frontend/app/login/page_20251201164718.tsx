"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AuthService } from "@/lib/authService"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      toast({
        variant: "destructive",
        title: "Lỗi đăng nhập",
        description: "Vui lòng nhập tên đăng nhập và mật khẩu"
      })
      return
    }

    setLoading(true)

    try {
      const data = await AuthService.login(formData)
      
      // Lưu token và user info vào localStorage
      AuthService.saveAuthData(data)
      
      toast({
        title: "Đăng nhập thành công!",
        description: `Chào mừng ${data.username}`,
        className: "bg-green-50 border-green-200 text-green-800"
      })
      
      // Redirect sau 1.5 giây
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Login error:", error)
      
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: error instanceof Error ? error.message : "Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Container - Modal Style */}
      <div className="relative w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm flex bg-white">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">
              Đăng nhập
            </h1>
            <p className="text-gray-600 text-base">
              Hệ thống quản lý container thông minh
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Tên đăng nhập
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-12 pl-11 pr-4 rounded-lg border-gray-300 focus:border-[#00D9A3] focus:ring-2 focus:ring-[#00D9A3]/20 text-base transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-12 pl-11 pr-4 rounded-lg border-gray-300 focus:border-[#00D9A3] focus:ring-2 focus:ring-[#00D9A3]/20 text-base transition-all"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                  className="border-gray-300 data-[state=checked]:bg-[#00D9A3] data-[state=checked]:border-[#00D9A3]"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer font-normal select-none"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-sm text-[#00D9A3] hover:text-[#00C090] font-medium transition-colors"
                type="button"
                disabled={loading}
              >
                Quên mật khẩu?
              </Button>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#00D9A3] hover:bg-[#00C090] text-white rounded-lg text-base font-semibold shadow-lg shadow-[#00D9A3]/20 hover:shadow-xl hover:shadow-[#00D9A3]/30 transition-all hover:scale-[1.01] mt-6"
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-5 w-5" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* Info text */}
            <p className="text-center text-sm text-gray-500">
              Liên hệ quản trị viên nếu bạn cần hỗ trợ
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Gradient Background with Logo & 3D Effects */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00D9A3] via-[#00B88A] to-[#009B74] relative overflow-hidden items-center justify-center">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 border-[40px] border-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 border-[30px] border-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <div className="relative inline-block mb-8">
            {/* Container icon with shadow effect */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-6 animate-pulse-slow"></div>
              <div className="absolute inset-0 bg-white/30 rounded-2xl flex items-center justify-center">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            
            {/* Main text */}
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Hệ Thống<br/>Quản Lý Container
            </h1>
          </div>
          
          {/* Features list */}
          <div className="space-y-4 text-white/90 text-left max-w-sm mx-auto">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-base">Theo dõi container thời gian thực</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-base">Quản lý depot hiệu quả</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-base">Báo cáo chi tiết & thống kê</span>
            </div>
          </div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            33% { 
              transform: translateY(-20px) translateX(-10px) rotate(5deg);
            }
            66% { 
              transform: translateY(-10px) translateX(10px) rotate(-5deg);
            }
          }
          
          @keyframes float-delayed {
            0%, 100% { 
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            33% { 
              transform: translateY(15px) translateX(15px) rotate(-3deg);
            }
            66% { 
              transform: translateY(-15px) translateX(-15px) rotate(3deg);
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% { 
              opacity: 0.3;
              transform: scale(1);
            }
            50% { 
              opacity: 0.6;
              transform: scale(1.1);
            }
          }
          
          @keyframes particle {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) translateX(20px);
              opacity: 0;
            }
          }
          
          @keyframes draw {
            0% {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
            }
            100% {
              stroke-dasharray: 1000;
              stroke-dashoffset: 0;
            }
          }
          
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 10s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 6s ease-in-out infinite;
          }
          
          .animate-particle {
            animation: particle linear infinite;
          }
          
          .animate-draw {
            animation: draw 3s ease-in-out infinite alternate;
          }
        `}</style>
      </div>
      </div>
      </div>
    </>
  )
}