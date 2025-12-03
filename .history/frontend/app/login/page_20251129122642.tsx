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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="text-4xl font-bold mb-4">fourinone</h1>
          
          {/* Tagline */}
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-3">Welcome Back!</h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              To stay connected with us<br />
              please login with your personal<br />
              information by username and<br />
              password 🔐
            </p>
          </div>
          
          {/* Sign In Button */}
          <button className="mt-10 px-12 py-3 bg-transparent border-2 border-white rounded-full text-white font-medium hover:bg-white/10 transition-all duration-200">
            SIGN IN
          </button>
          
          {/* Footer Text */}
          <div className="mt-auto pt-12 flex items-center gap-2 text-emerald-100 text-sm">
            <span>Create By</span>
            <span className="font-semibold">Hùng Cường</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">welcome</h2>
            <p className="text-gray-500">Log in by entering information below</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full h-12 px-4 bg-emerald-50 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400"
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
                className="w-full h-12 px-4 bg-emerald-50 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
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
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Create your account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}