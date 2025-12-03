interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  username: string
  accuserkey: string
}

export class AuthService {
  private static apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL || 'https://apiedepottest.gsotgroup.vn'

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log("Sending login request with:", credentials)
    
    // API yêu cầu format: { "user": "...", "password": "..." }
    const requestBody = {
      user: credentials.username,
      password: credentials.password
    }
    
    console.log("Request body:", JSON.stringify(requestBody))
    
    const response = await fetch(`${this.apiUrl}/api/Users/Login`, {
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
      throw new Error(`Lỗi phản hồi từ server: ${responseText}`)
    }

    if (!response.ok || !data.token) {
      throw new Error(`Đăng nhập thất bại (${response.status}). ${responseText}`)
    }

    return data
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
