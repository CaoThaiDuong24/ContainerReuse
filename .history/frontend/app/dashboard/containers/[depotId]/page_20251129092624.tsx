"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Search,
  Package,
  Calendar,
  User,
  MapPin,
  Filter,
  Download,
  FileText,
  Warehouse,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle as AlertCircleIcon,
  Settings,
  BarChart3
} from "lucide-react"
import { Container, getContainersByDepotId, getDepotById, Depot } from "@/lib/mockData"

export default function DepotContainersPage() {
  const router = useRouter()
  const params = useParams()
  const depotId = params?.depotId as string

  const [depot, setDepot] = useState<Depot | null>(null)
  const [containers, setContainers] = useState<Container[]>([])
  const [filteredContainers, setFilteredContainers] = useState<Container[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSize, setFilterSize] = useState<string>('all')

  useEffect(() => {
    if (depotId) {
      // Load depot info
      const depotData = getDepotById(depotId)
      if (depotData) {
        setDepot(depotData)
      }

      // Load containers
      const containerData = getContainersByDepotId(depotId)
      setContainers(containerData)
      setFilteredContainers(containerData)
    }
  }, [depotId])

  useEffect(() => {
    // Apply filters
    let filtered = containers

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.containerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.currentLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType)
    }

    // Size filter
    if (filterSize !== 'all') {
      filtered = filtered.filter(c => c.size === filterSize)
    }

    setFilteredContainers(filtered)
  }, [searchQuery, filterStatus, filterType, filterSize, containers])

  const stats = {
    total: containers.length,
    available: containers.filter(c => c.status === 'available').length,
    inUse: containers.filter(c => c.status === 'in-use').length,
    maintenance: containers.filter(c => c.status === 'maintenance').length,
    reserved: containers.filter(c => c.status === 'reserved').length
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return 'Sẵn sàng'
      case 'in-use': return 'Đang dùng'
      case 'maintenance': return 'Bảo trì'
      case 'reserved': return 'Đã đặt'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-500'
      case 'in-use': return 'bg-blue-500'
      case 'maintenance': return 'bg-orange-500'
      case 'reserved': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'dry': return 'Dry'
      case 'reefer': return 'Reefer'
      case 'opentop': return 'Open Top'
      case 'flatrack': return 'Flat Rack'
      case 'tank': return 'Tank'
      default: return type
    }
  }

  const getConditionLabel = (condition: string) => {
    switch(condition) {
      case 'excellent': return 'Tuyệt vời'
      case 'good': return 'Tốt'
      case 'fair': return 'Khá'
      case 'poor': return 'Cần sửa'
      default: return condition
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push('/dashboard/containers')}
              className="h-12 w-12 rounded-xl hover:scale-105 transition-all shadow-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Quản lý Container
                </h1>
              </div>
              {depot && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4" />
                    <span className="font-medium">{depot.name}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{depot.province}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 hover:shadow-md transition-all">
              <BarChart3 className="h-4 w-4" />
              Phân tích
            </Button>
            <Button variant="outline" className="gap-2 hover:shadow-md transition-all">
              <Download className="h-4 w-4" />
              Xuất Excel
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <FileText className="h-4 w-4" />
              Báo cáo
            </Button>
          </div>
        </div>

        {/* Statistics Cards - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tổng số</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-slate-900 dark:to-green-950 border-green-200/50 dark:border-green-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                  {stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0}%
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Sẵn sàng</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.available}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950 border-blue-200/50 dark:border-blue-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                  {stats.total > 0 ? Math.round((stats.inUse / stats.total) * 100) : 0}%
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Đang dùng</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.inUse}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-slate-900 dark:to-orange-950 border-orange-200/50 dark:border-orange-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <AlertCircleIcon className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Bảo trì</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.maintenance}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950 border-purple-200/50 dark:border-purple-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Đã đặt</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.reserved}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Depot Info Card - Enhanced */}
        {depot && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-slate-200/50 dark:border-slate-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-blue-600" />
                Thông tin Depot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{depot.address}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Sức chứa</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                    {depot.capacity} <span className="text-sm text-muted-foreground">containers</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Đang chứa</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                    {depot.containerCount} <span className="text-sm text-muted-foreground">containers</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Tỷ lệ sử dụng</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((depot.containerCount / depot.capacity) * 100)}%` }}
                      />
                    </div>
                    <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                      {Math.round((depot.containerCount / depot.capacity) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters - Enhanced */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-slate-200/50 dark:border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo số container, hãng tàu, vị trí..."
                  className="pl-12 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[200px] h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <SelectValue placeholder="Trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="available">Sẵn sàng</SelectItem>
                  <SelectItem value="in-use">Đang dùng</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                  <SelectItem value="reserved">Đã đặt</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px] h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="reefer">Reefer</SelectItem>
                  <SelectItem value="opentop">Open Top</SelectItem>
                  <SelectItem value="flatrack">Flat Rack</SelectItem>
                  <SelectItem value="tank">Tank</SelectItem>
                </SelectContent>
              </Select>

              {/* Size Filter */}
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger className="w-full md:w-[180px] h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <SelectValue placeholder="Kích thước" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kích thước</SelectItem>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                  <SelectItem value="45ft">45ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="font-bold text-blue-600 dark:text-blue-400">{filteredContainers.length}</span> trong tổng số <span className="font-bold text-slate-900 dark:text-slate-100">{containers.length}</span> containers
          </p>
        </div>

        {/* Container List - Enhanced */}
        <div className="space-y-4">
          {filteredContainers.length === 0 ? (
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-slate-200/50 dark:border-slate-800/50">
              <CardContent className="p-16">
                <div className="text-center">
                  <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                    <Package className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Không tìm thấy container</h3>
                  <p className="text-muted-foreground">
                    Không có container nào phù hợp với tiêu chí lọc của bạn.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredContainers.map((container) => (
              <Card key={container.id} className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border-slate-200/50 dark:border-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{container.containerId}</h3>
                        <Badge className={`${getStatusColor(container.status)} text-white px-4 py-1.5 text-sm font-semibold shadow-lg`}>
                          {getStatusLabel(container.status)}
                        </Badge>
                        <Badge variant="outline" className="font-bold text-sm border-2 px-3 py-1.5">
                          {container.size}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1.5">
                          {getTypeLabel(container.type)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-sm px-3 py-1.5 ${
                            container.condition === 'excellent' ? 'border-green-500 text-green-700 dark:text-green-400' :
                            container.condition === 'good' ? 'border-blue-500 text-blue-700 dark:text-blue-400' :
                            container.condition === 'fair' ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400' :
                            'border-red-500 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {getConditionLabel(container.condition)}
                        </Badge>
                      </div>

                      <Separator />

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3 group/item">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover/item:scale-110 transition-transform">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Hãng tàu</p>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{container.owner}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 group/item">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover/item:scale-110 transition-transform">
                            <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Vị trí trong depot</p>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{container.currentLocation}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 group/item">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover/item:scale-110 transition-transform">
                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Ngày nhập</p>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {new Date(container.inDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>

                        {container.lastInspection && (
                          <div className="flex items-start gap-3 group/item">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover/item:scale-110 transition-transform">
                              <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Kiểm tra cuối</p>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {new Date(container.lastInspection).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        )}

                        {container.estimatedOutDate && (
                          <div className="flex items-start gap-3 group/item">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover/item:scale-110 transition-transform">
                              <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Dự kiến xuất</p>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      {container.status === 'available' && (
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all gap-2">
                          <Download className="h-4 w-4" />
                          Đăng ký lấy
                        </Button>
                      )}
                      <Button size="lg" variant="outline" className="hover:shadow-lg transition-all gap-2">
                        <FileText className="h-4 w-4" />
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
