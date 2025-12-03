interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  username: string
  accuserkey: string
}

interface ErrorResponse {
  error?: string
  message?: string
}

export class AuthService {
  private static readonly BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log("AuthService - Sending login request to backend")
    
    const response = await fetch(`${this.BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()
    
    if (!response.ok) {
      const errorData = data as ErrorResponse
      throw new Error(errorData.error || errorData.message || `Đăng nhập thất bại (${response.status})`)
    }

    return data as LoginResponse
  }

  static saveAuthData(data: LoginResponse): void {
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify({
      id: data.accuserkey,
      username: data.username,
      accuserkey: data.accuserkey
    }))
  }

  static clearAuthData(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  }

  static getAuthToken(): string | null {
    return localStorage.getItem("authToken")
  }

  static getUser(): { id: string; username: string; accuserkey: string } | null {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }
}
