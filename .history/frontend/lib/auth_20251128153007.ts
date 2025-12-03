// Authentication utilities

export interface User {
  id: string
  username: string
  email: string
  role: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

// Get auth state from localStorage
export const getAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null, token: null }
  }

  const token = localStorage.getItem("authToken")
  const userStr = localStorage.getItem("user")
  
  let user: User | null = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }

  return {
    isAuthenticated: !!(token && user),
    user,
    token
  }
}

// Clear auth state
export const clearAuthState = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthState().isAuthenticated
}

// Get auth token for API requests
export const getAuthToken = (): string | null => {
  return getAuthState().token
}

// Get current user
export const getCurrentUser = (): User | null => {
  return getAuthState().user
}

// Logout function
export const logout = () => {
  clearAuthState()
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}

// Create headers with auth token for API requests
export const createAuthHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  }
}