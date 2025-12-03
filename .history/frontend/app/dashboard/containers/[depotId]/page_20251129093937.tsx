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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-slate-100 dark:via-blue-400 dark:to-slate-100 bg-clip-text text-transparent">
                Quản lý Container
              </h1>
              {depot && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Warehouse className="h-4 w-4" />
                  {depot.name} - {depot.address}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-10 rounded-xl shadow-sm">
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
            <Button className="gap-2 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all">
              <Settings className="h-4 w-4" />
              Cài đặt
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Tổng số</p>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Package className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Sẵn sàng</p>
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.available}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Đang dùng</p>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.inUse}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Bảo trì</p>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <AlertCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{stats.maintenance}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200 dark:border-purple-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Đã đặt</p>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.reserved}</p>
            </CardContent>
          </Card>
        </div>

        {/* Depot Info Card - Enhanced */}
        {depot && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md">
                  <Warehouse className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
                  Thông tin Depot
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-950/20 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    Địa chỉ
                  </p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{depot.address}</p>
                </div>
                <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-slate-800/50 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sức chứa</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-2xl">
                    {depot.capacity} <span className="text-sm font-normal text-muted-foreground">containers</span>
                  </p>
                </div>
                <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-purple-50/50 dark:from-slate-800/50 dark:to-purple-950/20 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Đang chứa</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-2xl">
                    {depot.containerCount} <span className="text-sm font-normal text-muted-foreground">containers</span>
                  </p>
                </div>
                <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-950/20 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    Tỷ lệ sử dụng
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${Math.round((depot.containerCount / depot.capacity) * 100)}%` }}
                      />
                    </div>
                    <p className="font-bold text-blue-600 dark:text-blue-400 text-xl min-w-[50px] text-right">
                      {Math.round((depot.containerCount / depot.capacity) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters - Enhanced */}
        <Card className="bg-white dark:bg-slate-900 shadow-lg border dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo số container, hãng tàu, vị trí..."
                  className="pl-12 h-12 bg-white dark:bg-slate-800 border focus:ring-2 focus:ring-blue-500 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[200px] h-12 bg-white dark:bg-slate-800 border rounded-xl">
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
                <SelectTrigger className="w-full md:w-[180px] h-12 bg-white dark:bg-slate-800 border rounded-xl">
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
                <SelectTrigger className="w-full md:w-[180px] h-12 bg-white dark:bg-slate-800 border rounded-xl">
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
            <Card className="col-span-2 bg-white dark:bg-slate-900 shadow-lg border dark:border-slate-800">
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
              <Card key={container.id} className="group bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 border dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600">
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
