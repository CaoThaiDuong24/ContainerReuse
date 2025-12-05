"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Search,
  Package,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  Hash,
  Ship,
  LayoutGrid,
  List
} from "lucide-react"

// Container Interface
interface RegisteredContainer {
  id: string
  containerId: string
  containerNumber: string
  type: string
  size: string
  status: string
  depot?: string
  registeredAt: string
  location?: string
  vehicleNumber?: string
  shippingLine?: string
  shippingLineLogo?: string
  shippingLineColor?: string
  userId?: number
  emptyReturnDeadline?: string
}

interface ApiResponse {
  success: boolean
  count: number
  data: RegisteredContainer[]
  message?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function RegisteredContainersPage() {
  const [containers, setContainers] = useState<RegisteredContainer[]>([])
  const [filteredContainers, setFilteredContainers] = useState<RegisteredContainer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card') // Add view mode state

  // Fetch registered containers from API
  useEffect(() => {
    fetchRegisteredContainers()
  }, [])

  // Filter containers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContainers(containers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = containers.filter(container => 
        container.containerNumber?.toLowerCase().includes(query) ||
        container.containerId?.toLowerCase().includes(query) ||
        container.type?.toLowerCase().includes(query) ||
        container.depot?.toLowerCase().includes(query)
      )
      setFilteredContainers(filtered)
    }
  }, [searchQuery, containers])

  const fetchRegisteredContainers = async () => {
    try {
      setLoading(true)
      setError('')
      
      // TODO: Get companyId from authentication context
      // For now, use test companyId (DonViVanTaiID)
      const companyId = 38512; // This should come from auth context in production
      
      console.log('🔄 Fetching registered containers from API...')
      console.log('📍 API URL:', `${API_BASE_URL}/api/containers/registered`)
      console.log('🏢 Company ID:', companyId)
      
      const response = await fetch(`${API_BASE_URL}/api/containers/registered?companyId=${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse = await response.json()
      console.log('✅ API Response:', {
        success: result.success,
        count: result.count,
        hasData: Array.isArray(result.data),
        dataLength: result.data?.length || 0,
        message: result.message
      })
      
      // Log full response for debugging when no data
      if (result.count === 0 || !result.data || result.data.length === 0) {
        console.log('⚠️ API returned no data:', JSON.stringify(result, null, 2))
      }
      
      if (result.success) {
        const containers = result.data || []
        setContainers(containers)
        setFilteredContainers(containers)
        console.log(`✅ Loaded ${containers.length} registered containers`)
        
        // Log sample data if available
        if (containers.length > 0) {
          console.log('📦 Sample container data:', {
            id: containers[0].id,
            containerNumber: containers[0].containerNumber,
            type: containers[0].type,
            size: containers[0].size,
            depot: containers[0].depot,
            shippingLine: containers[0].shippingLine
          })
        }
      } else {
        throw new Error(result.message || 'API returned unsuccessful response')
      }
    } catch (err) {
      console.error('❌ Error fetching registered containers:', err)
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu container từ server')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'đã đăng ký':
      case 'registered':
        return 'bg-green-100 text-green-800'
      case 'đang xử lý':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'hoàn thành':
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-600" />
              Danh sách Container đã Đăng ký
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý và theo dõi các container bạn đã đăng ký
            </p>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm container theo số, loại hoặc depot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-purple-200 focus:border-purple-400"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Tổng: {filteredContainers.length} container
              </Badge>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                onClick={fetchRegisteredContainers}
                variant="outline"
                className="bg-white"
                disabled={loading}
              >
                {loading ? <Spinner className="h-4 w-4" /> : "Làm mới"}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                onClick={fetchRegisteredContainers} 
                variant="outline" 
                size="sm" 
                className="ml-4"
              >
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Spinner className="h-8 w-8 mx-auto text-purple-600" />
                <p className="text-gray-600">Đang tải danh sách container...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && filteredContainers.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'Không tìm thấy container' : 'Chưa có container đã đăng ký'}
              </h3>
              <p className="text-gray-600 text-center max-w-2xl mb-2">
                {searchQuery 
                  ? 'Không tìm thấy container phù hợp với từ khóa tìm kiếm. Thử điều chỉnh từ khóa của bạn.'
                  : 'Hiện tại không có container nào đã được đăng ký gate-out cho công ty này.'
                }
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Về API GetList_DonHang_ReUse_Out_Now:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>API đang kết nối thành công với hệ thống external</li>
                      <li>Dữ liệu sẽ tự động xuất hiện khi có container được đăng ký gate-out</li>
                      <li>Bạn có thể đăng ký gate-out từ trang "Container khả dụng"</li>
                      <li>Company ID đang sử dụng: <span className="font-mono font-bold">38512</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                  >
                    Xóa bộ lọc
                  </Button>
                )}
                <Button
                  onClick={fetchRegisteredContainers}
                  variant="default"
                  className="gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  Làm mới dữ liệu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Containers Display - Card or Table View */}
        {!loading && !error && filteredContainers.length > 0 && (
          <>
            {/* Card View */}
            {viewMode === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredContainers.map((container) => (
                  <Card 
                    key={container.id}
                    className="hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300"
                  >
                    <CardContent className="p-6">
                      {/* Shipping Line Header with Logo */}
                      <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                        {container.shippingLineLogo ? (
                          <div 
                            className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border-2"
                            style={{ borderColor: container.shippingLineColor || '#e5e7eb' }}
                          >
                            <img 
                              src={`https://cms.ltacv.com${container.shippingLineLogo}`}
                              alt={container.shippingLine || 'Logo'}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 flex items-center justify-center flex-shrink-0">
                            <Ship className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">Hãng tàu</div>
                          <div className="font-bold text-gray-900 truncate" title={container.shippingLine}>
                            {container.shippingLine || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Container Details */}
                      <div className="space-y-3">
                        {/* Size */}
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="text-xs text-gray-500">Size</div>
                            <div className="font-semibold text-gray-900">{container.size || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-purple-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-600">T</span>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Loại</div>
                            <div className="font-semibold text-gray-900">{container.type || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="text-xs text-gray-500">Ngày dự kiến xuất</div>
                            <div className="font-semibold text-gray-900">{formatDate(container.registeredAt)}</div>
                          </div>
                        </div>

                        {/* Empty Return Deadline */}
                        {container.emptyReturnDeadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <div>
                              <div className="text-xs text-gray-500">Hạn Trả Rỗng</div>
                              <div className="font-semibold text-orange-600">{formatDate(container.emptyReturnDeadline)}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        Đăng ký lấy
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Danh sách Container
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-50">
                      <TableHead className="font-semibold">Số Container</TableHead>
                      <TableHead className="font-semibold">Số Booking</TableHead>
                      <TableHead className="font-semibold">Hãng tàu</TableHead>
                      <TableHead className="font-semibold">Loại/Kích thước</TableHead>
                      <TableHead className="font-semibold">Trạng thái</TableHead>
                      <TableHead className="font-semibold">Depot</TableHead>
                      <TableHead className="font-semibold">Số xe</TableHead>
                      <TableHead className="font-semibold">Ngày đăng ký</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContainers.map((container) => (
                      <TableRow key={container.id} className="hover:bg-purple-50/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            {container.containerId || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-blue-600">
                            {container.containerNumber || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {container.shippingLineLogo ? (
                              <div className="w-8 h-8 rounded-md overflow-hidden bg-white border flex items-center justify-center flex-shrink-0">
                                <img 
                                  src={`https://cms.ltacv.com${container.shippingLineLogo}`}
                                  alt={container.shippingLine || 'Logo'}
                                  className="w-full h-full object-contain p-0.5"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none'
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-md bg-gray-100 border flex items-center justify-center flex-shrink-0">
                                <Ship className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <span className="font-medium text-sm">{container.shippingLine || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{container.type || 'N/A'}</span>
                            {container.size && (
                              <span className="text-sm text-gray-500">{container.size}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(container.status)}>
                            {container.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {container.depot || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {container.vehicleNumber || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {formatDate(container.registeredAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
