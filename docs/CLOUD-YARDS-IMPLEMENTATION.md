# Cloud Yards Implementation Guide
## Single Sign-Out Integration với Container Hub

Đây là hướng dẫn chi tiết để implement Single Sign-Out listener trong Cloud Yards (rcs.ltacv.com).

---

## Tổng Quan

Cloud Yards cần lắng nghe logout signals từ Container Hub (hub1.ltacv.com) và tự động logout khi Container Hub logout.

**3 phương pháp được sử dụng:**
1. **PostMessage API** - Real-time khi Cloud Yards đang mở
2. **Storage Event** - Sync giữa các tab
3. **Cookie Polling** - Detect logout flag cookie từ shared domain

---

## Bước 1: Tạo Cookie Utility

**File: `shared/util/cookies.js`**

```javascript
/**
 * Cookie utility functions for Cloud Yards
 */

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path (default: '/')
 * @param {boolean} sharedDomain - Delete from shared domain
 */
export const deleteCookie = (name, path = '/', sharedDomain = false) => {
  if (typeof window === 'undefined') return;

  const domain = sharedDomain && process.env.NODE_ENV === 'production'
    ? '; domain=.ltacv.com'
    : '';

  // Set expiration to past date to delete
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain}; SameSite=Lax`;

  // Also delete from current domain
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax`;
};

/**
 * Set a cookie with shared domain (.ltacv.com)
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration (default: 7)
 * @param {string} path - Cookie path (default: '/')
 * @param {boolean} sharedDomain - Set domain to .ltacv.com for cross-subdomain sharing
 */
export const setSharedCookie = (name, value, days = 7, path = '/', sharedDomain = false) => {
  if (typeof window === 'undefined') return;

  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }

  // Encode value để handle special characters
  const encodedValue = encodeURIComponent(value);

  // Set domain for shared cookies (only in production)
  const domain = sharedDomain && process.env.NODE_ENV === 'production'
    ? '; domain=.ltacv.com'
    : '';

  // Build cookie string
  const cookieString = `${name}=${encodedValue}${expires}; path=${path}${domain}; SameSite=Lax`;

  // Add Secure flag in production (HTTPS only)
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';

  document.cookie = `${cookieString}${secureFlag}`;
};
```

---

## Bước 2: Tạo Cross-Domain Logout Listener

**File: `shared/util/crossDomainLogoutListener.js`**

```javascript
/**
 * Cross-domain logout listener for Cloud Yards
 * Listens for logout signals from Container Hub
 */

const CONTAINER_HUB_ORIGINS = [
  'https://hub1.ltacv.com',
  'http://localhost:3000' // For development
];

const LOGOUT_FLAG_KEY = 'crossDomainLogoutFlag';
let lastLogoutFlag = null;

/**
 * Initialize cross-domain logout listener
 * @param {Function} logoutCallback - Function to call when logout is detected
 * @returns {Function} Cleanup function
 */
export const initCrossDomainLogoutListener = (logoutCallback) => {
  if (typeof window === 'undefined') return () => {};

  console.log('👂 Initializing cross-domain logout listener...');

  // Method 1: Listen for PostMessage
  const handlePostMessage = (event) => {
    // Verify origin
    if (!CONTAINER_HUB_ORIGINS.includes(event.origin)) {
      return;
    }

    // Check if it's a logout message
    if (event.data?.type === 'CROSS_DOMAIN_LOGOUT' &&
        event.data?.source === 'container-hub') {
      console.log('🔔 Received logout message from Container Hub:', event.origin);
      logoutCallback();
    }
  };

  window.addEventListener('message', handlePostMessage);

  // Method 2: Listen for Storage Event (for same-origin tabs)
  const handleStorageChange = (e) => {
    if (e.key === LOGOUT_FLAG_KEY) {
      console.log('🔔 Detected logout flag in localStorage');
      logoutCallback();
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Method 3: Poll logout flag cookie
  const checkLogoutFlagCookie = () => {
    try {
      const { getCookie } = require('./cookies');
      const logoutFlag = getCookie(LOGOUT_FLAG_KEY);

      if (logoutFlag && logoutFlag !== lastLogoutFlag) {
        console.log('🔔 Detected logout flag cookie');
        lastLogoutFlag = logoutFlag;
        logoutCallback();
      }
    } catch (error) {
      console.error('❌ Error checking logout flag cookie:', error);
    }
  };

  // Check cookie every 2 seconds
  const cookieCheckInterval = setInterval(checkLogoutFlagCookie, 2000);

  // Initial check
  checkLogoutFlagCookie();

  // Return cleanup function
  return () => {
    window.removeEventListener('message', handlePostMessage);
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(cookieCheckInterval);
    console.log('🛑 Cross-domain logout listener stopped');
  };
};
```

---

## Bổ sung: Phát logout từ Cloud Yards về Container Hub (hai chiều)

- Khi Cloud Yards logout, cần **phát tín hiệu** để Container Hub (A) cũng logout:
  - Ghi `crossDomainLogoutFlag` vào **localStorage** và **shared cookie** (`.ltacv.com`) để A có thể polling/phát hiện khi tab Cloud Yards đã đóng.
  - Gửi `postMessage` tới origin Hub (`NEXT_PUBLIC_RCS_URL`, mặc định `https://hub1.ltacv.com`) với payload:
    ```json
    { "type": "CROSS_DOMAIN_LOGOUT", "source": "cloud-yards" }
    ```

### Code tham chiếu (đã có trong Cloud Yards)
- `frontend/hooks/use-auth.tsx`:
  - `broadcastLogout()` đặt `localStorage` flag + `setSharedCookie(LOGOUT_FLAG_KEY, flag, 1, "/", true)` + `postMessage` đến Hub origin.
  - `logout()` gọi `broadcastLogout()` trước khi clear cookies và redirect.

### Yêu cầu cho Container Hub (A) để matching
- Lắng nghe:
  - `postMessage` từ origin Cloud Yards (`https://rcs.ltacv.com` hoặc origin dev) với `type: "CROSS_DOMAIN_LOGOUT", source: "cloud-yards"`.
  - Poll hoặc listen shared cookie `crossDomainLogoutFlag` (domain `.ltacv.com`) và xóa cookie sau khi xử lý.
- Khi nhận được tín hiệu, A chạy quy trình logout của mình (clear token, storage, redirect).

---

## Bước 3: Tích hợp vào App Component

**File: `pages/_app.js` hoặc `app/layout.js`**

```javascript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initCrossDomainLogoutListener } from '@/shared/util/crossDomainLogoutListener';
import { useAuth } from '@/shared/hook/useAuth'; // Your auth hook

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { logout } = useAuth(); // Your logout function
  
  useEffect(() => {
    // Initialize cross-domain logout listener
    const cleanup = initCrossDomainLogoutListener(() => {
      console.log('🚪 Logging out due to Container Hub logout...');
      
      // Perform logout
      logout(true).then(() => {
        // Redirect to login page
        router.push('/login');
      }).catch((error) => {
        console.error('Logout error:', error);
        // Still redirect to login even if logout fails
        router.push('/login');
      });
    });
    
    // Cleanup on unmount
    return cleanup;
  }, [logout, router]);
  
  return <Component {...pageProps} />;
}

export default MyApp;
```

---

## Bước 4: Cập nhật useAuth Hook

**File: `shared/hook/useAuth.js`**

Cập nhật logout function để clear shared cookies:

```javascript
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authService } from '@/shared/api/auth.service';
import { deleteCookie } from '@/shared/util/cookies';

export const useAuth = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ... existing auth check code ...

  const logout = async (skipRedirect = false) => {
    try {
      // Call backend logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      // Clear cookies (both current domain and shared domain)
      deleteCookie('authToken', '/', true);
      deleteCookie('currentUser', '/', true);
      
      // Clear auth state
      setAuth(null);
      
      if (!skipRedirect) {
        router.push('/login');
      }
    }
  };

  return {
    auth,
    loading,
    logout
  };
};
```

---

## Bước 5: Xử lý Token từ URL Query

**File: `pages/login.js` hoặc `pages/index.js`**

Khi Cloud Yards được mở từ Container Hub với token trong URL:

```javascript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setSharedCookie } from '@/shared/util/cookies';
import { useAuth } from '@/shared/hook/useAuth';

const LoginPage = () => {
  const router = useRouter();
  const { auth } = useAuth();
  
  useEffect(() => {
    // Check if token is in URL query (from Container Hub)
    const { token, userId, userName } = router.query;
    
    if (token && !auth) {
      console.log('🔑 Token received from Container Hub, processing login...');
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Store user info if provided
      if (userId || userName) {
        const userData = {
          id: userId,
          fullname: userName,
          // Add other user data as needed
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
      
      // Store in shared cookies (production only)
      if (process.env.NODE_ENV === 'production') {
        setSharedCookie('authToken', token, 7, '/', true);
        if (userId || userName) {
          const userData = {
            id: userId,
            fullname: userName,
          };
          setSharedCookie('currentUser', JSON.stringify(userData), 7, '/', true);
        }
      }
      
      // Remove token from URL
      router.replace(router.pathname, undefined, { shallow: true });
      
      // Refresh auth state
      window.location.reload();
    }
  }, [router.query, auth, router]);
  
  // ... rest of login page ...
};
```

---

## Environment Variables

**File: `.env` hoặc `.env.local`**

```bash
# Container Hub URL
NEXT_PUBLIC_CONTAINER_HUB_URL=https://hub1.ltacv.com

# Cloud Yards URL
NEXT_PUBLIC_CLOUD_YARDS_BASE_URL=https://rcs.ltacv.com
```

---

## Testing Checklist

### ✅ Test 1: Logout từ Container Hub khi Cloud Yards đang mở
1. Login vào Container Hub (hub1.ltacv.com)
2. Click vào Cloud Yards → mở Cloud Yards (rcs.ltacv.com) với token
3. Cloud Yards đăng nhập thành công
4. Quay lại Container Hub và logout
5. **Expected**: Cloud Yards tự động logout và redirect về login

### ✅ Test 2: Logout từ Container Hub khi Cloud Yards đã đóng
1. Login vào Container Hub
2. Click vào Cloud Yards → mở Cloud Yards với token
3. Đóng tab Cloud Yards
4. Logout từ Container Hub
5. Mở lại Cloud Yards
6. **Expected**: Cloud Yards detect logout flag và redirect về login

### ✅ Test 3: Logout khi có nhiều tab Cloud Yards
1. Login vào Container Hub
2. Mở Cloud Yards trong nhiều tab
3. Logout từ Container Hub
4. **Expected**: Tất cả tab Cloud Yards đều logout

### ✅ Test 4: Shared Cookie hoạt động
1. Login vào Container Hub
2. Mở DevTools → Application → Cookies
3. Check cookie `authToken` có domain `.ltacv.com`
4. Mở Cloud Yards
5. Check Cloud Yards có thể đọc cookie `authToken` từ `.ltacv.com`

---

## Troubleshooting

### Issue 1: PostMessage không hoạt động

**Nguyên nhân**: Origin không match hoặc Cloud Yards tab đã đóng

**Giải pháp**: 
- Check `CONTAINER_HUB_ORIGINS` trong `crossDomainLogoutListener.js`
- Cookie polling sẽ catch logout nếu Cloud Yards đã đóng

### Issue 2: Cookie không được detect

**Nguyên nhân**: 
- Cookie polling interval quá dài
- Cookie đã expire
- Code đang chạy ở localhost (shared domain chỉ hoạt động ở production)

**Giải pháp**: 
- Giảm polling interval (hiện tại 2 giây)
- Check `process.env.NODE_ENV === 'production'`
- Test ở production environment

### Issue 3: Storage Event không trigger

**Nguyên nhân**: Storage event chỉ hoạt động giữa các tab khác nhau

**Giải pháp**: 
- Đây là behavior bình thường
- Cookie polling sẽ catch logout trong cùng tab

---

## Security Notes

1. **Origin Validation**: Luôn validate origin trong PostMessage listener
2. **Cookie Security**: Sử dụng `Secure` flag trong production (HTTPS only)
3. **Token Security**: Không log token trong console (production)
4. **XSS Prevention**: Sanitize user input, use CSP

---

## Kết Luận

Sau khi implement các bước trên, Cloud Yards sẽ tự động logout khi Container Hub logout thông qua:

1. **PostMessage** - Real-time khi Cloud Yards đang mở
2. **Storage Event** - Sync giữa các tab
3. **Cookie Polling** - Detect logout flag từ shared domain

Tất cả các phương pháp hoạt động song song để đảm bảo logout được detect trong mọi trường hợp.

