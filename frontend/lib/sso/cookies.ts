/**
 * Cookie helpers for SSO across Cloud Yards and Container Hub.
 * Functions are guarded for client-side usage.
 */

const getDomain = (sharedDomain: boolean) => {
  if (!sharedDomain) return ""
  return process.env.NODE_ENV === "production" ? "; domain=.ltacv.com" : ""
}

export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null

  const nameEQ = `${name}=`
  const cookies = document.cookie.split(";")

  for (let i = 0; i < cookies.length; i += 1) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
    }
  }

  return null
}

export const deleteCookie = (name: string, path = "/", sharedDomain = false) => {
  if (typeof window === "undefined") return

  const domain = getDomain(sharedDomain)

  // Delete from shared domain (if applicable) and current domain
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain}; SameSite=Lax`
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax`
}

export const setSharedCookie = (
  name: string,
  value: string,
  days = 7,
  path = "/",
  sharedDomain = false,
) => {
  if (typeof window === "undefined") return

  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
  }

  const encodedValue = encodeURIComponent(value)
  const domain = getDomain(sharedDomain)
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : ""

  const cookieString = `${name}=${encodedValue}${expires}; path=${path}${domain}; SameSite=Lax`
  document.cookie = `${cookieString}${secureFlag}`
}

