"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Package, Filter, RefreshCw, Box, Layers, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchContainers, Container } from "@/lib/containerService"
import { fetchDepots, Depot } from "@/lib/depotService"
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
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepot, setSelectedDepot] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    // Wait for component to mount before showing map
    setMapReady(true)
  }, [])

  useEffect(() => {
    loadData()
  }, [selectedDepot, selectedType, selectedSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const [containersResponse, depotsResponse] = await Promise.all([
        fetchContainers({
          depotId: selectedDepot !== "all" ? selectedDepot : undefined,
          type: selectedType !== "all" ? selectedType : undefined,
          size: selectedSize !== "all" ? selectedSize : undefined,
        }),
        fetchDepots(),
      ])

      if (containersResponse.success && containersResponse.data) {
        setContainers(containersResponse.data)
      }

      if (depotsResponse.success && depotsResponse.data) {
        setDepots(depotsResponse.data)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContainers = containers.filter((container) =>
    container.containerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.depotName.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      {/* Compact Filter Section */}
      <Card className="shrink-0">
        <CardContent className="p-3">
          {/* Single Row: Search + Filters + Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm container..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 bg-white border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle Button */}
            <Button 
              variant="outline"
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className="hover:bg-blue-50 hover:text-blue-600 shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Lọc
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>

            {/* Refresh Button */}
            <Button 
              variant="outline" 
              size="default" 
              onClick={loadData}
              disabled={loading}
              className="hover:bg-green-50 hover:text-green-600 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 flex-wrap">
              <span className="text-sm text-gray-500 font-medium">Bộ lọc:</span>
              
              <Select value={selectedDepot} onValueChange={setSelectedDepot}>
                <SelectTrigger className="h-9 w-[180px] bg-white border-gray-300">
                  <SelectValue placeholder="Depot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Depot</SelectItem>
                  {depots.map((depot) => (
                    <SelectItem key={depot.id} value={depot.id}>
                      {depot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-9 w-[140px] bg-white border-gray-300">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="dry">Khô</SelectItem>
                  <SelectItem value="reefer">Lạnh</SelectItem>
                  <SelectItem value="opentop">Nóc mở</SelectItem>
                  <SelectItem value="flatrack">Phẳng</SelectItem>
                  <SelectItem value="tank">Bồn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="h-9 w-[140px] bg-white border-gray-300">
                  <SelectValue placeholder="Kích thước" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                  <SelectItem value="45ft">45ft</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Clear Filters */}
              {(selectedDepot !== "all" || selectedType !== "all" || selectedSize !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedDepot("all")
                    setSelectedType("all")
                    setSelectedSize("all")
                  }}
                  className="text-gray-500 hover:text-gray-700 h-9"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content - Container List and Map */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Panel - Depot List */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-2 pt-3 shrink-0">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5 text-blue-600" />
                Danh sách Depot
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Thông tin các depot và số lượng container
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <div className="text-gray-500 font-medium">Đang tải dữ liệu...</div>
                  </div>
                ) : depots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <MapPin className="h-16 w-16 text-gray-300" />
                    <div className="text-gray-500 font-medium">Không tìm thấy depot</div>
                    <p className="text-sm text-gray-400">Chưa có depot nào trong hệ thống</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {depots.map((depot) => {
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
                                  <div className="text-xs text-gray-500">{depot.address}</div>
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
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Vietnam Map */}
        <div className="w-1/2 overflow-hidden">
          <Card className="h-full flex flex-col">
          <CardHeader className="pb-2 pt-3 shrink-0">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <MapPin className="h-5 w-5 text-green-600" />
              Bản đồ Depot - Việt Nam
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Vị trí các depot trên toàn quốc
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-3">
            <div className="h-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner">
              {mapReady ? (
                <LeafletMapComponent depots={depots} />
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
