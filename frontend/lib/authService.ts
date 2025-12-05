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
  private static readonly EXTERNAL_API_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_URL || 'https://apiedepottest.gsotgroup.vn'

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

  /**
   * Validate token bằng cách gọi API AccountInfo trên hệ thống GSOT
   * Quy ước:
   * - 401  => token không hợp lệ
   * - 200 / 400 / 500 ... => token hợp lệ (chỉ là lỗi business hoặc server)
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      const url = `${this.EXTERNAL_API_URL}/api/data/process/AccountInfo`

      console.log("[AuthService] Validating token via", url)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // Body có thể rỗng, API chỉ cần token để check
        body: JSON.stringify({}),
      })

      console.log("[AuthService] Token validation status:", response.status)

      if (response.status === 401) {
        // Token Null / Unauthorized
        return false
      }

      // Các status khác (200, 400, 500, ...) vẫn coi như token hợp lệ
      return true
    } catch (error) {
      console.error("[AuthService] Error validating token:", error)
      // Tuỳ chính sách: nếu lỗi mạng, tạm thời coi là không hợp lệ để an toàn
      return false
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = this.getAuthToken()
      const user = this.getUser()

      if (token) {
        // Gọi backend để log và xử lý logout
        await fetch(`${this.BACKEND_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ username: user?.username })
        }).catch(err => console.warn('Logout API call failed:', err))
      }
    } catch (error) {
      console.warn('Error calling logout API:', error)
    } finally {
      // Luôn xóa token dù API có lỗi hay không
      this.clearAuthData()
    }
  }
}
