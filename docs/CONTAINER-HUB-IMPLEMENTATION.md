# Container Hub (A) - Single Sign-Out Handling

Mục tiêu: Khi Cloud Yards (B) logout thì A cũng tự logout, và chiều ngược lại đã hỗ trợ sẵn. Dưới đây là những việc A cần làm.

---

## Tín hiệu A phải lắng nghe

1) `postMessage`
- Lắng nghe từ origin Cloud Yards:
  - Production: `https://rcs.ltacv.com`
  - Dev: origin của B (ví dụ `http://localhost:3001`)
- Payload: `{ type: "CROSS_DOMAIN_LOGOUT", source: "cloud-yards" }`
- Khi nhận đúng origin và payload: chạy quy trình logout của A.

2) Shared cookie flag (fallback khi tab B đã đóng)
- Cookie: `crossDomainLogoutFlag` (domain `.ltacv.com` trong production).
- A nên poll (ví dụ mỗi 2s) hoặc kiểm tra định kỳ; khi thấy flag thay đổi => logout, rồi **xóa cookie flag** để tránh lặp.

3) (Tuỳ chọn) Storage event
- Nếu A và B cùng origin trong môi trường đặc biệt: lắng nghe `storage` với key `crossDomainLogoutFlag`. Với cross-origin chính, storage event không hữu dụng, ưu tiên postMessage + cookie.

---

## Quy trình logout của A khi nhận tín hiệu

1) Clear phiên local:
- Xoá token/session (localStorage/sessionStorage, memory).
- Xoá cookies ứng dụng.

2) Đặt logout flag (để chiều ngược lại cũng biết, nếu chưa có):
- localStorage: `crossDomainLogoutFlag = Date.now().toString()`.
- Shared cookie `.ltacv.com`: đặt `crossDomainLogoutFlag` với giá trị trên (cho production).
- Gửi `postMessage` sang B origin với payload `{ type: "CROSS_DOMAIN_LOGOUT", source: "container-hub" }`.

3) Redirect:
- Điều hướng về trang login của A (hoặc trang mặc định sau logout).

---

## Gợi ý triển khai (pseudo)

```javascript
// Listener ở A
useEffect(() => {
  const ALLOWED_ORIGINS = ["https://rcs.ltacv.com", "http://localhost:3001"]

  const handleMessage = (event) => {
    if (!ALLOWED_ORIGINS.includes(event.origin)) return
    if (event.data?.type === "CROSS_DOMAIN_LOGOUT" && event.data?.source === "cloud-yards") {
      handleLogoutFromSignal()
    }
  }

  const pollCookieFlag = () => {
    const flag = getCookie("crossDomainLogoutFlag")
    if (flag && flag !== lastSeenFlag) {
      lastSeenFlag = flag
      handleLogoutFromSignal()
      deleteCookie("crossDomainLogoutFlag", "/", true) // cleanup
    }
  }

  window.addEventListener("message", handleMessage)
  const interval = setInterval(pollCookieFlag, 2000)
  pollCookieFlag()

  return () => {
    window.removeEventListener("message", handleMessage)
    clearInterval(interval)
  }
}, [])

// Khi A tự logout (user click ở A)
const handleLogout = () => {
  clearLocalSession()
  const flag = Date.now().toString()
  localStorage.setItem("crossDomainLogoutFlag", flag)
  setSharedCookie("crossDomainLogoutFlag", flag, 1, "/", true) // prod
  window.postMessage({ type: "CROSS_DOMAIN_LOGOUT", source: "container-hub" }, "https://rcs.ltacv.com")
  router.push("/login")
}
```

---

## Checklist cho A
- [ ] Lắng nghe `postMessage` từ B với origin whitelisting.
- [ ] Poll shared cookie `crossDomainLogoutFlag` (prod) và cleanup sau khi xử lý.
- [ ] Tích hợp handleLogoutFromSignal: clear session + redirect.
- [ ] Khi A logout: đặt flag vào localStorage + shared cookie, gửi `postMessage` đến B.
- [ ] Kiểm thử:
  - A logout → B logout.
  - B logout → A logout (tab B đóng/mở).
  - Nhiều tab A/B cùng lúc.

