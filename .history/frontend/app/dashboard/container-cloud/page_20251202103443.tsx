"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Package, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchContainers, Container } from "@/lib/containerService"
import { fetchDepots, Depot } from "@/lib/depotService"

// Tọa độ các tỉnh/thành phố Việt Nam
const vietnamProvinces = [
  { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
  { name: "Hải Phòng", lat: 20.8449, lng: 106.6881 },
  { name: "Quảng Ninh", lat: 21.0064, lng: 107.2925 },
  { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
  { name: "Hồ Chí Minh", lat: 10.8231, lng: 106.6297 },
  { name: "Bà Rịa - Vũng Tàu", lat: 10.5417, lng: 107.2430 },
  { name: "Cần Thơ", lat: 10.0452, lng: 105.7469 },
]

export default function ContainerCloudPage() {
  const [containers, setContainers] = useState<Container[]>([])
  const [depots, setDepots] = useState<Depot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepot, setSelectedDepot] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [selectedDepotOnMap, setSelectedDepotOnMap] = useState<Depot | null>(null)

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
        return "bg-green-500"
      case "in-use":
        return "bg-blue-500"
      case "maintenance":
        return "bg-yellow-500"
      case "reserved":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
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

  // Hàm lấy tọa độ depot dựa trên tên tỉnh/thành
  const getDepotCoordinates = (depot: Depot) => {
    const province = vietnamProvinces.find(p => 
      depot.province?.includes(p.name) || depot.location?.includes(p.name)
    )
    if (province) {
      // Thêm offset ngẫu nhiên nhỏ để tránh các depot trùng vị trí
      return {
        lat: province.lat + (Math.random() - 0.5) * 0.1,
        lng: province.lng + (Math.random() - 0.5) * 0.1
      }
    }
    // Mặc định về Hồ Chí Minh nếu không tìm thấy
    return { lat: 10.8231, lng: 106.6297 }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Left Panel - Container List */}
      <div className="w-1/2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Danh sách Container
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm container theo ID hoặc depot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-2">
              <Select value={selectedDepot} onValueChange={setSelectedDepot}>
                <SelectTrigger>
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
                <SelectTrigger>
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

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
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

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Tìm thấy {filteredContainers.length} container</span>
              <Button variant="outline" size="sm" onClick={loadData}>
                <Filter className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Container List */}
        <Card className="flex-1">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="p-4 space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-gray-500">Đang tải...</div>
                  </div>
                ) : filteredContainers.length === 0 ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-gray-500">Không tìm thấy container</div>
                  </div>
                ) : (
                  filteredContainers.map((container) => (
                    <Card
                      key={container.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {container.containerId}
                              </h3>
                              <Badge className={getStatusColor(container.status)}>
                                {getStatusLabel(container.status)}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{container.depotName}</span>
                              </div>
                              <div className="flex gap-4">
                                <span>Loại: {getTypeLabel(container.type)}</span>
                                <span>Kích thước: {container.size}</span>
                              </div>
                              <div>
                                Chủ sở hữu: {container.owner}
                              </div>
                            </div>
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

      {/* Right Panel - Vietnam Map */}
      <div className="w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Bản đồ Depot - Việt Nam
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)]">
            <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
              {/* Vietnam Map SVG */}
              <svg
                viewBox="0 0 400 800"
                className="w-full h-full"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
              >
                {/* Simplified Vietnam outline */}
                <path
                  d="M 200 50 L 220 80 L 240 120 L 250 160 L 245 200 L 250 240 L 260 280 L 255 320 L 240 360 L 230 400 L 225 440 L 220 480 L 215 520 L 210 560 L 205 600 L 200 640 L 195 680 L 190 720 L 185 760 L 160 780 L 140 760 L 130 720 L 135 680 L 140 640 L 145 600 L 150 560 L 155 520 L 160 480 L 165 440 L 170 400 L 175 360 L 180 320 L 175 280 L 170 240 L 165 200 L 170 160 L 180 120 L 190 80 Z"
                  fill="#10b981"
                  fillOpacity="0.2"
                  stroke="#059669"
                  strokeWidth="2"
                />

                {/* Depot Markers */}
                {depots.map((depot) => {
                  const coords = getDepotCoordinates(depot)
                  // Convert lat/lng to SVG coordinates
                  const x = ((coords.lng - 102) / 11) * 400
                  const y = ((23 - coords.lat) / 15) * 800
                  
                  return (
                    <g
                      key={depot.id}
                      onMouseEnter={() => setSelectedDepotOnMap(depot)}
                      onMouseLeave={() => setSelectedDepotOnMap(null)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill={depot.status === "active" ? "#3b82f6" : "#9ca3af"}
                        stroke="white"
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill={depot.status === "active" ? "#3b82f6" : "#9ca3af"}
                        fillOpacity="0.3"
                        className="animate-ping"
                        style={{
                          animationDuration: "2s",
                          animationIterationCount: "infinite"
                        }}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Depot Info Tooltip */}
              {selectedDepotOnMap && (
                <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-10">
                  <h4 className="font-semibold text-lg mb-2">
                    {selectedDepotOnMap.name}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedDepotOnMap.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>
                        {selectedDepotOnMap.containerCount} / {selectedDepotOnMap.capacity} containers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={selectedDepotOnMap.status === "active" ? "default" : "secondary"}
                      >
                        {selectedDepotOnMap.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <h5 className="font-semibold mb-2 text-sm">Chú thích</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Depot hoạt động</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span>Depot ngừng hoạt động</span>
                  </div>
                  <div className="text-gray-600 mt-2">
                    Tổng: {depots.length} depot
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
