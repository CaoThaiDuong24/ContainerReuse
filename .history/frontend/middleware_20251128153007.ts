import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/admin"
]

// Routes that should redirect authenticated users
const authRoutes = [
  "/login",
  "/register"
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)
  
  // Get token from cookies (you might want to use cookies instead of localStorage for better security)
  const token = request.cookies.get("authToken")?.value
  
  // If trying to access a protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If authenticated user tries to access auth routes, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}