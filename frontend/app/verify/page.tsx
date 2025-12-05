"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

const RCS_BASE_URL =
  process.env.NEXT_PUBLIC_RCS_URL || "https://hub1.ltacv.com"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const [redirectUrl, setRedirectUrl] = useState<string>("")

  useEffect(() => {
    // Get redirectUrl from query params or use current dashboard URL
    const redirectUrlParam = searchParams.get("redirectUrl")
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : ""
    const defaultRedirectUrl = `${currentOrigin}/dashboard`
    
    setRedirectUrl(redirectUrlParam || defaultRedirectUrl)
  }, [searchParams])

  const handleRetry = () => {
    // Build RCS login URL with redirectUrl
    const baseUrl = RCS_BASE_URL.replace(/\/$/, "") // Remove trailing slash if exists
    const rcsLoginUrl = `${baseUrl}/login?redirectUrl=${encodeURIComponent(redirectUrl)}`

    // Redirect to RCS login
    if (typeof window !== "undefined") {
      window.location.href = rcsLoginUrl
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Xác thực thất bại
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Token của bạn không hợp lệ hoặc đã hết hạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">
              Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
            </p>
          </div>
          
          <Button
            onClick={handleRetry}
            className="w-full bg-[#00D9A3] hover:bg-[#00C090] text-white font-semibold h-12 text-base"
            size="lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

