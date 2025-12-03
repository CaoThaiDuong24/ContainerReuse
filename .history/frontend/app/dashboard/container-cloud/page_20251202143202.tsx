"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Package, RefreshCw, Box, Layers, Ship, Container as ContainerIcon } from "lucide-react"
import { fetchContainers, Container } from "@/lib/containerService"
import { fetchDepots, Depot } from "@/lib/depotService"
import { getShippingLines, ShippingLine } from "@/lib/shippingLineService"
import { FilterSheet } from "./filter-sheet"
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
  
  const [showFilters, setShowFilters] = useState(false)
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.containerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.depotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [containers, selectedProvince, selectedDepot, selectedShippingLine, selectedSize, selectedType, searchTerm, filteredDepots])

  // Group containers by shipping line for the middle panel
  const shippingLineGroups = useMemo(() => {
    const groups: Record<string, { count: number; available: number; inUse: number }> = {}
    
    filteredContainers.forEach(container => {
      const owner = container.owner
      if (!groups[owner]) {
        groups[owner] = { count: 0, available: 0, inUse: 0 }
      }
      groups[owner].count++
      if (container.status === 'available') groups[owner].available++
      if (container.status === 'in-use') groups[owner].inUse++
    })
    
    return groups
  }, [filteredContainers])

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
    setSearchTerm("")
  }

  const hasActiveFilters = selectedProvince !== "all" || selectedDepot !== "all" || 
    selectedShippingLine !== "all" || selectedSize !== "all" || 
    selectedType !== "all" || searchTerm !== ""

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
      {/* Search and Filter Section - Compact with Sheet */}
      <Card className="shrink-0 shadow-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[250px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm mã container, depot, hãng tàu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 h-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Advanced Filter Sheet Trigger */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 border-gray-300"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                    Lọc nâng cao
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1.5 px-1.5 h-5 min-w-5 bg-blue-600 text-white">
                        {[selectedProvince, selectedDepot, selectedShippingLine, selectedSize, selectedType]
                          .filter(v => v !== "all").length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[450px] p-0 flex flex-col">
                  <SheetHeader className="p-6 pb-4 border-b shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <SheetTitle className="text-lg font-bold text-gray-900">
                            Bộ lọc nâng cao
                          </SheetTitle>
                          <SheetDescription className="text-xs text-gray-500">
                            Tùy chỉnh tiêu chí lọc container
                          </SheetDescription>
                        </div>
                      </div>
                    </div>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto px-6">
                    <div className="py-6 space-y-6">
                      {/* Location Filters */}
                      <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-600 rounded">
                            <MapPin className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900">Vị trí</h3>
                        </div>
                        
                        {/* Province */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Tỉnh/Thành phố
                          </label>
                          <Select value={selectedProvince} onValueChange={(value) => {
                            setSelectedProvince(value)
                            setSelectedDepot("all")
                          }}>
                            <SelectTrigger className={`w-full ${selectedProvince !== "all" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "bg-white"}`}>
                              <SelectValue placeholder="Chọn tỉnh/thành phố" />
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
                        </div>

                        {/* Depot */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Depot
                          </label>
                          <Select value={selectedDepot} onValueChange={setSelectedDepot}>
                            <SelectTrigger className={`w-full ${selectedDepot !== "all" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "bg-white"}`}>
                              <SelectValue placeholder="Chọn depot" />
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
                        </div>
                      </div>

                      {/* Shipping Line Filter */}
                      <div className="space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-600 rounded">
                            <Ship className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900">Hãng tàu</h3>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Chủ sở hữu
                          </label>
                          <Select value={selectedShippingLine} onValueChange={setSelectedShippingLine}>
                            <SelectTrigger className={`w-full ${selectedShippingLine !== "all" ? "border-green-500 bg-green-50 ring-2 ring-green-200" : "bg-white"}`}>
                              <SelectValue placeholder="Chọn hãng tàu" />
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
                      </div>

                      {/* Container Specifications */}
                      <div className="space-y-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-600 rounded">
                            <Package className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900">Quy cách Container</h3>
                        </div>
                        
                        {/* Size */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Kích thước
                          </label>
                          <Select value={selectedSize} onValueChange={setSelectedSize}>
                            <SelectTrigger className={`w-full ${selectedSize !== "all" ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200" : "bg-white"}`}>
                              <SelectValue placeholder="Chọn kích thước" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả kích thước</SelectItem>
                              <SelectItem value="20ft">📦 20ft</SelectItem>
                              <SelectItem value="40ft">📦 40ft</SelectItem>
                              <SelectItem value="45ft">📦 45ft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Loại container
                          </label>
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className={`w-full ${selectedType !== "all" ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200" : "bg-white"}`}>
                              <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả loại</SelectItem>
                              <SelectItem value="dry">🌾 Khô (Dry)</SelectItem>
                              <SelectItem value="reefer">❄️ Lạnh (Reefer)</SelectItem>
                              <SelectItem value="opentop">📦 Nóc mở (Open Top)</SelectItem>
                              <SelectItem value="flatrack">📐 Phẳng (Flat Rack)</SelectItem>
                              <SelectItem value="tank">🛢️ Bồn (Tank)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Filter Summary */}
                      {hasActiveFilters && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Filter className="h-4 w-4 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-amber-900 mb-1">
                                Đang áp dụng {[selectedProvince, selectedDepot, selectedShippingLine, selectedSize, selectedType].filter(v => v !== "all").length} bộ lọc
                              </p>
                              <p className="text-xs text-amber-700">
                                Hiển thị {filteredContainers.length} container phù hợp
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Fixed at bottom */}
                  <div className="p-4 bg-white border-t shadow-lg shrink-0">
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                        onClick={resetFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Xóa tất cả
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md"
                        onClick={() => setShowFilters(false)}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Refresh Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadData}
                disabled={loading}
                className="hover:bg-green-50 hover:text-green-600 border-gray-300"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Xóa lọc
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - 2 Columns Layout */}
      <div className="flex flex-1 gap-3 overflow-hidden">
        {/* Left: Dynamic List - Shows Depots or Containers based on filter */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-2 pt-3 shrink-0">
              {selectedDepot === "all" ? (
                <>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Danh sách Depot
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {filteredDepots.length} depot
                  </CardDescription>
                </>
              ) : (
                <>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <ContainerIcon className="h-5 w-5 text-blue-600" />
                    Danh sách Container
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Hiển thị {filteredContainers.length} container
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                      <div className="text-gray-500 font-medium">Đang tải dữ liệu...</div>
                    </div>
                  ) : selectedDepot === "all" ? (
                    /* Show Depot List */
                    filteredDepots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <MapPin className="h-16 w-16 text-gray-300" />
                        <div className="text-gray-500 font-medium">Không tìm thấy depot</div>
                        <p className="text-sm text-gray-400">Chưa có depot nào trong hệ thống</p>
                      </div>
                    ) : (
                      filteredDepots.map((depot) => {
                        const depotContainers = containers.filter(c => c.depotId === depot.id)
                        const totalContainers = depotContainers.length
                        
                        // Group by shipping line
                        const shippingLines = depotContainers.reduce((acc, container) => {
                          acc[container.owner] = (acc[container.owner] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                        
                        return (
                          <Card
                            key={depot.id}
                            className="hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-blue-400 bg-gradient-to-br from-white to-blue-50/30"
                            onClick={() => setSelectedDepot(depot.id)}
                          >
                            <CardContent className="p-4">
                              {/* Header: Depot Name & Total */}
                              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="p-1.5 bg-blue-100 rounded">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-900 truncate">{depot.name}</div>
                                    <div className="text-xs text-gray-500">{depot.province}</div>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-bold shrink-0">
                                  {totalContainers} <Package className="h-3 w-3 ml-1" />
                                </Badge>
                              </div>

                              {/* Shipping Lines Stats */}
                              {Object.keys(shippingLines).length > 0 ? (
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 font-medium">Hãng tàu:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(shippingLines).map(([line, count]) => (
                                      <Badge 
                                        key={line}
                                        variant="outline" 
                                        className="bg-green-50 border-green-200 text-green-700 text-xs"
                                      >
                                        {line}: <span className="font-bold ml-1">{count}</span>
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 italic">Chưa có container</div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })
                    )
                  ) : (
                    /* Show Container List */
                    filteredContainers.length === 0 ? (
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
                    )
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Map */}
        <div className="w-1/2 overflow-hidden">
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
