"use client"

import { useEffect } from "react"

const RCS_BASE_URL =
  process.env.NEXT_PUBLIC_RCS_URL || "https://hub1.ltacv.com"

export default function LogoutPage() {
  useEffect(() => {
    // Clear all tokens from localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")

    // Clear cookies
    if (typeof document !== "undefined") {
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }

    // Get current origin (e.g., http://localhost:3001)
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : ""
    const redirectUrl = `${currentOrigin}/dashboard`

    // Build RCS logout URL with redirectUrl
    const baseUrl = RCS_BASE_URL.replace(/\/$/, "") // Remove trailing slash if exists
    const rcsLogoutUrl = `${baseUrl}/logout?redirectUrl=${encodeURIComponent(redirectUrl)}`

    // Redirect to RCS logout
    if (typeof window !== "undefined") {
      window.location.href = rcsLogoutUrl
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang đăng xuất...</h1>
        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  )
}

