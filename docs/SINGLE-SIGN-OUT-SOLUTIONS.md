# Các Cách Xử Lý Single Sign-Out Giữa localhost:3000 và localhost:3001

## Tổng Quan
Khi người dùng đăng xuất ở localhost:3000, cần đảm bảo localhost:3001 cũng tự động đăng xuất. Dưới đây là các phương pháp có thể áp dụng:

---

## 1. **PostMessage API (Khuyến nghị cho Development)**

### Cách hoạt động:
- Sử dụng `window.postMessage()` để giao tiếp giữa các cửa sổ/tab khác nhau
- Khi logout ở localhost:3000, gửi message đến tất cả các cửa sổ Cloud Yards đang mở
- localhost:3001 lắng nghe message và tự động logout

### Ưu điểm:
- ✅ Đơn giản, không cần backend
- ✅ Hoạt động tốt trong cùng browser
- ✅ Real-time, không cần polling
- ✅ Phù hợp cho development/local

### Nhược điểm:
- ❌ Chỉ hoạt động khi Cloud Yards đang mở trong cùng browser
- ❌ Không hoạt động nếu Cloud Yards đã đóng tab

### Implementation:

**localhost:3000 (Container Hub):**
```javascript
// Trong useAuth hook hoặc logout function
const logout = async (skipRedirect = false) => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setAuth(null);

    // Gửi logout message đến tất cả cửa sổ Cloud Yards
    const cloudYardsUrl = process.env.NEXT_PUBLIC_CLOUD_YARDS_BASE_URL || 'http://localhost:3001';
    window.postMessage(
      { type: 'LOGOUT', source: 'container-hub' },
      cloudYardsUrl
    );

    // Broadcast đến tất cả cửa sổ (same-origin)
    window.postMessage(
      { type: 'LOGOUT', source: 'container-hub' },
      '*'
    );

    if (!skipRedirect) {
      router.push('/login');
    }
  }
};
```

**localhost:3001 (Cloud Yards):**
```javascript
// Trong _app.js hoặc layout component
useEffect(() => {
  const handleMessage = (event) => {
    // Kiểm tra origin để bảo mật
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-production-domain.com'
    ];

    if (!allowedOrigins.includes(event.origin)) {
      return;
    }

    if (event.data?.type === 'LOGOUT' && event.data?.source === 'container-hub') {
      // Thực hiện logout
      handleLogout();
    }
  };

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}, []);
```

---

## 2. **Shared Storage với Storage Event**

### Cách hoạt động:
- Sử dụng `localStorage` hoặc `sessionStorage` để lưu trạng thái đăng nhập
- Khi logout ở localhost:3000, xóa hoặc cập nhật flag trong storage
- localhost:3001 lắng nghe `storage` event và tự động logout

### Ưu điểm:
- ✅ Đơn giản, không cần backend
- ✅ Hoạt động giữa các tab khác nhau trong cùng browser
- ✅ Tự động sync khi có thay đổi

### Nhược điểm:
- ❌ Chỉ hoạt động trong cùng browser (không cross-browser)
- ❌ Storage event chỉ trigger khi thay đổi từ tab khác (không trigger trong cùng tab)
- ❌ Cần cùng origin hoặc sử dụng iframe

### Implementation:

**localhost:3000:**
```javascript
const logout = async (skipRedirect = false) => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Set logout flag để Cloud Yards biết
    localStorage.setItem('logoutFlag', Date.now().toString());

    setAuth(null);
    if (!skipRedirect) {
      router.push('/login');
    }
  }
};
```

**localhost:3001:**
```javascript
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === 'logoutFlag') {
      // Logout khi detect logout flag
      handleLogout();
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);
```

**Lưu ý:** Storage event chỉ hoạt động giữa các tab khác nhau, không hoạt động trong cùng tab. Để giải quyết, có thể sử dụng kết hợp với polling hoặc postMessage.

---

## 3. **Polling Token Validation**

### Cách hoạt động:
- localhost:3001 định kỳ kiểm tra token với backend
- Khi logout ở localhost:3000, backend invalidate token
- localhost:3001 phát hiện token không hợp lệ và tự động logout

### Ưu điểm:
- ✅ Hoạt động độc lập, không phụ thuộc vào tab đang mở
- ✅ Bảo mật tốt (token được validate ở backend)
- ✅ Hoạt động cross-browser, cross-device

### Nhược điểm:
- ❌ Có độ trễ (delay) do polling interval
- ❌ Tăng tải cho backend
- ❌ Cần backend support

### Implementation:

**Backend API:**
```javascript
// Endpoint để validate token
GET /api/auth/validate-token
Response: { valid: true/false }
```

**localhost:3001:**
```javascript
useEffect(() => {
  const validateToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('/api/auth/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!data.valid) {
        handleLogout();
      }
    } catch (error) {
      console.error('Token validation error:', error);
    }
  };

  // Poll mỗi 5 giây
  const interval = setInterval(validateToken, 5000);

  return () => clearInterval(interval);
}, []);
```

---

## 4. **Server-Sent Events (SSE) hoặc WebSocket**

### Cách hoạt động:
- Backend gửi event khi có logout
- localhost:3001 kết nối SSE/WebSocket và lắng nghe logout event
- Khi nhận logout event, tự động logout

### Ưu điểm:
- ✅ Real-time, không có delay
- ✅ Hiệu quả hơn polling
- ✅ Hoạt động cross-browser, cross-device

### Nhược điểm:
- ❌ Phức tạp hơn, cần backend support
- ❌ Cần quản lý connection state
- ❌ Có thể tốn tài nguyên server

### Implementation:

**Backend (SSE):**
```javascript
// SSE endpoint
app.get('/api/auth/logout-events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Lưu connection để broadcast khi có logout
  connections.push({ res, userId: req.user.id });
});
```

**localhost:3001:**
```javascript
useEffect(() => {
  const eventSource = new EventSource('/api/auth/logout-events');

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'LOGOUT') {
      handleLogout();
    }
  };

  return () => {
    eventSource.close();
  };
}, []);
```

---

## 5. **Shared Cookie Domain (Chỉ cho Production)**

### Cách hoạt động:
- Set cookie với domain chung (ví dụ: `.yourdomain.com`)
- Cả localhost:3000 và localhost:3001 đều đọc cookie này
- Khi logout, xóa cookie và cả 2 app đều detect được

### Ưu điểm:
- ✅ Đơn giản, tự động sync
- ✅ Không cần giao tiếp giữa các tab

### Nhược điểm:
- ❌ Chỉ hoạt động với cùng domain/subdomain
- ❌ Không hoạt động với localhost (khác port)
- ❌ Cần cấu hình domain phù hợp

### Implementation:

**Backend:**
```javascript
// Set cookie với domain chung
res.cookie('authToken', token, {
  domain: '.yourdomain.com',
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
});
```

**Lưu ý:** Không áp dụng được cho localhost với các port khác nhau.

---

## 6. **Centralized Auth Service với Redirect**

### Cách hoạt động:
- Khi logout ở localhost:3000, redirect đến logout endpoint của Cloud Yards
- Cloud Yards xử lý logout và redirect lại về localhost:3000

### Ưu điểm:
- ✅ Đảm bảo logout ở cả 2 app
- ✅ Đơn giản, không cần real-time communication

### Nhược điểm:
- ❌ Có redirect, UX không mượt
- ❌ Phụ thuộc vào Cloud Yards đang mở

### Implementation:

**localhost:3000:**
```javascript
const logout = async (skipRedirect = false) => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setAuth(null);

    // Redirect đến Cloud Yards logout endpoint
    const cloudYardsUrl = process.env.NEXT_PUBLIC_CLOUD_YARDS_BASE_URL || 'http://localhost:3001';
    const logoutUrl = `${cloudYardsUrl}/logout?redirectUrl=${encodeURIComponent(window.location.origin + '/login')}`;

    // Mở trong iframe để không làm gián đoạn UX
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = logoutUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
      if (!skipRedirect) {
        router.push('/login');
      }
    }, 1000);
  }
};
```

---

## 7. **Kết Hợp: PostMessage + Storage Event + Token Validation**

### Cách hoạt động:
- Sử dụng nhiều phương pháp cùng lúc để đảm bảo reliability
- PostMessage cho real-time khi tab đang mở
- Storage event cho sync giữa các tab
- Token validation như fallback

### Ưu điểm:
- ✅ Độ tin cậy cao
- ✅ Cover nhiều trường hợp
- ✅ Fallback mechanisms

### Nhược điểm:
- ❌ Phức tạp hơn
- ❌ Có thể redundant

---

## Khuyến Nghị

### Cho Development (localhost):
1. **PostMessage API** - Đơn giản, hiệu quả, phù hợp với localhost
2. **Storage Event** - Bổ sung cho PostMessage để sync giữa các tab

### Cho Production:
1. **SSE/WebSocket** - Real-time, hiệu quả
2. **Token Validation Polling** - Đơn giản hơn, nhưng có delay
3. **Shared Cookie Domain** - Nếu có cùng domain

### Implementation đề xuất:
- **Development**: PostMessage + Storage Event
- **Production**: SSE/WebSocket hoặc Token Validation Polling
- **Hai chiều A ↔ B**: mỗi bên đều phải phát tín hiệu logout (postMessage + shared cookie flag) và bên kia phải lắng nghe/poll để tự logout. Xóa flag sau khi xử lý để tránh lặp.

---

## Checklist Implementation

- [ ] Xác định phương pháp phù hợp
- [ ] Implement logout handler ở localhost:3000
- [ ] Implement logout listener ở localhost:3001
- [ ] Test logout từ localhost:3000
- [ ] Test logout khi Cloud Yards đang mở
- [ ] Test logout khi Cloud Yards đã đóng
- [ ] Test logout khi có nhiều tab Cloud Yards
- [ ] Handle edge cases (network errors, timeouts, etc.)
- [ ] Add error handling và logging
- [ ] Document cho team

