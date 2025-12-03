"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  MapPin, 
  Package, 
  ArrowLeft, 
  Box, 
  Layers, 
  Ship, 
  Filter,
  X,
  RefreshCw
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchContainers, Container } from "@/lib/containerService"
import { fetchDepots, Depot } from "@/lib/depotService"
import { getShippingLines, ShippingLine } from "@/lib/shippingLineService"

export default function DepotDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const depotId = params.depotId as string

  const [containers, setContainers] = useState<Container[]>([])
  const [depot, setDepot] = useState<Depot | null>(null)
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter states
  const [selectedShippingLine, setSelectedShippingLine] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [depotId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [containersResponse, depotsResponse, shippingLinesResponse] = await Promise.all([
        fetchContainers({ depotId }),
        fetchDepots(),
        getShippingLines({ status: 'active' }),
      ])

      if (containersResponse.success && containersResponse.data) {
        setContainers(containersResponse.data)
      }

      if (depotsResponse.success && depotsResponse.data) {
        const currentDepot = depotsResponse.data.find(d => d.id === depotId)
        setDepot(currentDepot || null)
      }

      if (shippingLinesResponse.success && shippingLinesResponse.data) {
        setShippingLines(shippingLinesResponse.data)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  const filteredContainers = useMemo(() => {
    let filtered = containers

    // Filter by shipping line
    if (selectedShippingLine !== "all") {
      filtered = filtered.filter(c => c.owner === selectedShippingLine)
    }

    // Filter by size
    if (selectedSize !== "all") {
      filtered = filtered.filter(c => c.size === selectedSize)
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(c => c.type === selectedType)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(c => c.status === selectedStatus)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.containerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [containers, selectedShippingLine, selectedSize, selectedType, selectedStatus, searchTerm])

  // Get unique values for filters
  const availableShippingLines = useMemo(() => {
    const uniqueOwners = Array.from(new Set(containers.map(c => c.owner).filter(Boolean)))
    return uniqueOwners.sort()
  }, [containers])

  const availableSizes = useMemo(() => {
    const uniqueSizes = Array.from(new Set(containers.map(c => c.size).filter(Boolean)))
    return uniqueSizes.sort()
  }, [containers])

  const availableTypes = useMemo(() => {
    const uniqueTypes = Array.from(new Set(containers.map(c => c.type).filter(Boolean)))
    return uniqueTypes.sort()
  }, [containers])

  const availableStatuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(containers.map(c => c.status).filter(Boolean)))
    return uniqueStatuses.sort()
  }, [containers])

  // Statistics
  const stats = useMemo(() => {
    const total = filteredContainers.length
    const available = filteredContainers.filter(c => c.status === 'available').length
    const inUse = filteredContainers.filter(c => c.status === 'in-use').length
    const maintenance = filteredContainers.filter(c => c.status === 'maintenance').length
    const reserved = filteredContainers.filter(c => c.status === 'reserved').length
    
    return { total, available, inUse, maintenance, reserved }
  }, [filteredContainers])

  // Reset filters
  const resetFilters = () => {
    setSelectedShippingLine("all")
    setSelectedSize("all")
    setSelectedType("all")
    setSelectedStatus("all")
    setSearchTerm("")
  }

  const hasActiveFilters = selectedShippingLine !== "all" || 
    selectedSize !== "all" || 
    selectedType !== "all" || 
    selectedStatus !== "all" ||
    searchTerm !== ""

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dry":
        return "Khô"
      case "reefer":
        return "Lạnh"
      case "opentop":
        return "Nóc mở"
      case "flatrack":
        return "Phẳng"
      case "tank":
        return "Bồn"
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'in-use':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'reserved':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn'
      case 'in-use':
        return 'Đang sử dụng'
      case 'maintenance':
        return 'Bảo trì'
      case 'reserved':
        return 'Đã đặt'
      default:
        return status
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4 p-6 overflow-hidden">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          
          <div className="flex-1">
            {depot && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  {depot.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {depot.address}, {depot.province}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">Tổng số</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">Có sẵn</p>
                  <p className="text-2xl font-bold text-green-900">{stats.available}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-sky-600 font-medium">Đang dùng</p>
                  <p className="text-2xl font-bold text-sky-900">{stats.inUse}</p>
                </div>
                <Package className="h-8 w-8 text-sky-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-600 font-medium">Bảo trì</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.maintenance}</p>
                </div>
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium">Đã đặt</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.reserved}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="shrink-0">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm mã container, hãng tàu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Shipping Line Filter */}
              <Select value={selectedShippingLine} onValueChange={setSelectedShippingLine}>
                <SelectTrigger className="w-[200px]">
                  <Ship className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Hãng tàu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hãng tàu</SelectItem>
                  {availableShippingLines.map((line) => (
                    <SelectItem key={line} value={line}>
                      {line}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Size Filter */}
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-[150px]">
                  <Layers className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kích thước" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kích thước</SelectItem>
                  {availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <Box className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                  Xóa lọc
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Containers List */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 shrink-0">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Danh sách Container
            </span>
            <Badge variant="secondary" className="text-base">
              {filteredContainers.length} container
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                  <div className="text-gray-500 font-medium">Đang tải dữ liệu...</div>
                </div>
              ) : filteredContainers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Package className="h-16 w-16 text-gray-300" />
                  <div className="text-gray-500 font-medium">Không tìm thấy container</div>
                  <p className="text-sm text-gray-400">
                    {hasActiveFilters ? "Thử thay đổi bộ lọc" : "Depot này chưa có container"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {filteredContainers.map((container) => (
                    <Card
                      key={container.id}
                      className="hover:shadow-lg transition-all duration-300 border-2 bg-white hover:scale-[1.02] hover:border-blue-400"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Container ID */}
                          <div className="pb-2 border-b border-gray-200">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Mã Container
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {container.containerId}
                            </div>
                          </div>

                          {/* Shipping Line */}
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded">
                              <Ship className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-500">Hãng tàu</div>
                              <div className="text-sm font-semibold text-gray-800 truncate">
                                {container.owner}
                              </div>
                            </div>
                          </div>

                          {/* Size & Type */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-green-100 rounded">
                                <Layers className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500">Size</div>
                                <div className="text-sm font-semibold text-gray-800">
                                  {container.size}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-purple-100 rounded">
                                <Box className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500">Loại</div>
                                <div className="text-sm font-semibold text-gray-800">
                                  {getTypeLabel(container.type)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="pt-2">
                            <Badge 
                              variant="outline" 
                              className={`w-full justify-center ${getStatusColor(container.status)}`}
                            >
                              {getStatusLabel(container.status)}
                            </Badge>
                          </div>

                          {/* Dates */}
                          {container.estimatedOutDate && (
                            <div className="pt-2 border-t border-gray-200">
                              <div className="text-xs text-gray-500">Ngày dự kiến xuất</div>
                              <div className="text-sm font-medium text-gray-800">
                                {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
