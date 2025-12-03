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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto p-4 md:p-6 space-y-4">
        {/* Header Section - Compact */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push('/dashboard/containers')}
              className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Quản lý Container
                </h1>
              </div>
              {depot && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <div className="flex items-center gap-1.5">
                    <Warehouse className="h-3 w-3" />
                    <span className="font-medium">{depot.name}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    <span>{depot.province}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 hidden md:flex">
              <BarChart3 className="h-3.5 w-3.5" />
              Phân tích
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 hidden md:flex">
              <Download className="h-3.5 w-3.5" />
              Xuất Excel
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <FileText className="h-3.5 w-3.5" />
              Báo cáo
            </Button>
          </div>
        </div>

        {/* Statistics Cards - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Tổng số</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs text-muted-foreground">Sẵn sàng</p>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-100 dark:bg-green-900/50 px-1.5 py-0.5 rounded">
                      {stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs text-muted-foreground">Đang dùng</p>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">
                      {stats.total > 0 ? Math.round((stats.inUse / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inUse}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Bảo trì</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.maintenance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <XCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Đã đặt</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.reserved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Depot Info Card - Compact */}
        {depot && (
          <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-blue-600" />
                Thông tin Depot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    Địa chỉ
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{depot.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Sức chứa</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {depot.capacity} <span className="text-xs text-muted-foreground">containers</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Đang chứa</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {depot.containerCount} <span className="text-xs text-muted-foreground">containers</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Tỷ lệ sử dụng</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((depot.containerCount / depot.capacity) * 100)}%` }}
                      />
                    </div>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
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

        {/* Container List - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredContainers.length === 0 ? (
            <Card className="col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-slate-200/50 dark:border-slate-800/50">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                    <Package className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Không tìm thấy container</h3>
                  <p className="text-sm text-muted-foreground">
                    Không có container nào phù hợp với tiêu chí lọc của bạn.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredContainers.map((container) => (
              <Card key={container.id} className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border-slate-200/50 dark:border-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700">
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate mb-2">
                        {container.containerId}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getStatusColor(container.status)} text-white px-2.5 py-0.5 text-xs font-semibold`}>
                          {getStatusLabel(container.status)}
                        </Badge>
                        <Badge variant="outline" className="font-semibold text-xs px-2 py-0.5">
                          {container.size}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {getTypeLabel(container.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid - Compact */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground min-w-[70px]">Hãng tàu:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{container.owner}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground min-w-[70px]">Vị trí:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{container.currentLocation}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground min-w-[70px]">Ngày nhập:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {new Date(container.inDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    {container.estimatedOutDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
                        <span className="text-muted-foreground min-w-[70px]">Dự kiến xuất:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">
                          {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {container.status === 'available' && (
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all gap-1.5 h-9">
                        <Download className="h-3.5 w-3.5" />
                        Đăng ký lấy
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1 hover:shadow-md transition-all gap-1.5 h-9">
                      <FileText className="h-3.5 w-3.5" />
                      Chi tiết
                    </Button>
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
