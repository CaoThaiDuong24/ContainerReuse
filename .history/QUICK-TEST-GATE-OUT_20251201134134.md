# 🧪 Quick Test Guide - Gate Out API

## Cách test nhanh

### Option 1: Test trực tiếp với script
```bash
cd backend
node src/test-gate-out.js
```

Script này sẽ:
- ✅ Tự động lấy token với nhiều reqid
- ✅ Gửi request với test data
- ✅ Hiển thị kết quả chi tiết
- ✅ Log tất cả errors để debug

### Option 2: Test qua UI

1. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Steps:**
   - Mở http://localhost:3000
   - Login (nếu cần)
   - Vào Dashboard → Containers
   - Chọn một depot
   - Click "Đăng ký lấy" trên một container
   - Điền form với test data:
     ```
     Số booking: SGN0002222
     Mã đơn vị vận tải: 39503
     Số xe: 93H-0000
     Mã người tạo: 111735
     Công ty in HĐ (phí hạ tầng): 90750
     Công ty in HĐ: 90750
     ```
   - Submit

4. **Check Logs:**
   - Browser Console: Xem frontend logs
   - Terminal (backend): Xem API calls

### Expected Results

#### ✅ Success Case:
```
Backend Log:
🔑 Getting token for Create_GateOut_Reuse...
✅ Token retrieved successfully
📡 Calling Create_GateOut_Reuse API...
📥 API Response Status: 200
✅ Gate out created successfully!

Frontend:
✅ Đăng ký lấy container thành công!
```

#### ❌ Auth Error Case:
```
Backend Log:
🔑 Attempt with reqid: Create_GateOut_Reuse
📛 Response status: 400
📛 Response data: { errorcode: "404", msg: "Invalid token" }
⚠️ Trying next reqid...
🔑 Attempt with reqid: GetListReUse_Now
...

Frontend:
⚠️ Lỗi xác thực với API bên ngoài
```

## 🔍 Debugging

### 1. Check Container Data
Mở browser console và chạy:
```javascript
// When modal is open, check container data
console.log(container)
console.log(container.rawApiData)
```

Phải có:
```javascript
{
  rawApiData: {
    HangTauID: "11" hoặc 11,
    ContTypeSizeID: "14" hoặc 14,
    DepotID: "15" hoặc 15,
    // ... other fields
  }
}
```

### 2. Check Backend Logs
Backend sẽ log:
- 📦 Request data nhận được
- 🔑 Token attempts
- 📤 Request payload gửi đi
- 📥 Response nhận về

### 3. Common Issues

**Issue: "Thiếu thông tin container từ API"**
```
Solution: 
- Refresh trang
- Chọn lại container
- Check backend có running không
- Check API external có accessible không
```

**Issue: "Lỗi xác thực với API bên ngoài"**
```
Solution:
- Check GATE-OUT-API-GUIDE.md
- Verify API endpoint tồn tại
- Contact API provider
- Check reqid đúng chưa
```

**Issue: "Missing required fields"**
```
Solution:
- Điền đầy đủ tất cả các trường trong form
- Không để trống
- Kiểm tra format (số phải là số, không có chữ)
```

## 📊 Test Data Reference

### Valid Test Data
```javascript
{
  HangTauID: 11,
  ContTypeSizeID: 14,
  SoChungTuNhapBai: "SGN0002222",
  DonViVanTaiID: 39503,
  SoXe: "93H-0000",
  NguoiTao: 111735,
  CongTyInHoaDon_PhiHaTang: 90750,
  CongTyInHoaDon: 90750,
  DepotID: 15,
  SoLuongCont: 1,
  HangHoa: -1
}
```

### Field Descriptions
- `SoChungTuNhapBai`: Số booking (alphanumeric)
- `SoXe`: Biển số xe (format: 93H-0000)
- `SoLuongCont`: Luôn là 1 cho mỗi request
- `HangHoa`: -1 = container rỗng

## 🎯 Next Steps

1. ✅ Test với script trước
2. ✅ Nếu script thành công → Test trên UI
3. ❌ Nếu script thất bại:
   - Đọc GATE-OUT-API-GUIDE.md
   - Check API connectivity
   - Contact API provider

## 📝 Log Files Location

- Backend console output
- Browser DevTools Console
- Network tab trong DevTools

## 🆘 Getting Help

1. Check `GATE-OUT-API-GUIDE.md` - Detailed API guide
2. Check `DEBUG-GUIDE.md` - General debugging
3. Review console logs (frontend + backend)
4. Check `test-gate-out.js` output
