# Hướng dẫn đăng ký lấy container (Gate Out)

## ✅ Đã hoàn thành

Hệ thống đã được tích hợp API `Create_GateOut_Reuse` để đăng ký lấy container với các thông tin đầy đủ theo yêu cầu.

## 📋 Các thay đổi đã thực hiện

### 1. Backend

#### a. Service Layer (`backend/src/services/containerApiService.js`)
- ✅ Thêm method `createGateOut()` để gọi API `Create_GateOut_Reuse`
- ✅ Cập nhật `transformContainerData()` để lưu trữ `rawApiData` chứa:
  - `HangTauID` - ID hãng tàu
  - `ContTypeSizeID` - ID loại và kích thước container  
  - `DepotID` - ID depot

#### b. Controller Layer (`backend/src/controllers/containerController.ts`)
- ✅ Thêm endpoint `POST /api/containers/gate-out`
- ✅ Validate các trường bắt buộc
- ✅ Gọi service để tạo gate out

#### c. Routes (`backend/src/routes/containerRoutes.ts`)
- ✅ Thêm route `POST /api/containers/gate-out`

### 2. Frontend

#### a. Data Model (`frontend/lib/mockData.ts`)
- ✅ Cập nhật interface `Container` để bao gồm `rawApiData`:
```typescript
rawApiData?: {
  HangTauID: string
  ContTypeSizeID: string
  DepotID: string
}
```

#### b. Modal Component (`frontend/components/pickup-container-modal.tsx`)
- ✅ Đã tạo lại modal hoàn toàn mới với form đơn giản hơn
- ✅ Nhận prop `container` thay vì chỉ `containerId`
- ✅ Hiển thị thông tin container (read-only):
  - Mã container
  - Depot
  - Hãng tàu
- ✅ Form nhập liệu với các trường bắt buộc (*):
  - **Số Booking** (SoChungTuNhapBai)
  - **Mã đơn vị vận tải** (DonViVanTaiID)
  - **Số xe** (SoXe)
  - **Mã người tạo** (NguoiTao)
  - **CT HĐ phí hạ tầng** (CongTyInHoaDon_PhiHaTang)
  - **Công ty in hóa đơn** (CongTyInHoaDon)
  - Số lượng (mặc định: 1)
  - Hàng hóa (mặc định: -1)

#### c. Page Component (`frontend/app/dashboard/containers/[depotId]/page.tsx`)
- ✅ Cập nhật để truyền toàn bộ object `container` vào modal

## 🔧 Cấu trúc API Request

Khi người dùng bấm "Xác nhận đăng ký", hệ thống sẽ gửi request:

**Endpoint:** `POST http://localhost:5000/api/containers/gate-out`

**Request Body:**
```json
{
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
```

**Các giá trị được lấy từ:**
- `HangTauID`, `ContTypeSizeID`, `DepotID` → Từ `container.rawApiData` (dữ liệu API gốc)
- `SoChungTuNhapBai` → Người dùng nhập (Số Booking)
- `DonViVanTaiID` → Người dùng nhập (Mã đơn vị vận tải)
- `SoXe` → Người dùng nhập (Số xe)
- `NguoiTao` → Người dùng nhập (Mã người tạo)
- `CongTyInHoaDon_PhiHaTang` → Người dùng nhập (CT HĐ phí hạ tầng)
- `CongTyInHoaDon` → Người dùng nhập (Công ty in hóa đơn)
- `SoLuongCont` → Người dùng nhập (mặc định 1)
- `HangHoa` → Người dùng chọn (mặc định -1)

## 🧪 Cách test

### 1. Khởi động Backend
```bash
cd backend
npm run dev
```
Backend chạy tại: `http://localhost:5000`

### 2. Khởi động Frontend
```bash
cd frontend
npm run dev
```
Frontend chạy tại: `http://localhost:3000`

### 3. Test quy trình

1. Truy cập: `http://localhost:3000/dashboard/containers`
2. Chọn một depot có container
3. Click vào button "Đăng ký lấy" trên card container
4. Modal sẽ hiển thị với:
   - Thông tin container (read-only)
   - Form nhập liệu
5. Điền các trường bắt buộc (*):
   - Số Booking: `SGN0002222`
   - Mã đơn vị vận tải: `39503`
   - Số xe: `93H-0000`
   - Mã người tạo: `111735`
   - CT HĐ phí hạ tầng: `90750`
   - Công ty in hóa đơn: `90750`
6. Click "Xác nhận đăng ký"
7. Hệ thống sẽ:
   - Validate dữ liệu
   - Gọi API backend
   - Backend gọi API ngoài `Create_GateOut_Reuse`
   - Hiển thị thông báo thành công/thất bại

### 4. Kiểm tra trong Console

**Browser Console:**
```
Submitting gate-out data: {
  HangTauID: 11,
  ContTypeSizeID: 14,
  SoChungTuNhapBai: "SGN0002222",
  ...
}
```

**Backend Console:**
```
📡 Calling Create_GateOut_Reuse API...
Data: {...}
✅ Gate out created successfully
```

## 📝 Validation

Hệ thống validate:
- ✅ Container phải có thông tin
- ✅ Container phải có `rawApiData` (HangTauID, ContTypeSizeID, DepotID)
- ✅ Tất cả các trường bắt buộc phải được điền
- ✅ Các ID phải là số hợp lệ

## 🔍 Debug

Nếu gặp lỗi, kiểm tra:

1. **Container không có rawApiData:**
   - Kiểm tra xem API `GetListReUse_Now` có trả về đầy đủ dữ liệu không
   - Xem log trong `backend/src/services/containerApiService.js`

2. **Lỗi validation:**
   - Kiểm tra tất cả trường bắt buộc đã điền
   - Kiểm tra format số (phải là số, không phải chuỗi trống)

3. **Lỗi API:**
   - Xem response trong Browser Network tab
   - Xem log trong Backend console
   - Kiểm tra token có còn hiệu lực không

## 🎯 Flow hoàn chỉnh

```
User clicks "Đăng ký lấy"
    ↓
Modal opens với container data
    ↓
User fills form fields
    ↓
User clicks "Xác nhận đăng ký"
    ↓
Frontend validates input
    ↓
Frontend calls POST /api/containers/gate-out
    ↓
Backend validates request
    ↓
Backend calls ContainerApiService.createGateOut()
    ↓
Service gets/refreshes token
    ↓
Service calls external API Create_GateOut_Reuse
    ↓
External API processes request
    ↓
Response returns to Frontend
    ↓
Toast notification shows success/error
    ↓
Modal closes on success
```

## 📌 Lưu ý

- Tất cả các ID (HangTauID, ContTypeSizeID, DepotID) được lấy tự động từ container được chọn
- Người dùng chỉ cần nhập thông tin booking, vận chuyển và công ty
- API sử dụng token authentication tự động refresh khi hết hạn
- Form được validate ở cả frontend và backend

## ✨ Tính năng

- ✅ Auto-fill thông tin container từ API
- ✅ Validation đầy đủ
- ✅ Loading state khi submit
- ✅ Toast notifications
- ✅ Error handling
- ✅ Token auto-refresh
- ✅ Responsive design
