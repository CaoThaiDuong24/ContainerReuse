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
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (depotId) {
      setIsLoading(true)
      // Simulate loading delay for better UX
      setTimeout(() => {
        // Load depot info
        const depotData = getDepotById(depotId)
        if (depotData) {
          setDepot(depotData)
        }

        // Load containers
        const containerData = getContainersByDepotId(depotId)
        setContainers(containerData)
        setFilteredContainers(containerData)
        setIsLoading(false)
      }, 500)
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
      case 'available': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-500/20'
      case 'in-use': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-500/20'
      case 'maintenance': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700 hover:bg-orange-500/20'
      case 'reserved': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700 hover:bg-purple-500/20'
      default: return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'available': return <CheckCircle2 className="h-3 w-3" />
      case 'in-use': return <Clock className="h-3 w-3" />
      case 'maintenance': return <Settings className="h-3 w-3" />
      case 'reserved': return <AlertCircleIcon className="h-3 w-3" />
      default: return null
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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/10">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Navigation & Header */}
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard/containers')}
              className="w-fit -ml-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Quay lại danh sách kho
            </Button>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 border-none shadow-md">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </CardContent>
                </Card>
                <Skeleton className="h-full w-full" />
              </div>
            ) : depot && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Depot Info Card */}
                <Card className="lg:col-span-2 border-none shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/40 transition-shadow">
                        <Warehouse className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          {depot.name}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{depot.address}</span>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIsLoading(true)}
                            className="shrink-0"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Làm mới dữ liệu</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                      <div className="group p-3 md:p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tổng sức chứa</p>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{depot.capacity}</p>
                      </div>
                      <div className="group p-3 md:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-950/10 border border-blue-200 dark:border-blue-900/30 hover:shadow-md hover:shadow-blue-200/50 hover:scale-[1.02] transition-all duration-200">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">Đang chứa</p>
                        <p className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">{depot.containerCount}</p>
                      </div>
                      <div className="group p-3 md:p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 hover:shadow-md hover:shadow-emerald-200/50 hover:scale-[1.02] transition-all duration-200">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Sẵn sàng</p>
                        <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{stats.available}</p>
                      </div>
                      <div className="group p-3 md:p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-950/10 border border-orange-200 dark:border-orange-900/30 hover:shadow-md hover:shadow-orange-200/50 hover:scale-[1.02] transition-all duration-200">
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wider">Bảo trì</p>
                        <p className="text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-400 mt-1">{stats.maintenance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Capacity Status Card */}
                <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 bg-white dark:bg-slate-900 flex flex-col justify-center hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Công suất sử dụng</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                          {Math.round((depot.containerCount / depot.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={(depot.containerCount / depot.capacity) * 100} 
                          className="h-3 bg-slate-100 dark:bg-slate-800" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <span className="text-muted-foreground">Còn trống</span>
                        <span className="font-semibold">{depot.capacity - depot.containerCount} slots</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <span className="text-muted-foreground">Hiệu suất</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Tối ưu
                        </span>
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
