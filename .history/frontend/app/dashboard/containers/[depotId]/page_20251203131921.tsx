"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  BarChart3,
  Container as ContainerIcon,
  ArrowRight,
  Eye,
  RefreshCw
} from "lucide-react"
import { fetchDepotById, Depot } from "@/lib/depotService"
import { Container, fetchContainersByDepotId } from "@/lib/containerService"
import { PickupContainerModal } from "@/components/pickup-container-modal"
import { fetchActiveContainerTypes, ContainerType } from "@/lib/containerTypeService"

export default function DepotContainersPage() {
  const router = useRouter()
  const params = useParams()
  const depotId = params?.depotId as string

  const [depot, setDepot] = useState<Depot | null>(null)
  const [containers, setContainers] = useState<Container[]>([])
  const [filteredContainers, setFilteredContainers] = useState<Container[]>([])
  const [containerTypes, setContainerTypes] = useState<ContainerType[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSize, setFilterSize] = useState<string>('all')
  const [pickupModalOpen, setPickupModalOpen] = useState(false)
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (depotId) {
      loadData()
    }
  }, [depotId])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Load depot info from API
      const depotResponse = await fetchDepotById(depotId)
      if (depotResponse.success && depotResponse.data) {
        setDepot(depotResponse.data)
        console.log('Depot loaded:', depotResponse.data)
      } else {
        console.error('Failed to load depot:', depotResponse.error)
      }

      // Load container types from API
      const typesResponse = await fetchActiveContainerTypes()
      if (typesResponse.success && typesResponse.data) {
        setContainerTypes(typesResponse.data)
      }

      // Load containers from API - get ALL containers first
      const containerResponse = await fetchContainersByDepotId(depotId)
      console.log('Container API response:', containerResponse)
      
      if (containerResponse.success && containerResponse.data) {
        console.log('Containers received:', containerResponse.data.length)
        
        setContainers(containerResponse.data)
        setFilteredContainers(containerResponse.data)
        
        if (containerResponse.data.length === 0) {
          setError(`Không có container nào tại depot này. Depot ID trong URL: ${depotId}`)
        }
      } else {
        setError(containerResponse.error || 'Không thể tải dữ liệu container')
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

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

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType)
    }

    // Size filter
    if (filterSize !== 'all') {
      filtered = filtered.filter(c => c.size === filterSize)
    }

    setFilteredContainers(filtered)
  }, [searchQuery, filterType, filterSize, containers])



  const getTypeLabel = (type: string) => {
    // Map type codes to Vietnamese labels (without size info)
    const typeLabels: Record<string, string> = {
      'GP': 'Khô (GP)',
      'HC': 'Cao (HC)', 
      'RF': 'Lạnh (RF)',
      'UT': 'Nóc mở (UT)',
      'PC': 'Phẳng (PC)',
      'PF': 'Phẳng cố định (PF)',
      'TN': 'Bồn (TN)'
    }
    return typeLabels[type] || type
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Navigation & Header */}
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard/containers')}
              className="w-fit -ml-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Quay lại danh sách kho
            </Button>

            {depot && (
              <Card className="border-none shadow-md bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md shadow-blue-600/20">
                      <Warehouse className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                        {depot.name}
                      </h1>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs truncate">{depot.address}</span>
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={loadData}
                          className="shrink-0 h-8 w-8"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Làm mới</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Filters & Search */}
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>
                      {error}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-4"
                        onClick={loadData}
                      >
                        Thử lại
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo ID, hãng tàu, vị trí..."
                      className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[140px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors">
                        <SelectValue placeholder="Loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả loại</SelectItem>
                        {containerTypes.map((type) => (
                          <SelectItem key={type.id} value={type.code}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterSize} onValueChange={setFilterSize}>
                      <SelectTrigger className="w-[120px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors">
                        <SelectValue placeholder="Kích thước" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả size</SelectItem>
                        {[...new Set(containerTypes.map(t => t.containerSize).filter((s): s is string => !!s))]
                          .sort()
                          .map((apiSize) => {
                            // Map API size format to container size format
                            const sizeMap: Record<string, string> = {
                              "20'": "20ft",
                              "40'": "40ft",
                              "45'": "45ft"
                            }
                            const containerSize = sizeMap[apiSize] || apiSize
                            return (
                              <SelectItem key={containerSize} value={containerSize}>
                                {containerSize}
                              </SelectItem>
                            )
                          })}
                      </SelectContent>
                    </Select>

                    {(searchQuery || filterType !== 'all' || filterSize !== 'all') && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                          onClick={() => {
                            setSearchQuery('')
                            setFilterType('all')
                            setFilterSize('all')
                          }}
                            className="shrink-0 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <XCircle className="w-4 h-4 text-muted-foreground hover:text-red-600 transition-colors" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Xóa tất cả bộ lọc</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Container Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="p-4">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : filteredContainers.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Package className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Không tìm thấy container</h3>
                  <p className="text-muted-foreground max-w-md mt-2 leading-relaxed">
                    Không có container nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh lại các tiêu chí tìm kiếm.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => {
                      setSearchQuery('')
                      setFilterType('all')
                      setFilterSize('all')
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                filteredContainers.map((container, index) => (
                  <Card 
                    key={container.id} 
                    className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-0">
                      {/* Card Header */}
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                              <ContainerIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                                {container.containerId}
                              </h3>
                              <p className="text-xs text-muted-foreground">{container.owner}</p>
                            </div>
                          </div>
                          <div className="h-12 w-24 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 shrink-0 shadow-md">
                            <img 
                              src={`https://logo.clearbit.com/${container.owner.toLowerCase().replace(/\s+/g, '')}.com`}
                              alt={container.owner}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-xs font-bold text-slate-600 dark:text-slate-300 text-center">${container.owner.substring(0, 3).toUpperCase()}</span>`;
                                }
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                            {container.size}
                          </Badge>
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                            {getTypeLabel(container.type)}
                          </Badge>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium uppercase">Vị trí</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {container.currentLocation}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium uppercase">Ngày nhập</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {new Date(container.inDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>

                        {container.estimatedOutDate && (
                          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center gap-2.5">
                            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-orange-600/80 dark:text-orange-400/80 font-medium uppercase">Dự kiến xuất</p>
                              <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
                                {new Date(container.estimatedOutDate).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9"
                                onClick={() => {
                                  setSelectedContainer(container)
                                  setPickupModalOpen(true)
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Đăng ký lấy
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Đăng ký lấy container này</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 border-slate-200 dark:border-slate-700">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem chi tiết</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
          </div>
        </div>

        {/* Pickup Container Modal */}
        <PickupContainerModal 
          open={pickupModalOpen}
          onOpenChange={setPickupModalOpen}
          container={selectedContainer || undefined}
          depotName={depot?.name}
          onSuccess={loadData}
        />
      </div>
    </TooltipProvider>
  )
}


