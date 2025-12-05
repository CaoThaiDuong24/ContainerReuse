import { NextResponse, type NextRequest } from "next/server"

// URL đích khi token trống hoặc không hợp lệ
// Cấu hình trong .env: NEXT_PUBLIC_HUB_REDIRECT_URL=https://hub1.ltacv.com/
const HUB_REDIRECT_URL =
  process.env.NEXT_PUBLIC_HUB_REDIRECT_URL || "https://hub1.ltacv.com/"

const decodeValue = (value: string | null) => {
  if (!value) return null
  try {
    return decodeURIComponent(value.replace(/\+/g, " "))
  } catch {
    return value
  }
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request

  // Chỉ xử lý logic token cho trang root "/"
  if (nextUrl.pathname === "/") {
    const token = nextUrl.searchParams.get("token")
    const userId = decodeValue(nextUrl.searchParams.get("userId"))
    const userName = decodeValue(nextUrl.searchParams.get("userName"))

    // Case 2: Có query ?token= nhưng value trống -> redirect về HUB
    if (token !== null && token.trim() === "") {
      return NextResponse.redirect(HUB_REDIRECT_URL)
    }

    // Case 1: Có token hợp lệ -> set cookie và redirect vào dashboard
    if (token && token.trim().length > 0) {
      const response = NextResponse.redirect(new URL("/dashboard", nextUrl))

      // Lưu token vào cookie (để phía client copy sang localStorage)
      response.cookies.set("authToken", token, {
        httpOnly: false, // cần đọc được từ client để đồng bộ với localStorage
        sameSite: "lax",
        path: "/",
      })

      if (userId) {
        response.cookies.set("userId", userId, {
          httpOnly: false,
          sameSite: "lax",
          path: "/",
        })
      }

      if (userName) {
        response.cookies.set("userName", userName, {
          httpOnly: false,
          sameSite: "lax",
          path: "/",
        })
      }

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}


