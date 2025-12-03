# 🔧 Gate Out API Implementation Guide

## 📋 Overview

Hướng dẫn về việc triển khai API đăng ký lấy container (Gate Out) sử dụng endpoint `Create_GateOut_Reuse`.

## 🔑 API Structure

### Endpoint
```
POST http://apiedepottest.gsotgroup.vn/api/data/process/Create_GateOut_Reuse
```

### Request Format
```json
{
  "reqid": "Create_GateOut_Reuse",
  "token": "<token từ gettokenNonAid>",
  "reqtime": "<reqtime từ gettokenNonAid>",
  "data": {
    "HangTauID": 11,
    "ContTypeSizeID": 14,
    "SoChungTuNhapBai": "SGN0002222",
    "DonViVanTaiID": 39503,
    "SoXe": "93H-0000",
    "NguoiTao": 111735,
    "CongTyInHoaDon_PhiHaTang": 90750,
    "CongTyInHoaDon": 90750,
    "DepotID": 15,
    "SoLuongCont": 1,
    "HangHoa": -1
  }
}
```

## 📊 Data Fields Explanation

| Field | Type | Description | Example | Required |
|-------|------|-------------|---------|----------|
| `HangTauID` | Integer | ID hãng tàu | 11 | ✅ |
| `ContTypeSizeID` | Integer | ID loại và size container | 14 | ✅ |
| `SoChungTuNhapBai` | String | Số booking/chứng từ nhập bãi | "SGN0002222" | ✅ |
| `DonViVanTaiID` | Integer | ID đơn vị vận tải | 39503 | ✅ |
| `SoXe` | String | Biển số xe | "93H-0000" | ✅ |
| `NguoiTao` | Integer | ID người tạo | 111735 | ✅ |
| `CongTyInHoaDon_PhiHaTang` | Integer | ID công ty in hóa đơn phí hạ tầng | 90750 | ✅ |
| `CongTyInHoaDon` | Integer | ID công ty in hóa đơn | 90750 | ✅ |
| `DepotID` | Integer | ID depot | 15 | ✅ |
| `SoLuongCont` | Integer | Số lượng container | 1 | ✅ |
| `HangHoa` | Integer | Mã hàng hóa (-1 = rỗng) | -1 | ✅ |

## 🔐 Authentication Flow

### 1. Get Token
```javascript
POST /api/data/util/gettokenNonAid
Body: {
  "reqid": "Create_GateOut_Reuse",
  "data": {
    "appversion": "2023"
  }
}

Response: {
  "token": "...",
  "reqtime": "..."
}
```

### 2. Use Token
Token được sử dụng trong request chính cùng với `reqtime`.

### 3. Multiple ReqID Strategy
Hệ thống tự động thử nhiều `reqid` values để lấy token:
- `Create_GateOut_Reuse` (preferred)
- `GetListReUse_Now` (fallback 1)
- `iContainerHub_Depot` (fallback 2)

## ⚠️ Common Issues & Solutions

### Issue 1: Error 404 - Invalid Token
**Symptoms:**
```json
{
  "errorcode": "404",
  "msg": "Invalid token"
}
```

**Possible Causes:**
1. ❌ Token không có quyền cho endpoint `Create_GateOut_Reuse`
2. ❌ ReqID không đúng khi lấy token
3. ❌ Token đã hết hạn
4. ❌ API endpoint yêu cầu authentication method khác

**Solutions:**
1. ✅ Kiểm tra với API provider xem endpoint có tồn tại không
2. ✅ Xác nhận reqid "Create_GateOut_Reuse" là đúng
3. ✅ Kiểm tra quyền truy cập của tài khoản
4. ✅ Thử với token mới

### Issue 2: Missing Required Fields
**Symptoms:**
```json
{
  "success": false,
  "message": "Missing required fields: ..."
}
```

**Solution:**
Đảm bảo tất cả các field bắt buộc được gửi đi và không null/empty.

### Issue 3: Invalid Data Type
**Symptoms:**
API trả về lỗi về định dạng dữ liệu

**Solution:**
Đảm bảo:
- Tất cả ID fields là Integer (không phải String)
- String fields được wrap trong quotes
- Không có trailing commas

## 🧪 Testing

### Manual Test với curl
```bash
# 1. Get Token
curl -X POST http://apiedepottest.gsotgroup.vn/api/data/util/gettokenNonAid \
  -H "Content-Type: application/json" \
  -d '{
    "reqid": "Create_GateOut_Reuse",
    "data": {"appversion": "2023"}
  }'

# 2. Create Gate Out (replace <TOKEN> and <REQTIME>)
curl -X POST http://apiedepottest.gsotgroup.vn/api/data/process/Create_GateOut_Reuse \
  -H "Content-Type: application/json" \
  -d '{
    "reqid": "Create_GateOut_Reuse",
    "token": "<TOKEN>",
    "reqtime": "<REQTIME>",
    "data": {
      "HangTauID": 11,
      "ContTypeSizeID": 14,
      "SoChungTuNhapBai": "SGN0002222",
      "DonViVanTaiID": 39503,
      "SoXe": "93H-0000",
      "NguoiTao": 111735,
      "CongTyInHoaDon_PhiHaTang": 90750,
      "CongTyInHoaDon": 90750,
      "DepotID": 15,
      "SoLuongCont": 1,
      "HangHoa": -1
    }
  }'
```

### Test Script
```bash
cd backend
node src/test-gate-out.js
```

## 📝 Implementation Checklist

### Backend Implementation
- [x] Create `containerApiService.js` with `createGateOut` method
- [x] Implement multiple reqid fallback strategy
- [x] Add comprehensive error handling
- [x] Validate all required fields
- [x] Convert data types properly (String to Int, etc.)
- [x] Add detailed logging
- [x] Create controller method `createGateOut`
- [x] Add route `POST /api/containers/gate-out`

### Frontend Implementation
- [x] Create pickup modal with all required fields
- [x] Extract `rawApiData` from container
- [x] Validate data before submission
- [x] Handle API errors gracefully
- [x] Show user-friendly error messages
- [x] Add loading states

### Testing
- [x] Create test script
- [ ] Test with real API credentials
- [ ] Verify all fields are correctly mapped
- [ ] Test error scenarios
- [ ] Test with different container types

## 🔄 Data Flow

```
Frontend Modal
    ↓ (User fills form)
Collect Form Data + Container rawApiData
    ↓
Prepare Gate Out Data
    ↓
POST /api/containers/gate-out
    ↓
Backend Controller (Validate)
    ↓
Container API Service
    ↓ (Try multiple reqids)
Get Token from gettokenNonAid
    ↓
POST Create_GateOut_Reuse
    ↓
Return Result
```

## 🎯 Next Steps

1. **Contact API Provider**
   - Xác nhận endpoint `Create_GateOut_Reuse` có hoạt động không
   - Kiểm tra authentication requirements
   - Xác minh reqid cần sử dụng
   - Yêu cầu API documentation

2. **Alternative Solutions**
   - Sử dụng endpoint khác nếu có
   - Implement callback/webhook nếu API support
   - Xem xét batch processing

3. **Enhanced Error Handling**
   - Implement retry logic
   - Add request queue
   - Log failed requests for manual processing

## 📞 Support

Nếu vẫn gặp lỗi authentication:
1. Kiểm tra logs trong console (browser & server)
2. Xem file `test-gate-out.js` để test trực tiếp
3. Liên hệ API provider để xác nhận permissions
4. Kiểm tra file `DEBUG-GUIDE.md` cho debugging steps

## 📚 Related Files

- `backend/src/services/containerApiService.js` - Main API service
- `backend/src/controllers/containerController.ts` - API endpoints
- `frontend/components/pickup-container-modal.tsx` - UI component
- `backend/src/test-gate-out.js` - Test script
