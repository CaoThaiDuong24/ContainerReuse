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
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
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
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

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

      {/* Right Side - Gradient Background with Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a4d7a] via-[#0d2942] to-[#1a4d7a] relative overflow-hidden items-center justify-center">
        {/* Decorative diagonal lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full">
            {/* Upper diagonal stripe */}
            <div className="absolute top-0 right-0 w-[150%] h-40 bg-gradient-to-br from-[#2d6ba5]/30 to-transparent transform rotate-12 origin-top-right"></div>
            
            {/* Multiple curved lines */}
            <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <path d="M 800 0 Q 600 100 500 250 T 400 500 T 350 800" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="2" 
                    fill="none"/>
              <path d="M 800 50 Q 620 130 530 280 T 450 550 T 420 800" 
                    stroke="rgba(255,255,255,0.08)" 
                    strokeWidth="2" 
                    fill="none"/>
              <path d="M 800 100 Q 640 160 560 310 T 500 600 T 490 800" 
                    stroke="rgba(255,255,255,0.06)" 
                    strokeWidth="2" 
                    fill="none"/>
            </svg>

            {/* Bottom right accent */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#00D9A3]/10 to-transparent rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Logo */}
        <div className="relative z-10 text-right pr-20">
          <h1 className="text-8xl font-bold text-white tracking-wider">
            YOUR<br/>LOGO
          </h1>
        </div>
      </div>
    </div>
  )
}