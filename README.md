# Container Reseu - Full Stack Application

Dự án Container Reseu được cấu trúc thành một monorepo với frontend (Next.js) và backend (Express.js) riêng biệt.

## 🏗️ Cấu trúc Dự án

```
containerreseu/
├── frontend/                 # Next.js Frontend Application
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Utility Libraries
│   ├── public/             # Static Assets
│   ├── styles/             # Global Styles
│   └── package.json        # Frontend Dependencies
├── backend/                 # Express.js Backend API
│   ├── src/
│   │   ├── controllers/    # Request Controllers
│   │   ├── routes/         # API Routes
│   │   ├── models/         # Data Models
│   │   ├── middleware/     # Custom Middleware
│   │   ├── utils/          # Utility Functions
│   │   └── index.ts        # Server Entry Point
│   ├── package.json        # Backend Dependencies
│   └── tsconfig.json       # TypeScript Configuration
└── package.json            # Root Package (Workspace Manager)
```

## 🚀 Cài đặt và Chạy

### 1. Cài đặt Dependencies

```bash
# Cài đặt dependencies cho toàn bộ dự án
npm run install:all

# Hoặc cài đặt riêng lẻ
npm run install:frontend
npm run install:backend
```

### 2. Chạy Development

```bash
# Chạy cả frontend và backend cùng lúc
npm run dev

# Hoặc chạy riêng lẻ
npm run dev:frontend    # Frontend: http://localhost:3000
npm run dev:backend     # Backend: http://localhost:5000
```

### 3. Build Production

```bash
# Build toàn bộ dự án
npm run build

# Hoặc build riêng lẻ
npm run build:frontend
npm run build:backend
```

### 4. Chạy Production

```bash
# Chạy production
npm run start
```

## ⚙️ Cấu hình

### Backend Environment Variables

Tạo file `.env` trong thư mục `backend/` dựa trên `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Sau đó cập nhật các giá trị cần thiết trong file `.env`.

### Frontend Configuration

Frontend đã được cấu hình sẵn để hoạt động với backend trên port 5000.

## 📁 Scripts Có sẵn

- `npm run dev` - Chạy cả frontend và backend trong chế độ development
- `npm run build` - Build toàn bộ dự án
- `npm run start` - Chạy production build
- `npm run lint` - Lint cả frontend và backend
- `npm run test` - Chạy tests
- `npm run clean` - Xóa node_modules và build files

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component Library
- **React Hook Form** - Form Management
- **Zod** - Schema Validation

### Backend
- **Express.js** - Node.js Framework
- **TypeScript** - Type Safety
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **Helmet** - Security
- **CORS** - Cross-Origin Resource Sharing

## 📝 Development Guidelines

1. **Code Structure**: Giữ frontend và backend hoàn toàn tách biệt
2. **API Communication**: Backend chạy trên port 5000, frontend trên port 3000
3. **Type Safety**: Sử dụng TypeScript cho cả frontend và backend
4. **Environment Variables**: Sử dụng .env files cho cấu hình
5. **Error Handling**: Implement proper error handling ở cả client và server

## 🔧 Customization

Để thêm features mới:

1. **API Endpoints**: Thêm controllers và routes trong `backend/src/`
2. **UI Components**: Thêm components trong `frontend/components/`
3. **Pages**: Thêm pages trong `frontend/app/`
4. **Styling**: Sử dụng Tailwind CSS trong `frontend/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue trong repository này.