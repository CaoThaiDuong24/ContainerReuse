"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Package, Filter, RefreshCw, Box, Layers, TrendingUp, ChevronDown, ChevronUp, Ship, Container as ContainerIcon, BarChart3 } from "lucide-react"
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
import "leaflet/dist/leaflet.css"

// Import Map component dynamically to avoid SSR issues
const LeafletMapComponent = dynamic(
  () => import("./leaflet-google-map").catch(() => {
    // Fallback component if map fails to load
    return {
      default: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500">Không thể tải bản đồ</div>
          </div>
        </div>
      )
    }
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Đang tải bản đồ...</div>
        </div>
      </div>
    ),
  }
)

export default function ContainerCloudPage() {
  const [containers, setContainers] = useState<Container[]>([])
  const [depots, setDepots] = useState<Depot[]>([])
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter states
  const [selectedProvince, setSelectedProvince] = useState<string>("all")
  const [selectedDepot, setSelectedDepot] = useState<string>("all")
  const [selectedShippingLine, setSelectedShippingLine] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  
  const [showFilters, setShowFilters] = useState(true)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    setMapReady(true)
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [containersResponse, depotsResponse, shippingLinesResponse] = await Promise.all([
        fetchContainers(),
        fetchDepots(),
        getShippingLines({ status: 'active' }),
      ])

      if (containersResponse.success && containersResponse.data) {
        setContainers(containersResponse.data)
      }

      if (depotsResponse.success && depotsResponse.data) {
        setDepots(depotsResponse.data)
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

  // Get unique provinces from depots
  const provinces = useMemo(() => {
    const uniqueProvinces = Array.from(new Set(depots.map(d => d.province).filter(Boolean)))
    return uniqueProvinces.sort()
  }, [depots])

  // Filter depots based on selected province
  const filteredDepots = useMemo(() => {
    if (selectedProvince === "all") return depots
    return depots.filter(d => d.province === selectedProvince)
  }, [depots, selectedProvince])

  // Filter shipping lines based on containers in filtered depots
  const availableShippingLines = useMemo(() => {
    let filtered = containers
    
    if (selectedProvince !== "all") {
      const depotIds = filteredDepots.map(d => d.id)
      filtered = filtered.filter(c => depotIds.includes(c.depotId))
    }
    
    if (selectedDepot !== "all") {
      filtered = filtered.filter(c => c.depotId === selectedDepot)
    }
    
    const uniqueOwners = Array.from(new Set(filtered.map(c => c.owner).filter(Boolean)))
    return uniqueOwners.sort()
  }, [containers, selectedProvince, selectedDepot, filteredDepots])

  // Main filter logic with cascade effect
  const filteredContainers = useMemo(() => {
    let filtered = containers

    // Filter by province (through depot)
    if (selectedProvince !== "all") {
      const depotIds = filteredDepots.map(d => d.id)
      filtered = filtered.filter(c => depotIds.includes(c.depotId))
    }

    // Filter by depot
    if (selectedDepot !== "all") {
      filtered = filtered.filter(c => c.depotId === selectedDepot)
    }

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
        c.depotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [containers, selectedProvince, selectedDepot, selectedShippingLine, selectedSize, selectedType, selectedStatus, searchTerm, filteredDepots])

  // Statistics
  const stats = useMemo(() => {
    const total = filteredContainers.length
    const available = filteredContainers.filter(c => c.status === 'available').length
    const inUse = filteredContainers.filter(c => c.status === 'in-use').length
    const maintenance = filteredContainers.filter(c => c.status === 'maintenance').length
    const reserved = filteredContainers.filter(c => c.status === 'reserved').length
    
    return { total, available, inUse, maintenance, reserved }
  }, [filteredContainers])

  // Reset all filters
  const resetFilters = () => {
    setSelectedProvince("all")
    setSelectedDepot("all")
    setSelectedShippingLine("all")
    setSelectedSize("all")
    setSelectedType("all")
    setSelectedStatus("all")
    setSearchTerm("")
  }

  const hasActiveFilters = selectedProvince !== "all" || selectedDepot !== "all" || 
    selectedShippingLine !== "all" || selectedSize !== "all" || 
    selectedType !== "all" || selectedStatus !== "all" || searchTerm !== ""

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "in-use":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "reserved":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Có sẵn"
      case "in-use":
        return "Đang sử dụng"
      case "maintenance":
        return "Bảo trì"
      case "reserved":
        return "Đã đặt"
      default:
        return status
    }
  }

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

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-3 p-4 overflow-hidden">
      {/* Statistics Bar */}
      <div className="grid grid-cols-5 gap-3 shrink-0">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 font-medium">Tổng số</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <Box className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-green-600 font-medium">Có sẵn</div>
              <div className="text-2xl font-bold text-green-900">{stats.available}</div>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-purple-600 font-medium">Đang dùng</div>
              <div className="text-2xl font-bold text-purple-900">{stats.inUse}</div>
            </div>
            <ContainerIcon className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-600 font-medium">Bảo trì</div>
              <div className="text-2xl font-bold text-amber-900">{stats.maintenance}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-amber-600" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-indigo-600 font-medium">Đã đặt</div>
              <div className="text-2xl font-bold text-indigo-900">{stats.reserved}</div>
            </div>
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="shrink-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã container, depot, hãng tàu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 bg-white border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <Button 
              variant="outline"
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className="hover:bg-blue-50 hover:text-blue-600 shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>

            {/* Refresh */}
            <Button 
              variant="outline" 
              size="default" 
              onClick={loadData}
              disabled={loading}
              className="hover:bg-green-50 hover:text-green-600 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="default"
                onClick={resetFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
              {/* Row 1: Location Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-semibold uppercase w-20">Khu vực:</span>
                
                <Select value={selectedProvince} onValueChange={(value) => {
                  setSelectedProvince(value)
                  setSelectedDepot("all") // Reset depot when province changes
                }}>
                  <SelectTrigger className="h-8 w-[160px] bg-white border-gray-300 text-xs">
                    <SelectValue placeholder="Tỉnh/TP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả tỉnh/TP</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDepot} onValueChange={setSelectedDepot}>
                  <SelectTrigger className="h-8 w-[180px] bg-white border-gray-300 text-xs">
                    <SelectValue placeholder="Depot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả Depot</SelectItem>
                    {filteredDepots.map((depot) => (
                      <SelectItem key={depot.id} value={depot.id}>
                        {depot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedShippingLine} onValueChange={setSelectedShippingLine}>
                  <SelectTrigger className="h-8 w-[160px] bg-white border-gray-300 text-xs">
                    <SelectValue placeholder="Hãng tàu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả hãng</SelectItem>
                    {availableShippingLines.map((line) => (
                      <SelectItem key={line} value={line}>
                        {line}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 2: Container Specifications */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-semibold uppercase w-20">Quy cách:</span>
                
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="h-8 w-[120px] bg-white border-gray-300 text-xs">
                    <SelectValue placeholder="Kích thước" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                    <SelectItem value="45ft">45ft</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-xs">
                    <SelectValue placeholder="Loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="dry">Khô</SelectItem>
                    <SelectItem value="reefer">Lạnh</SelectItem>
                    <SelectItem value="opentop">Nóc mở</SelectItem>
                    <SelectItem value="flatrack">Phẳng</SelectItem>
                    <SelectItem value="tank">Bồn</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-8 w-[140px] bg-white border-gray-300 text-xs">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="available">Có sẵn</SelectItem>
                    <SelectItem value="in-use">Đang dùng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                    <SelectItem value="reserved">Đã đặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content - 3 Columns Layout */}
      <div className="flex flex-1 gap-3 overflow-hidden">
        {/* Left: Container List */}
        <div className="w-2/5 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-2 pt-3 shrink-0">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <ContainerIcon className="h-5 w-5 text-blue-600" />
                Danh sách Container
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Hiển thị {filteredContainers.length} container
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                      <div className="text-gray-500 font-medium">Đang tải dữ liệu...</div>
                    </div>
                  ) : filteredContainers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <Package className="h-16 w-16 text-gray-300" />
                      <div className="text-gray-500 font-medium">Không tìm thấy container</div>
                      <p className="text-sm text-gray-400">Thử thay đổi bộ lọc</p>
                    </div>
                  ) : (
                    filteredContainers.map((container) => (
                      <Card
                        key={container.id}
                        className="hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-blue-400 bg-white"
                      >
                        <CardContent className="p-3">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm text-gray-900 truncate">
                                {container.containerId}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {container.depotName}
                              </div>
                            </div>
                            <Badge className={getStatusColor(container.status) + " text-xs shrink-0 ml-2"}>
                              {getStatusLabel(container.status)}
                            </Badge>
                          </div>
                          
                          {/* Details */}
                          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <Ship className="h-3.5 w-3.5 text-blue-600" />
                              <span className="text-xs text-gray-600">{container.owner}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Layers className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs text-gray-600">{container.size}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Box className="h-3.5 w-3.5 text-purple-600" />
                              <span className="text-xs text-gray-600">{getTypeLabel(container.type)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Package className="h-3.5 w-3.5 text-amber-600" />
                              <span className="text-xs text-gray-600 capitalize">{container.condition}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Middle: Depot List */}
        <div className="w-1/5 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-2 pt-3 shrink-0">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5 text-green-600" />
                Depot
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {filteredDepots.length} depot
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {filteredDepots.map((depot) => {
                    const depotContainerCount = filteredContainers.filter(c => c.depotId === depot.id).length
                    
                    return (
                      <Card
                        key={depot.id}
                        className={`hover:shadow-md transition-all cursor-pointer border ${
                          selectedDepot === depot.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-blue-400 bg-white'
                        }`}
                        onClick={() => setSelectedDepot(depot.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-gray-900 truncate">{depot.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{depot.province}</div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs shrink-0 ml-1">
                              {depotContainerCount}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Map */}
        <div className="w-2/5 overflow-hidden">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 pt-3 shrink-0">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5 text-red-600" />
                Bản đồ Depot
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Vị trí các depot trên toàn quốc
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-3">
              <div className="h-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner">
                {mapReady ? (
                  <LeafletMapComponent depots={filteredDepots} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-gray-500">Đang khởi tạo bản đồ...</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
