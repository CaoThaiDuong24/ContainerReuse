// API utilities for testing and development

export const API_BASE_URL = "https://apiedepottest.gsotgroup.vn/api"

export const apiEndpoints = {
  login: `${API_BASE_URL}/Users/Login`,
  // Add more endpoints as needed
} as const

// Test function to check API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch(apiEndpoints.login, {
      method: "OPTIONS",
    })
    
    console.log("API Status:", response.status)
    console.log("API Headers:", response.headers)
    
    return response.status < 500
  } catch (error) {
    console.error("API Connection Error:", error)
    return false
  }
}

// Example login function for testing
export const testLogin = async (username: string, password: string) => {
  try {
    const response = await fetch(apiEndpoints.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    
    console.log("Login Response:", {
      status: response.status,
      data: data
    })

    return {
      success: response.ok,
      data: data
    }
  } catch (error) {
    console.error("Login Test Error:", error)
    return {
      success: false,
      error: error
    }
  }
}