"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Shield, Calendar, Activity } from "lucide-react"

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Truy cập bị từ chối</h1>
          <p className="text-slate-600 mb-4">Bạn cần đăng nhập để xem trang này.</p>
          <Button onClick={() => window.location.href = "/login"}>
            Đăng nhập
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">▢</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Container Reuse Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Xin chào, <span className="font-medium">{user?.username}</span>
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Chào mừng trở lại!
          </h2>
          <p className="text-slate-600">
            Đây là trang dashboard của bạn. Quản lý container và logistics tại đây.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Thông tin tài khoản
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.username}</div>
              <p className="text-xs text-muted-foreground">
                ID: {user?.id}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Email
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sm">{user?.email}</div>
              <p className="text-xs text-muted-foreground">
                Email đăng ký
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vai trò
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.role}</div>
              <p className="text-xs text-muted-foreground">
                Quyền hạn hiện tại
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Phiên làm việc
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hoạt động</div>
              <p className="text-xs text-muted-foreground">
                Đăng nhập thành công
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Container Management</CardTitle>
              <CardDescription>
                Quản lý và theo dõi container của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Tính năng quản lý container sẽ được triển khai tại đây. 
                Bạn có thể theo dõi trạng thái, vị trí và lịch sử sử dụng container.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logistics Tracking</CardTitle>
              <CardDescription>
                Theo dõi logistics và vận chuyển
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Hệ thống theo dõi logistics sẽ cho phép bạn quản lý 
                toàn bộ quá trình vận chuyển một cách hiệu quả.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}