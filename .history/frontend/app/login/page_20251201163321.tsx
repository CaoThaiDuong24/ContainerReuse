"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

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
    
    console.log("Form submitted:", formData)
    
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
        toast({
          variant: "destructive",
          title: "Lỗi phản hồi",
          description: `Lỗi phản hồi từ server: ${responseText}`
        })
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
        
        toast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng ${data.username}`,
          className: "bg-green-50 border-green-200 text-green-800"
        })
        
        // Redirect sau 1.5 giây
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        const errorMsg = `Đăng nhập thất bại (${response.status}). ${responseText}`
        console.error("Login failed:", errorMsg)
        toast({
          variant: "destructive",
          title: "Đăng nhập thất bại",
          description: errorMsg
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Lỗi kết nối",
          description: `Lỗi: ${error.message}`
        })
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi kết nối",
          description: "Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại."
        })
      }
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
      <div className="relative w-full max-w-[90vw] h-[90vh] rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20 backdrop-blur-sm flex">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-[#00D9A3]">Welcome to</span>
            </h1>
            <h2 className="text-5xl font-bold text-[#00D9A3]">
              Galaxy Page
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <User className="w-5 h-5 text-[#00D9A3]" />
              </div>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                className="h-14 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-[#00D9A3] focus:ring-2 focus:ring-[#00D9A3]/20 text-base transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Lock className="w-5 h-5 text-[#00D9A3]" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="h-14 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-[#00D9A3] focus:ring-2 focus:ring-[#00D9A3]/20 text-base transition-all"
                required
              />
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                  className="border-[#00D9A3] data-[state=checked]:bg-[#00D9A3] data-[state=checked]:border-[#00D9A3]"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer font-normal"
                >
                  Remember
                </Label>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-sm text-gray-500 hover:text-[#00D9A3] transition-colors"
                type="button"
                disabled={loading}
              >
                Forgot you password?
              </Button>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-14 bg-[#00D9A3] hover:bg-[#00C090] text-white rounded-full text-lg font-semibold shadow-lg shadow-[#00D9A3]/30 hover:shadow-xl hover:shadow-[#00D9A3]/40 transition-all hover:scale-[1.02]"
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-5 w-5" />
                  Login...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Gradient Background with Logo & 3D Effects */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a4d7a] via-[#0d2942] to-[#0a1f35] relative overflow-hidden items-center justify-center">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#00D9A3]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* 3D Geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large diagonal stripe with 3D effect */}
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-white/5 to-transparent transform rotate-45 shadow-2xl backdrop-blur-sm"></div>
          
          {/* Floating 3D cards */}
          <div className="absolute top-1/4 right-32 w-48 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-700 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D9A3]/20 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="absolute top-1/2 right-20 w-56 h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-700 animate-float-delayed">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="absolute bottom-1/4 right-40 w-40 h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl transform rotate-45 hover:rotate-90 transition-transform duration-700 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Curved lines with glow */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D9A3" stopOpacity="0.6"/>
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path d="M 800 0 Q 650 150 550 300 T 400 600 L 400 800" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="3" 
                  fill="none"
                  filter="url(#glow)"
                  className="animate-draw"/>
            <path d="M 800 100 Q 700 200 600 350 T 500 650 L 500 800" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="2" 
                  fill="none"
                  filter="url(#glow)"
                  opacity="0.6"/>
          </svg>

          {/* Dotted pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Logo with 3D effect */}
        <div className="relative z-10 text-right pr-20">
          <div className="relative inline-block">
            {/* Shadow layers for 3D effect */}
            <h1 className="absolute text-8xl font-bold tracking-wider text-[#00D9A3]/30 blur-sm transform translate-x-2 translate-y-2">
              YOUR<br/>LOGO
            </h1>
            <h1 className="absolute text-8xl font-bold tracking-wider text-blue-400/20 blur-md transform translate-x-4 translate-y-4">
              YOUR<br/>LOGO
            </h1>
            {/* Main text with gradient */}
            <h1 className="relative text-8xl font-bold tracking-wider bg-gradient-to-br from-white via-blue-100 to-[#00D9A3] bg-clip-text text-transparent drop-shadow-2xl">
              YOUR<br/>LOGO
            </h1>
          </div>
          
          {/* Decorative subtitle */}
          <p className="mt-6 text-xl text-white/70 font-light tracking-wide">
            Galaxy Experience
          </p>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-particle"
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
  )
}