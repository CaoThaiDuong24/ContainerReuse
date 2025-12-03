"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
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
import "leaflet/dist/leaflet.css"

// Import Map component dynamically to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-gray-500">Đang tải bản đồ...</div>
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
            <MapComponent depots={depots} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
