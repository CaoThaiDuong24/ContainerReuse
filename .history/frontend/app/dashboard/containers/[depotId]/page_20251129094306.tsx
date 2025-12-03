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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto p-4 md:p-6 space-y-4">
        {/* Header with Back Button and Depot Info */}
        {depot && (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard/containers')}
              className="hover:bg-slate-200 dark:hover:bg-slate-800 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
            
            <div className="flex-1 flex flex-wrap items-center gap-2 md:gap-4 bg-white dark:bg-slate-900 rounded-lg px-4 py-3 shadow-sm border dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-slate-900 dark:text-slate-100">{depot.address}</span>
              </div>
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Sức chứa: </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{depot.capacity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Đang chứa: </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{depot.containerCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((depot.containerCount / depot.capacity) * 100)}%` }}
                    />
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {Math.round((depot.containerCount / depot.capacity) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Filters - Compact */}
        <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="lg:col-span-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm container..."
                  className="pl-9 h-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
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

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Loại container" />
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
                <SelectTrigger className="h-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
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

            {/* Results Count */}
            <div className="mt-3 pt-3 border-t dark:border-slate-800">
              <p className="text-xs text-muted-foreground">
                Hiển thị <span className="font-bold text-blue-600 dark:text-blue-400">{filteredContainers.length}</span> / <span className="font-semibold">{containers.length}</span> containers
              </p>
            </div>
          </CardContent>
        </Card>


        {/* Container List - Optimized Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredContainers.length === 0 ? (
            <Card className="col-span-full bg-white dark:bg-slate-900 border dark:border-slate-800">
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
              <Card key={container.id} className="group bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-200 border dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700">
                <CardContent className="p-4">
                  {/* Header - Compact */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md shadow-sm">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                          {container.containerId}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge className={`${getStatusColor(container.status)} text-white px-2 py-0 text-[10px] font-semibold`}>
                            {getStatusLabel(container.status)}
                          </Badge>
                          <Badge variant="outline" className="font-medium text-[10px] px-1.5 py-0 border-slate-300 dark:border-slate-600">
                            {container.size}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-slate-300 dark:border-slate-600">
                            {getTypeLabel(container.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* Details - 2 Column Layout */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3 text-xs">
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground text-[10px]">Hãng:</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{container.owner}</span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground text-[10px]">Vị trí:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{container.currentLocation}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-[10px]">Ngày nhập</p>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {new Date(container.inDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {container.estimatedOutDate && (
                      <div>
                        <div className="flex items-start gap-1.5">
                          <Clock className="h-3 w-3 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-muted-foreground text-[10px]">Dự kiến xuất</p>
                            <p className="font-medium text-orange-600 dark:text-orange-400">
                              {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Compact */}
                  <div className="flex gap-2 mt-3">
                    {container.status === 'available' && (
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm h-8 text-xs gap-1.5">
                        <Download className="h-3 w-3" />
                        Đăng ký lấy
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5 border-slate-300 dark:border-slate-600">
                      <FileText className="h-3 w-3" />
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
