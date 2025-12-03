"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quick Overview
        </h1>
        <p className="text-gray-600">
          This is all over platform sales generated
        </p>
      </div>

      {/* Stats Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Users
            </CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
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