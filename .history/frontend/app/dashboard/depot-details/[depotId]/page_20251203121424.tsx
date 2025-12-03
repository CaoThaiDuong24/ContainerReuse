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
import { fetchActiveContainerTypes, ContainerType } from "@/lib/containerTypeService"
import { PickupContainerModal } from "@/components/pickup-container-modal"

export default function DepotDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const depotId = params.depotId as string

  const [containers, setContainers] = useState<Container[]>([])
  const [depot, setDepot] = useState<Depot | null>(null)
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([])
  const [containerTypes, setContainerTypes] = useState<ContainerType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter states
  const [selectedShippingLine, setSelectedShippingLine] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Modal states
  const [showPickupModal, setShowPickupModal] = useState(false)
  const [selectedContainer, setSelectedContainer] = useState<Container | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [depotId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [containersResponse, depotsResponse, shippingLinesResponse, containerTypesResponse] = await Promise.all([
        fetchContainers({ depotId }),
        fetchDepots(),
        getShippingLines({ status: 'active' }),
        fetchActiveContainerTypes(),
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

      if (containerTypesResponse.success && containerTypesResponse.data) {
        setContainerTypes(containerTypesResponse.data)
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
    return containerTypes.map(ct => ({ code: ct.code, name: ct.name }))
  }, [containerTypes])

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
    const containerType = containerTypes.find(ct => ct.code === type)
    return containerType ? containerType.name : type
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
    <div className="min-h-screen p-6">
      <div className="flex flex-col gap-4">
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
                <div className="flex items-center gap-4">
                  {/* Depot Logo - Only show if has real logo from API */}
                  {depot.logo && depot.logo.length > 0 && depot.logo.startsWith('http') ? (
                    <div className="h-16 w-24 rounded-lg overflow-hidden bg-white border-2 border-gray-200 shadow-sm flex-shrink-0">
                      <img 
                        src={depot.logo} 
                        alt={depot.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 shadow-sm flex-shrink-0 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-blue-700" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-blue-600" />
                      {depot.name}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      {depot.address}, {depot.province}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowPickupModal(true)}
            >
              <Package className="h-4 w-4" />
              Đăng ký lấy container
            </Button>

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
        </div>

        {/* Search and Filters */}
        <div className="shrink-0 pb-3">
          <div className="flex items-center gap-2 justify-end">
            {/* Search Bar */}
            <div className="relative w-[350px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm mã container, hãng tàu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 h-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

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

        {/* Containers List */}
        <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Danh sách Container
              </h2>
              <Badge variant="secondary" className="text-base">
                {filteredContainers.length} container
              </Badge>
            </div>
            
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
              <div className="grid grid-cols-4 gap-4 pb-4">
                {filteredContainers.map((container) => {
                  // Find shipping line info for logo
                  const shipLine = shippingLines.find(sl => 
                    sl.code === container.owner || sl.name === container.owner
                  );
                  
                  return (
                  <Card
                    key={container.id}
                    className="hover:shadow-lg transition-all duration-300 border-2 bg-white hover:scale-[1.02] hover:border-blue-400"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Shipping Line */}
                        <div className="flex items-center gap-2">
                          {shipLine?.logo ? (
                            <div 
                              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border"
                              style={{ borderColor: shipLine.colorTemplate || '#3b82f6' }}
                            >
                              <img 
                                src={`https://cms.ltacv.com${shipLine.logo}`}
                                alt={container.owner}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            </div>
                          ) : (
                            <div className="p-1.5 bg-blue-100 rounded">
                              <Ship className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
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

                        {/* Dates */}
                        {container.estimatedOutDate && (
                          <div className="pt-2 border-t border-gray-200">
                            <div className="text-xs text-gray-500">Ngày dự kiến xuất</div>
                            <div className="text-sm font-medium text-gray-800">
                              {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        )}

                        {/* Register Button */}
                        <Button 
                          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                          onClick={() => {
                            setSelectedContainer(container)
                            setShowPickupModal(true)
                          }}
                        >
                          Đăng ký lấy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )})}
              </div>
            )}
          </div>
      </div>

      {/* Pickup Container Modal */}
      <PickupContainerModal
        open={showPickupModal}
        onOpenChange={setShowPickupModal}
        container={selectedContainer}
        depotName={depot?.name}
        onSuccess={() => {
          setShowPickupModal(false)
          setSelectedContainer(undefined)
          loadData()
        }}
      />
    </div>
  )
}
