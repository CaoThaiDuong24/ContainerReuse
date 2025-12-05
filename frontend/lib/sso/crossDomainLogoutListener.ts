import { deleteCookie, getCookie } from "./cookies"

const DEFAULT_HUB_ORIGIN = "https://hub1.ltacv.com"

const normalizeOrigin = (url?: string) => {
  if (!url) return null
  try {
    const normalized = new URL(url)
    normalized.pathname = ""
    normalized.search = ""
    normalized.hash = ""
    return normalized.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

// Container Hub origin (NEXT_PUBLIC_RCS_URL)
const envHubOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_RCS_URL)

// Current Cloud Yards origin (for development: localhost:3001, production: https://rcs.ltacv.com)
const getCurrentOrigin = (): string | null => {
  if (typeof window === "undefined") return null
  return normalizeOrigin(window.location.origin)
}

const CONTAINER_HUB_ORIGINS = [
  envHubOrigin ?? DEFAULT_HUB_ORIGIN,
  getCurrentOrigin(),
].filter(Boolean) as string[]

export const LOGOUT_FLAG_KEY = "crossDomainLogoutFlag"
let lastLogoutFlag: string | null = null

/**
 * Initialize cross-domain logout listener.
 * Listens for:
 * 1. postMessage from Container Hub
 * 2. storage events between tabs
 * 3. polling shared cookie logout flag
 */
export const initCrossDomainLogoutListener = (logoutCallback: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {}

  // Method 1: PostMessage from Container Hub
  const handlePostMessage = (event: MessageEvent) => {
    const origin = event.origin?.replace(/\/$/, "")
    if (!origin || !CONTAINER_HUB_ORIGINS.includes(origin)) return

    if (event.data?.type === "CROSS_DOMAIN_LOGOUT" && event.data?.source === "container-hub") {
      // eslint-disable-next-line no-console
      console.log("🔔 Received logout message from Container Hub:", origin)
      logoutCallback()
    }
  }

  window.addEventListener("message", handlePostMessage)

  // Method 2: Storage event for same-origin tabs
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === LOGOUT_FLAG_KEY && e.newValue !== lastLogoutFlag) {
      // eslint-disable-next-line no-console
      console.log("🔔 Detected logout flag in localStorage")
      lastLogoutFlag = e.newValue
      logoutCallback()
    }
  }

  window.addEventListener("storage", handleStorageChange)

  // Method 3: Poll logout flag cookie
  const checkLogoutFlagCookie = () => {
    try {
      const logoutFlag = getCookie(LOGOUT_FLAG_KEY)

      if (logoutFlag && logoutFlag !== lastLogoutFlag) {
        // eslint-disable-next-line no-console
        console.log("🔔 Detected logout flag cookie")
        lastLogoutFlag = logoutFlag
        logoutCallback()
        deleteCookie(LOGOUT_FLAG_KEY, "/", true)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("❌ Error checking logout flag cookie:", error)
    }
  }

  const cookieCheckInterval = window.setInterval(checkLogoutFlagCookie, 2000)

  // Initial check
  checkLogoutFlagCookie()

  // Cleanup
  return () => {
    window.removeEventListener("message", handlePostMessage)
    window.removeEventListener("storage", handleStorageChange)
    window.clearInterval(cookieCheckInterval)
    // eslint-disable-next-line no-console
    console.log("🛑 Cross-domain logout listener stopped")
  }
}

