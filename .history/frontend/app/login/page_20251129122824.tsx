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
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          {/* Logo and Brand Name at Top */}
          <div className="flex flex-col items-center mb-16">
            {/* Brand Name */}
            <h1 className="text-xl font-semibold mb-4">fourinone</h1>
            
            {/* Logo Circle */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-[#2d7a5f]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </div>
          </div>
          
          {/* Tagline */}
          <div className="text-center max-w-md mb-8">
            <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-white/90 text-base leading-relaxed">
              To stay connected with us<br />
              please login with your personal<br />
              information by username and<br />
              password 🔐
            </p>
          </div>
          
          {/* Sign In Button */}
          <button className="mt-6 px-16 py-3 bg-transparent border-2 border-white rounded-full text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200 uppercase tracking-wide">
            SIGN IN
          </button>
          
          {/* Footer Text */}
          <div className="mt-auto pt-12 flex items-center gap-2 text-white/80 text-sm">
            <span>Create By</span>
            <span className="font-semibold">Hùng Cường</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">welcome</h2>
            <p className="text-gray-500 text-sm">Log in by entering information below</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Username Input */}
            <div>
              <Input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full h-14 px-5 bg-[#d4f4e8] border-[#d4f4e8] rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder:text-gray-500 text-gray-700"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full h-14 px-5 bg-[#d4f4e8] border-[#d4f4e8] rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder:text-gray-500 text-gray-700"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right -mt-2">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-14 bg-[#4ade80] hover:bg-[#3bc76a] text-white font-semibold rounded-xl shadow-sm transition-all duration-200 uppercase tracking-wide text-sm mt-6"
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

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-500 pt-2">
              Don't have an account?{" "}
              <a href="#" className="text-emerald-500 hover:text-emerald-600 font-semibold">
                Create your account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}