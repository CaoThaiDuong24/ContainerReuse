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
      // Clear old auth data trước khi login
      AuthService.clearAuthData()
      
      const data = await AuthService.login(formData)
      
      // Đảm bảo clear lại một lần nữa trước khi save data mới
      AuthService.clearAuthData()
      
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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-50 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container - Modal Style */}
      <div className="relative w-[90vw] h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 backdrop-blur-sm flex bg-white">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-y-auto">
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
        
        {/* 3D Geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating 3D cubes */}
          <div className="absolute top-1/4 right-24 w-32 h-32 animate-float">
            <div className="relative w-full h-full transform-gpu perspective-1000" style={{ transform: 'rotateX(45deg) rotateZ(45deg)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 rounded-lg shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-400/20 to-transparent rounded-lg transform translate-x-2 translate-y-2"></div>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-16 w-40 h-40 animate-float-delayed">
            <div className="relative w-full h-full transform-gpu" style={{ transform: 'rotateX(-30deg) rotateY(30deg)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/25 rounded-2xl shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-2xl transform -translate-x-2 translate-y-2"></div>
            </div>
          </div>
          
          <div className="absolute bottom-1/4 right-32 w-28 h-28 animate-float">
            <div className="relative w-full h-full transform-gpu" style={{ transform: 'rotateY(60deg) rotateX(-45deg)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 rounded-xl shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-xl transform translate-x-3 -translate-y-2"></div>
            </div>
          </div>

          {/* Digital grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'center center'
            }}></div>
          </div>

          {/* Animated tech lines */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
              </linearGradient>
              <filter id="techGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Animated circuit-like paths */}
            <path d="M 0 100 L 150 100 L 150 200 L 300 200" 
                  stroke="url(#techGradient)" 
                  strokeWidth="2" 
                  fill="none"
                  filter="url(#techGlow)"
                  className="animate-draw-line"/>
            <path d="M 400 50 L 500 50 L 500 150 L 650 150" 
                  stroke="url(#techGradient)" 
                  strokeWidth="2" 
                  fill="none"
                  filter="url(#techGlow)"
                  className="animate-draw-line-delayed"/>
            <path d="M 200 400 L 300 400 L 300 500 L 450 500" 
                  stroke="url(#techGradient)" 
                  strokeWidth="2" 
                  fill="none"
                  filter="url(#techGlow)"
                  className="animate-draw-line"/>
            
            {/* Tech circles */}
            <circle cx="150" cy="100" r="5" fill="white" opacity="0.6" className="animate-pulse-slow"/>
            <circle cx="300" cy="200" r="5" fill="white" opacity="0.6" className="animate-pulse-slow" style={{animationDelay: '0.5s'}}/>
            <circle cx="500" cy="50" r="5" fill="white" opacity="0.6" className="animate-pulse-slow" style={{animationDelay: '1s'}}/>
          </svg>

          {/* Hexagon pattern */}
          <div className="absolute top-10 left-10 w-24 h-24 opacity-30 animate-spin-slow">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" 
                       fill="none" 
                       stroke="white" 
                       strokeWidth="2"
                       opacity="0.5"/>
              <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" 
                       fill="none" 
                       stroke="white" 
                       strokeWidth="1.5"
                       opacity="0.7"/>
            </svg>
          </div>

          <div className="absolute bottom-20 left-1/4 w-20 h-20 opacity-25 animate-spin-slow" style={{animationDelay: '2s'}}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" 
                       fill="none" 
                       stroke="white" 
                       strokeWidth="2"
                       opacity="0.6"/>
            </svg>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 border-[40px] border-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 border-[30px] border-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <div className="relative inline-block mb-8">
            {/* Container icon with 3D shadow effect */}
            <div className="w-40 h-40 mx-auto mb-8 relative group">
              {/* 3D layers */}
              <div className="absolute inset-0 bg-white/30 rounded-3xl transform rotate-6 translate-x-2 translate-y-2 group-hover:rotate-12 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-white/20 rounded-3xl transform rotate-3 translate-x-1 translate-y-1 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-white/40 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/50 group-hover:scale-105 transition-transform duration-500">
                {/* Container/Box 3D icon */}
                <svg className="w-24 h-24 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {/* Tech dots around icon */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
            
            {/* Main text with 3D effect */}
            <div className="relative">
              <h1 className="absolute text-5xl font-bold text-white/20 blur-sm transform translate-x-1 translate-y-1">
                Hệ Thống<br/>Quản Lý Container
              </h1>
              <h1 className="relative text-5xl font-bold text-white leading-tight drop-shadow-2xl">
                Hệ Thống<br/>Quản Lý Container
              </h1>
            </div>
          </div>
          
          {/* Features list with tech style */}
          <div className="space-y-4 text-white/95 text-left max-w-sm mx-auto">
            <div className="flex items-start gap-3 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:blur-md transition-all"></div>
                <svg className="relative w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-medium">Theo dõi container thời gian thực</span>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:blur-md transition-all"></div>
                <svg className="relative w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-medium">Quản lý depot hiệu quả</span>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:blur-md transition-all"></div>
                <svg className="relative w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-medium">Báo cáo chi tiết & thống kê</span>
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
              opacity: 0.5;
              transform: scale(1);
            }
            50% { 
              opacity: 0.8;
              transform: scale(1.05);
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
          
          @keyframes draw-line {
            0% {
              stroke-dasharray: 300;
              stroke-dashoffset: 300;
            }
            100% {
              stroke-dasharray: 300;
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          
          .animate-particle {
            animation: particle linear infinite;
          }
          
          .animate-draw-line {
            animation: draw-line 4s ease-in-out infinite;
          }
          
          .animate-draw-line-delayed {
            animation: draw-line 4s ease-in-out infinite 2s;
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}</style>
      </div>
      </div>
      </div>
    </>
  )
}