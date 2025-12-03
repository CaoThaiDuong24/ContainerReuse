"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  BarChart3,
  Container as ContainerIcon,
  ArrowRight,
  Eye,
  RefreshCw
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
      case 'available': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      case 'in-use': return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'maintenance': return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'reserved': return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      default: return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800'
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

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/dashboard/containers')}
            className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại danh sách kho
          </Button>

          {depot && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Depot Info Card */}
              <Card className="lg:col-span-2 border-none shadow-md bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                      <Warehouse className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {depot.name}
                      </h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{depot.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tổng sức chứa</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{depot.capacity}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">Đang chứa</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">{depot.containerCount}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Sẵn sàng</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{stats.available}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wider">Bảo trì</p>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-400 mt-1">{stats.maintenance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Status Card */}
              <Card className="border-none shadow-md bg-white dark:bg-slate-900 flex flex-col justify-center">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Công suất sử dụng</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {Math.round((depot.containerCount / depot.capacity) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(depot.containerCount / depot.capacity) * 100} 
                      className="h-3 bg-slate-100 dark:bg-slate-800" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Còn trống</span>
                      <span className="font-medium">{depot.capacity - depot.containerCount} slots</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hiệu suất</span>
                      <span className="font-medium text-emerald-600">Tối ưu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Filters & Search */}
        <div className="sticky top-4 z-30">
          <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo ID, hãng tàu, vị trí..."
                    className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[160px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="available">Sẵn sàng</SelectItem>
                      <SelectItem value="in-use">Đang dùng</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                      <SelectItem value="reserved">Đã đặt</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
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

                  <Select value={filterSize} onValueChange={setFilterSize}>
                    <SelectTrigger className="w-[120px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                      <SelectValue placeholder="Kích thước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả size</SelectItem>
                      <SelectItem value="20ft">20ft</SelectItem>
                      <SelectItem value="40ft">40ft</SelectItem>
                      <SelectItem value="45ft">45ft</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchQuery || filterStatus !== 'all' || filterType !== 'all' || filterSize !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSearchQuery('')
                        setFilterStatus('all')
                        setFilterType('all')
                        setFilterSize('all')
                      }}
                      className="shrink-0"
                    >
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredContainers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Không tìm thấy container</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                Không có container nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh lại các tiêu chí tìm kiếm.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchQuery('')
                  setFilterStatus('all')
                  setFilterType('all')
                  setFilterSize('all')
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            filteredContainers.map((container) => (
              <Card key={container.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <CardContent className="p-0">
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                          <ContainerIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
                            {container.containerId}
                          </h3>
                          <p className="text-xs text-muted-foreground font-medium">{container.owner}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(container.status)} border`}>
                        {getStatusLabel(container.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200">
                        {container.size}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200">
                        {getTypeLabel(container.type)}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium uppercase">Vị trí</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 pl-5">
                          {container.currentLocation}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium uppercase">Ngày nhập</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 pl-5">
                          {new Date(container.inDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    {container.estimatedOutDate && (
                      <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center gap-3">
                        <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <div className="flex-1">
                          <p className="text-xs text-orange-600/80 dark:text-orange-400/80 font-medium">Dự kiến xuất</p>
                          <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
                            {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      {container.status === 'available' ? (
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20">
                          <Download className="h-4 w-4 mr-2" />
                          Đăng ký lấy
                        </Button>
                      ) : (
                        <Button disabled variant="secondary" className="flex-1 opacity-50">
                          Không khả dụng
                        </Button>
                      )}
                      <Button variant="outline" size="icon" className="shrink-0 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <ArrowRight className="h-4 w-4 text-slate-500" />
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
