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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push('/dashboard/containers')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Danh sách Container</h1>
            {depot && (
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Warehouse className="h-4 w-4" />
                <span>{depot.name}</span>
                <span>•</span>
                <MapPin className="h-4 w-4" />
                <span>{depot.province}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Báo cáo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Tổng số</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Sẵn sàng</p>
              <p className="text-3xl font-bold text-green-600">{stats.available}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Đang dùng</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inUse}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Bảo trì</p>
              <p className="text-3xl font-bold text-orange-600">{stats.maintenance}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Đã đặt</p>
              <p className="text-3xl font-bold text-purple-600">{stats.reserved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Depot Info Card */}
      {depot && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Địa chỉ</p>
                <p className="font-medium">{depot.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sức chứa</p>
                <p className="font-medium">{depot.capacity} containers</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đang chứa</p>
                <p className="font-medium">{depot.containerCount} containers</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tỷ lệ sử dụng</p>
                <p className="font-medium">{Math.round((depot.containerCount / depot.capacity) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo số container, hãng tàu, vị trí..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
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
              <SelectTrigger className="w-full md:w-[180px]">
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
              <SelectTrigger className="w-full md:w-[180px]">
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <span className="font-semibold text-foreground">{filteredContainers.length}</span> trong tổng số <span className="font-semibold text-foreground">{containers.length}</span> containers
        </p>
      </div>

      {/* Container List */}
      <div className="space-y-3">
        {filteredContainers.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy container</h3>
                <p className="text-muted-foreground">
                  Không có container nào phù hợp với tiêu chí lọc của bạn.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredContainers.map((container) => (
            <Card key={container.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold">{container.containerId}</h3>
                      <Badge className={`${getStatusColor(container.status)} text-white`}>
                        {getStatusLabel(container.status)}
                      </Badge>
                      <Badge variant="outline" className="font-semibold">
                        {container.size}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(container.type)}
                      </Badge>
                      <Badge variant="outline">
                        {getConditionLabel(container.condition)}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Hãng tàu</p>
                          <p className="font-medium">{container.owner}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Vị trí trong depot</p>
                          <p className="font-medium">{container.currentLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Ngày nhập</p>
                          <p className="font-medium">
                            {new Date(container.inDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      {container.lastInspection && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Kiểm tra cuối</p>
                            <p className="font-medium">
                              {new Date(container.lastInspection).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      )}

                      {container.estimatedOutDate && (
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Dự kiến xuất</p>
                            <p className="font-medium">
                              {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-6 flex flex-col gap-2">
                    {container.status === 'available' && (
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Đăng ký lấy
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
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
  )
}
