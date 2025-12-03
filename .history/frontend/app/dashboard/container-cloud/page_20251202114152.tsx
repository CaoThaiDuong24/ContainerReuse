"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Package, Filter, RefreshCw, Box, Layers, TrendingUp } from "lucide-react"
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
const LeafletMapComponent = dynamic(() => import("./leaflet-google-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-500">Đang tải bản đồ...</div>
      </div>
    </div>
  ),
})

export default function ContainerCloudPage() {
  const [containers, setContainers] = useState<Container[]>([])
  const [depots, setDepots] = useState<Depot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepot, setSelectedDepot] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")

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
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Tổng Container</p>
                <p className="text-2xl font-bold text-blue-900">{containers.length}</p>
              </div>
              <Box className="h-10 w-10 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Có sẵn</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {containers.filter(c => c.status === 'available').length}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-emerald-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Depot</p>
                <p className="text-2xl font-bold text-purple-900">{depots.length}</p>
              </div>
              <MapPin className="h-10 w-10 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Loại hình</p>
                <p className="text-2xl font-bold text-amber-900">
                  {new Set(containers.map(c => c.type)).size}
                </p>
              </div>
              <Layers className="h-10 w-10 text-amber-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Panel - Container List */}
        <div className="w-1/2 flex flex-col gap-4 overflow-hidden">
          <Card className="shrink-0 shadow-lg border-gray-200">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Package className="h-5 w-5 text-blue-600" />
                Danh sách Container
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Quản lý và tìm kiếm container theo depot, loại và kích thước
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm container theo ID hoặc depot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-3 gap-3">
                <Select value={selectedDepot} onValueChange={setSelectedDepot}>
                  <SelectTrigger className="bg-white border-gray-300">
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
                  <SelectTrigger className="bg-white border-gray-300">
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
                  <SelectTrigger className="bg-white border-gray-300">
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

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">
                  Tìm thấy <span className="text-blue-600 font-bold">{filteredContainers.length}</span> container
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadData}
                  disabled={loading}
                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
              </div>
            </CardContent>
          </Card>

        {/* Container List */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-gray-500">Đang tải...</div>
                  </div>
                ) : filteredContainers.length === 0 ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-gray-500">Không tìm thấy container</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredContainers.map((container) => (
                      <Card
                        key={container.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm">
                                {container.containerId}
                              </h3>
                              <Badge className={getStatusColor(container.status)} variant="outline">
                                {getStatusLabel(container.status)}
                              </Badge>
                            </div>
                            <div className="space-y-1.5 text-xs text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{container.depotName}</span>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                                  {getTypeLabel(container.type)}
                                </span>
                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs">
                                  {container.size}
                                </span>
                              </div>
                              <div className="truncate text-xs">
                                <span className="text-gray-500">Chủ:</span> {container.owner}
                              </div>
                            </div>
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

      {/* Right Panel - Vietnam Map */}
      <div className="w-1/2 overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3 shrink-0">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Bản đồ Depot - Việt Nam
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4">
            <LeafletMapComponent depots={depots} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
