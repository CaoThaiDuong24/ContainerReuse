"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"

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
    
    if (!formData.username || !formData.password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu")
      return
    }

    setLoading(true)
    setError("")

    try {
      const requestBody = {
        user: formData.username,
        password: formData.password
      }
      
      const response = await fetch("https://apiedepottest.gsotgroup.vn/api/Users/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody)
      })
      
      const responseText = await response.text()
      
      let data: LoginResponse
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        setError(`Lỗi phản hồi từ server: ${responseText}`)
        return
      }

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify({
          id: data.accuserkey,
          username: data.username,
          accuserkey: data.accuserkey
        }))
        
        setSuccess(`Đăng nhập thành công! Chào mừng ${data.username}`)
        
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        const errorMsg = `Đăng nhập thất bại (${response.status}). ${responseText}`
        setError(errorMsg)
      }
    } catch (error) {
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
      {/* Left Side - Green Background with Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2d7a5f] relative overflow-hidden">
        {/* Decorative white curve at bottom left */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center p-16 text-white w-full">
          {/* Logo and Brand at Top */}
          <div className="flex flex-col items-center mb-auto pt-12">
            {/* Logo Circle */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
              <svg className="w-10 h-10 text-[#2d7a5f]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </div>
            
            {/* Brand Name */}
            <h1 className="text-xl font-semibold">fourinone</h1>
          </div>
          
          {/* Center Content */}
          <div className="flex flex-col items-center text-center mb-auto">
            <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-white/95 text-base leading-relaxed mb-10 max-w-sm">
              To stay connected with us<br />
              please login with your personal<br />
              information by username and<br />
              password 🔐
            </p>
            
            {/* Sign In Button */}
            <button className="px-16 py-3 bg-transparent border-2 border-white rounded-full text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200 uppercase tracking-wide">
              SIGN IN
            </button>
          </div>
          
          {/* Footer Text */}
          <div className="flex items-center gap-2 text-white text-sm mb-8">
            <span>Create By</span>
            <span className="font-semibold">Hùng Cường</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md px-4">
          {/* Welcome Text */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">welcome</h2>
            <p className="text-gray-400 text-xs">Log in by entering information below</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 bg-green-50 mb-4">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-[#b5e7d8] text-sm font-medium mb-2">Email</label>
              <Input
                name="username"
                type="text"
                placeholder=""
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full h-12 px-5 bg-[#d4f4e8]/50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent text-gray-700 text-sm"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[#b5e7d8] text-sm font-medium mb-2">Password</label>
              <Input
                name="password"
                type="password"
                placeholder=""
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full h-12 px-5 bg-[#d4f4e8]/50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent text-gray-700 text-sm"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-center pt-2">
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <div className="pt-3">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[#4ade80] to-[#22c55e] hover:from-[#22c55e] hover:to-[#16a34a] text-white font-bold rounded-lg shadow-md transition-all duration-200 uppercase tracking-wide text-xs"
                disabled={loading || !formData.username || !formData.password}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  "LOG IN"
                )}
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-xs text-gray-500 pt-4">
              Don't have an account?{" "}
              <a href="#" className="text-gray-700 hover:text-gray-900 font-semibold underline transition-colors">
                Create your account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}