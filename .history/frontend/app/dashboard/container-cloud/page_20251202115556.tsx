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
    <div className="h-[calc(100vh-8rem)] p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Tổng Containers</p>
                <p className="text-white text-3xl font-bold mt-1">{filteredContainers.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Có sẵn</p>
                <p className="text-white text-3xl font-bold mt-1">
                  {filteredContainers.filter(c => c.status === 'available').length}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Box className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Tổng Depots</p>
                <p className="text-white text-3xl font-bold mt-1">{depots.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Đang sử dụng</p>
                <p className="text-white text-3xl font-bold mt-1">
                  {filteredContainers.filter(c => c.status === 'in-use').length}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100%-140px)]">
        {/* Left: Map Panel */}
        <div className="col-span-7 h-full">
          <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  Bản đồ Depot Việt Nam
                </CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                  {depots.filter(d => d.status === 'active').length} hoạt động
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4">
              <div className="h-full rounded-xl overflow-hidden shadow-inner border border-gray-200">
                <LeafletMapComponent depots={depots} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Container List */}
        <div className="col-span-5 h-full flex flex-col gap-4">
          {/* Search & Filter Panel */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm container..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={loadData}
                  disabled={loading}
                  className="hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedDepot} onValueChange={setSelectedDepot}>
                  <SelectTrigger className="h-9 flex-1 border-gray-300 text-sm">
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
                  <SelectTrigger className="h-9 flex-1 border-gray-300 text-sm">
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
                  <SelectTrigger className="h-9 flex-1 border-gray-300 text-sm">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                    <SelectItem value="45ft">45ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Container List */}
          <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50 to-indigo-50">
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Layers className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">Danh sách Container</span>
                </div>
                <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                  {filteredContainers.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                      <div className="text-gray-500 font-medium">Đang tải...</div>
                    </div>
                  ) : filteredContainers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <Package className="h-16 w-16 text-gray-300" />
                      <div className="text-gray-500 font-medium">Không có dữ liệu</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredContainers.map((container) => (
                        <Card
                          key={container.id}
                          className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 hover:border-l-blue-500 hover:scale-[1.02] bg-white"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-gray-900">
                                  {container.containerId}
                                </h3>
                                <Badge className={`${getStatusColor(container.status)} font-medium text-xs`}>
                                  {getStatusLabel(container.status)}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                <span className="font-medium">{container.depotName}</span>
                              </div>
                              
                              <div className="flex gap-2 items-center justify-between pt-2">
                                <div className="flex gap-2">
                                  <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                                    {getTypeLabel(container.type)}
                                  </span>
                                  <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                                    {container.size}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">{container.owner}</span>
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
      </div>
    </div>
  )
}
