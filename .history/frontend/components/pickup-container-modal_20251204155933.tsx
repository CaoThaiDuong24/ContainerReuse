"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, PackageCheck, FileText, User, Truck, DollarSign, UserCheck } from "lucide-react"
import { Container } from "@/lib/containerService"
import { Driver } from "@/lib/driverService"
import { Vehicle, getVehiclesByCompany, getDriversByVehicle, VehicleDriver } from "@/lib/vehicleService"
import { Company, getCompanyByUserId } from "@/lib/companyService"
import { Goods, fetchActiveGoods } from "@/lib/goodsService"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface PickupContainerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  container?: Container
  depotName?: string
  onSuccess?: () => void
}

export function PickupContainerModal({ 
  open, 
  onOpenChange,
  container,
  depotName = "",
  onSuccess
}: PickupContainerModalProps) {
  const [formData, setFormData] = useState({
    bookingNumber: "", // SoChungTuNhapBai
    transportCompanyId: "", // DonViVanTaiID
    transportCompanyName: "", // New field for display
    driverId: "", // TaiXeID - New field
    creatorId: "", // NguoiTao
    invoiceCompanyInfra: "", // CongTyInHoaDon_PhiHaTang
    invoiceCompanyInfra_Name: "", // New field for display
    invoiceCompany: "", // CongTyInHoaDon
    invoiceCompany_Name: "", // New field for display
    containerQuantity: "1", // SoLuongCont
    goods: "-1", // HangHoa
  })

  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [drivers, setDrivers] = useState<VehicleDriver[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [userCompany, setUserCompany] = useState<Company | null>(null)
  const [loadingUserCompany, setLoadingUserCompany] = useState(false)
  const [goodsList, setGoodsList] = useState<Goods[]>([])
  const [loadingGoods, setLoadingGoods] = useState(false)
  const { user } = useAuth()

  // Debug log to check user data
  useEffect(() => {
    console.log('🔷 Component rendered - User:', user)
    console.log('🔷 Modal open:', open)
  }, [user, open])

  // Fetch goods list when modal opens
  useEffect(() => {
    const fetchGoods = async () => {
      if (!open) return
      
      setLoadingGoods(true)
      try {
        console.log('📦 Fetching goods list...')
        const result = await fetchActiveGoods()
        
        if (result.success && result.data) {
          // Filter out goods with only numeric names (like "Hàng hóa 2680")
          const validGoods = result.data.filter((goods: Goods) => {
            const nameWithoutPrefix = goods.name.replace(/^(Hàng hóa|H[aả]ng ho[aá])\s*/i, '').trim()
            return nameWithoutPrefix && !/^\d+$/.test(nameWithoutPrefix)
          })
          
          // Remove duplicates by name, keep first occurrence
          const uniqueGoods = validGoods.reduce((acc: Goods[], current: Goods) => {
            const existingItem = acc.find(item => item.name.trim().toLowerCase() === current.name.trim().toLowerCase())
            if (!existingItem) {
              acc.push(current)
            }
            return acc
          }, [])
          
          setGoodsList(uniqueGoods)
          console.log(`✅ Loaded ${uniqueGoods.length} unique goods types (from ${result.data.length} total)`)
          if (uniqueGoods.length > 0) {
            toast.success(`Tải thành công ${uniqueGoods.length} loại hàng hóa`)
          }
        } else {
          console.warn('⚠️ No goods data found')
          toast.info('Không tìm thấy dữ liệu hàng hóa')
        }
      } catch (error) {
        console.error('Error fetching goods:', error)
        toast.error('Không thể tải danh sách hàng hóa')
      } finally {
        setLoadingGoods(false)
      }
    }

    fetchGoods()
  }, [open])

  // Fetch user's company when modal opens
  useEffect(() => {
    const fetchUserCompany = async () => {
      console.log('🔵 Modal opened:', open, 'User:', user)
      
      if (!open) {
        console.log('⚠️ Modal not open, skipping fetch')
        return
      }
      
      if (!user?.accuserkey && !user?.id) {
        console.log('⚠️ User not available:', user)
        return
      }

      // Use accuserkey if available, fallback to id
      const userId = user.accuserkey || user.id
      console.log('✅ Starting auto-fill process for user:', userId)
      setLoadingUserCompany(true)
      
      // Auto-fill creator ID immediately (always available)
      console.log('📝 Setting creatorId to:', userId)
      setFormData(prev => {
        console.log('Previous formData:', prev)
        const newData = {
          ...prev,
          creatorId: userId, // Mã người tạo
        }
        console.log('New formData after creatorId:', newData)
        return newData
      })
      
      try {
        console.log(`🔍 Fetching company for user: ${user.username}`)
        const result = await getCompanyByUserId(user.username)
        
        if (result.success && result.data) {
          const companyId = result.data.id;
          const companyName = result.data.name;
          setUserCompany(result.data)
          console.log(`✅ Loaded user company:`, result.data)
          console.log(`📝 Auto-filling company ID: ${companyId}`)
          
          // Auto-fill company ID and creator ID
          setFormData(prev => ({
            ...prev,
            transportCompanyId: companyId,
            transportCompanyName: companyName,
            invoiceCompanyInfra: companyId,
            invoiceCompanyInfra_Name: companyName,
            invoiceCompany: companyId,
            invoiceCompany_Name: companyName,
            creatorId: user.id, // Mã người tạo = user id
          }))
          
          toast.success(`Đã tải thông tin công ty: ${result.data.name}`)
        } else {
          console.warn('⚠️ No company found for user:', user.id)
          toast.info('Không tìm thấy thông tin công ty. Vui lòng nhập thủ công.')
        }
      } catch (error) {
        console.error('Error fetching user company:', error)
        toast.warning('Không thể tải thông tin công ty. Vui lòng nhập thủ công.')
      } finally {
        setLoadingUserCompany(false)
      }
    }

    fetchUserCompany()
  }, [open, user])

  // Fetch vehicles when transport company changes
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!formData.transportCompanyId || formData.transportCompanyId.trim() === '') {
        setVehicles([])
        setSelectedVehicle(null)
        setDrivers([])
        setFormData(prev => ({ ...prev, driverId: '' }))
        return
      }

      setLoadingVehicles(true)
      try {
        console.log('🚗 Fetching vehicles for company:', formData.transportCompanyId)
        const result = await getVehiclesByCompany(user?.username||'')
        const fetchedVehicles = result.data || []
        
        setVehicles(fetchedVehicles)
        
        if (fetchedVehicles.length > 0) {
          toast.success(`Tìm thấy ${fetchedVehicles.length} xe`)
        } else {
          toast.info('Không tìm thấy xe cho đơn vị vận tải này')
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        toast.error('Không thể tải danh sách xe')
        setVehicles([])
      } finally {
        setLoadingVehicles(false)
      }
    }

    fetchVehicles()
  }, [formData.transportCompanyId])

  // Fetch drivers when vehicle is selected
  useEffect(() => {
    const fetchDriversForVehicle = async () => {
      if (!selectedVehicle) {
        setDrivers([])
        setFormData(prev => ({ ...prev, driverId: '' }))
        return
      }

      // Use drivers from vehicle object if available
      if (selectedVehicle.drivers && selectedVehicle.drivers.length > 0) {
        setDrivers(selectedVehicle.drivers)
        
        // Auto-select driver if only one available
        setFormData(prev => ({ 
          ...prev, 
          driverId: selectedVehicle.drivers.length === 1 ? selectedVehicle.drivers[0].id : ''
        }))
        
        if (selectedVehicle.drivers.length === 1) {
          toast.success(`Tự động chọn tài xế: ${selectedVehicle.drivers[0].driverName}`)
        } else {
          toast.info(`Tìm thấy ${selectedVehicle.drivers.length} tài xế cho xe ${selectedVehicle.vehiclePlate}`)
        }
        return
      }

      // Fallback: fetch from API if not included in vehicle object
      if (!formData.transportCompanyId) {
        return
      }

      setLoadingDrivers(true)
      try {
        console.log('👥 Fetching drivers for vehicle:', selectedVehicle.vehiclePlate)
        const result = await getDriversByVehicle(selectedVehicle.vehiclePlate, formData.transportCompanyId)
        const fetchedDrivers = result.data || []
        
        setDrivers(fetchedDrivers)
        
        // Auto-select driver if only one available
        setFormData(prev => ({ 
          ...prev, 
          driverId: fetchedDrivers.length === 1 ? fetchedDrivers[0].id : ''
        }))
        
        if (fetchedDrivers.length === 1) {
          toast.success(`Tự động chọn tài xế: ${fetchedDrivers[0].driverName}`)
        } else if (fetchedDrivers.length > 0) {
          toast.info(`Tìm thấy ${fetchedDrivers.length} tài xế cho xe ${selectedVehicle.vehiclePlate}`)
        }
      } catch (error) {
        console.error('Error fetching drivers for vehicle:', error)
        toast.error('Không thể tải danh sách tài xế')
        setDrivers([])
      } finally {
        setLoadingDrivers(false)
      }
    }

    fetchDriversForVehicle()
  }, [selectedVehicle, formData.transportCompanyId])

  const handleSubmit = async () => {
    console.log('\\n========== FRONTEND SUBMIT ==========')
    console.log('Container:', container)
    console.log('Form Data:', formData)
    
    if (!container) {
      toast.error('Không có thông tin container')
      return
    }

    // Validate required fields
    const requiredFields = [
      { key: 'bookingNumber', label: 'Số booking' },
      { key: 'transportCompanyId', label: 'Mã đơn vị vận tải' },
      { key: 'creatorId', label: 'Mã người tạo' },
      { key: 'invoiceCompanyInfra', label: 'Công ty in hóa đơn phí hạ tầng' },
      { key: 'invoiceCompany', label: 'Công ty in hóa đơn' },
    ]
    
    const missingFields = requiredFields.filter(field => {
      const value = formData[field.key as keyof typeof formData];
      return !value || value.trim() === '';
    });
    
    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền đầy đủ các trường: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }
    
    // Validate numeric fields
    const numericFields = [
      { key: 'transportCompanyId', label: 'Mã đơn vị vận tải' },
      { key: 'creatorId', label: 'Mã người tạo' },
      { key: 'invoiceCompanyInfra', label: 'Công ty in hóa đơn (phí hạ tầng)' },
      { key: 'invoiceCompany', label: 'Công ty in hóa đơn' },
    ];
    
    const invalidNumericFields = numericFields.filter(field => {
      const value = formData[field.key as keyof typeof formData];
      return value && isNaN(parseInt(value));
    });
    
    if (invalidNumericFields.length > 0) {
      toast.error(`Các trường sau phải là số: ${invalidNumericFields.map(f => f.label).join(', ')}`)
      return
    }

    // Validate rawApiData exists
    if (!container.rawApiData) {
      console.error('❌ Container missing rawApiData:', container)
      toast.error('Thiếu thông tin container từ API. Vui lòng chọn lại container.')
      return
    }

    // Validate critical fields in rawApiData
    const criticalFields = ['HangTauID', 'ContTypeSizeID', 'DepotID']
    const missingApiFields = criticalFields.filter(field => 
      !container.rawApiData[field] || container.rawApiData[field] === ''
    )
    
    if (missingApiFields.length > 0) {
      console.error('❌ Missing critical API fields:', missingApiFields)
      console.error('rawApiData:', container.rawApiData)
      toast.error(`Thiếu thông tin quan trọng từ API: ${missingApiFields.join(', ')}. Vui lòng chọn lại container.`)
      return
    }

    setLoading(true)

    try {
      // Parse and validate numeric fields
      const parsedFields = {
        HangTauID: parseInt(container.rawApiData.HangTauID),
        ContTypeSizeID: parseInt(container.rawApiData.ContTypeSizeID),
        DonViVanTaiID: parseInt(formData.transportCompanyId),
        NguoiTao: parseInt(formData.creatorId),
        CongTyInHoaDon_PhiHaTang: parseInt(formData.invoiceCompanyInfra),
        CongTyInHoaDon: parseInt(formData.invoiceCompany),
        DepotID: parseInt(container.rawApiData.DepotID),
        SoLuongCont: parseInt(formData.containerQuantity),
        HangHoa: formData.goods === "-1" ? -1 : parseInt(formData.goods) // Handle "Không xác định" case
      }

      // Check for NaN values
      const invalidFields = Object.entries(parsedFields)
        .filter(([_, value]) => isNaN(value))
        .map(([key]) => key)

      if (invalidFields.length > 0) {
        console.error('❌ Invalid numeric fields:', invalidFields)
        console.error('Form data:', formData)
        toast.error(`Các trường sau phải là số hợp lệ: ${invalidFields.join(', ')}`)
        setLoading(false)
        return
      }

      // Prepare gate-out data matching API structure
      const gateOutData = {
        HangTauID: parsedFields.HangTauID,
        ContTypeSizeID: parsedFields.ContTypeSizeID,
        SoChungTuNhapBai: formData.bookingNumber,
        DonViVanTaiID: parsedFields.DonViVanTaiID,
        SoXe: selectedVehicle?.vehiclePlate || '',
        NguoiTao: parsedFields.NguoiTao,
        CongTyInHoaDon_PhiHaTang: parsedFields.CongTyInHoaDon_PhiHaTang,
        CongTyInHoaDon: parsedFields.CongTyInHoaDon,
        DepotID: parsedFields.DepotID,
        SoLuongCont: parsedFields.SoLuongCont,
        HangHoa: parsedFields.HangHoa,
        // Add container original data for storage
        containerInfo: {
          id: container.id,
          containerId: container.containerId,
          size: container.size,
          type: container.type,
          depotId: container.depotId,
          depotName: container.depotName,
          owner: container.owner,
          estimatedOutDate: container.estimatedOutDate,
          rawApiData: container.rawApiData
        }
      }

      console.log('✅ Gate-out data prepared:', gateOutData)
      console.log('📤 Submitting to backend...')

      // Call backend API
      const response = await fetch('http://localhost:5000/api/containers/gate-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gateOutData)
      })

      const result = await response.json()

      console.log('📥 Backend Response Status:', response.status)
      console.log('📥 Backend Response:', result)
      
      // Log the full API response for debugging
      if (result.data) {
        console.log('📊 API Response Data:');
        console.log('  - result:', result.data.result);
        console.log('  - reqid:', result.data.reqid);
        if (result.data.data && result.data.data.length > 0) {
          console.log('  - DonHangID:', result.data.data[0].DonHangID);
        }
      }
      console.log('========================================\\n')

      if (response.ok && result.success) {
        // Extract all relevant information from API response
        let orderId = 'N/A';
        let apiResult = 'Unknown';
        let apiReqId = '';
        let hasToken = false;
        
        if (result.data) {
          apiResult = result.data.result || 'Unknown';
          apiReqId = result.data.reqid || '';
          hasToken = !!result.data.token;
          
          if (result.data.data && Array.isArray(result.data.data) && result.data.data.length > 0) {
            const orderData = result.data.data[0];
            if (orderData.DonHangID) {
              orderId = orderData.DonHangID.v || orderData.DonHangID.r || orderData.DonHangID;
            }
          }
        }
        
        // Show success message with comprehensive information
        toast.success(
          `✅ Đăng ký lấy container thành công!`,
          {
            description: `Mã đơn hàng: ${orderId} | Trạng thái: ${apiResult}`,
            duration: 6000,
          }
        );
        
        console.log('🎉 ═══════════════════════════════════════');
        console.log('🎉 GATE OUT SUCCESS - ĐĂNG KÝ THÀNH CÔNG!');
        console.log('🎉 ═══════════════════════════════════════');
        console.log('');
        console.log('📋 THÔNG TIN ĐƠN HÀNG:');
        console.log('   ├─ Mã đơn hàng (DonHangID):', orderId);
        console.log('   ├─ Trạng thái API (result):', apiResult);
        console.log('   ├─ Request ID (reqid):', apiReqId);
        console.log('   └─ Token mới:', hasToken ? 'Có' : 'Không');
        console.log('');
        console.log('📦 THÔNG TIN CONTAINER:');
        console.log('   ├─ Container ID:', container?.containerId || 'N/A');
        console.log('   ├─ Kích thước:', container?.size || 'N/A');
        console.log('   ├─ Loại:', container?.type || 'N/A');
        console.log('   ├─ Hãng tàu:', container?.owner || 'N/A');
        console.log('   └─ Depot:', container?.depotName || depotName || 'N/A');
        console.log('');
        console.log('🚛 THÔNG TIN VẬN CHUYỂN:');
        console.log('   ├─ Số xe:', selectedVehicle?.vehiclePlate || 'N/A');
        console.log('   ├─ Đơn vị vận tải ID:', formData.transportCompanyId);
        console.log('   ├─ Tài xế ID:', formData.driverId || 'N/A');
        console.log('   └─ Số booking:', formData.bookingNumber);
        console.log('');
        console.log('💼 THÔNG TIN THANH TOÁN:');
        console.log('   ├─ Công ty HĐ phí hạ tầng:', formData.invoiceCompanyInfra);
        console.log('   ├─ Công ty in hóa đơn:', formData.invoiceCompany);
        console.log('   └─ Người tạo ID:', formData.creatorId);
        console.log('');
        console.log('📊 FULL API RESPONSE:');
        console.log(JSON.stringify(result.data, null, 2));
        console.log('');
        console.log('🎉 ═══════════════════════════════════════');
        
        onOpenChange(false)
        resetForm()
        // Refresh danh sách containers
        if (onSuccess) {
          onSuccess()
        }
      } else {
        // Handle different error types
        let errorMessage = result.message || 'Đăng ký thất bại'
        
        console.error('❌ Gate Out Failed!');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Error Details:')
        console.error('  - Message:', result.message)
        console.error('  - Error Code:', result.errorCode)
        console.error('  - Status Code:', result.statusCode)
        if (result.apiResponse) {
          console.error('  - API Response:', result.apiResponse)
        }
        if (result.attemptedReqid) {
          console.error('  - Attempted ReqID:', result.attemptedReqid)
        }
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Check if it's an authentication error
        if (result.errorCode === '404' || result.statusCode === 400 || result.statusCode === 401 || result.statusCode === 403) {
          errorMessage = '⚠️ Lỗi xác thực với API bên ngoài'
          
          // Show detailed error in toast
          if (result.suggestion) {
            console.log('💡 Suggestion:', result.suggestion)
            toast.error(errorMessage, {
              description: 'Vui lòng kiểm tra log console để biết thêm chi tiết.',
              duration: 8000
            })
          } else {
            toast.error(errorMessage + ': ' + (result.message || 'Không xác định'))
          }
          
          // Log full error for debugging
          console.error('\\n=== FULL ERROR REPORT ===')
          console.error(JSON.stringify(result, null, 2))
          console.error('========================\\n')
        } else {
          toast.error(errorMessage, {
            description: result.errorCode ? `Mã lỗi: ${result.errorCode}` : undefined,
            duration: 6000
          })
        }
      }
    } catch (error) {
      console.error('❌ Network/Parse Error:', error)
      toast.error('Có lỗi xảy ra khi kết nối với server. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      bookingNumber: "",
      transportCompanyId: "",
      transportCompanyName: "",
      driverId: "",
      creatorId: "",
      invoiceCompanyInfra: "",
      invoiceCompanyInfra_Name: "",
      invoiceCompany: "",
      invoiceCompany_Name: "",
      containerQuantity: "1",
      goods: "-1",
    })
    setVehicles([])
    setSelectedVehicle(null)
    setDrivers([])
    setUserCompany(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Đăng ký lấy Container
                </DialogTitle>
                <DialogDescription className="text-base mt-1">
                  Điền đầy đủ thông tin để đăng ký lấy container
                  {container && (
                    <span className="ml-2 text-sm">
                      ({container.size} - {container.owner})
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          <div className="space-y-8">
            {/* Section 1: Thông tin container */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <PackageCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin Container</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Thông tin container đã chọn</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Depot - Read only */}
                <div className="flex flex-col">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Depot
                  </Label>
                  <Input 
                    value={container?.depotName || depotName}
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                  />
                </div>

                {/* Owner - Read only */}
                <div className="flex flex-col">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Hãng tàu
                  </Label>
                  <Input 
                    value={container?.owner || ''}
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Thông tin đơn hàng */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin đơn hàng</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Nhập thông tin booking và vận chuyển</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Số Booking */}
                <div className="flex flex-col">
                  <Label htmlFor="bookingNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <FileText className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Số Booking</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="bookingNumber"
                    value={formData.bookingNumber}
                    onChange={(e) => setFormData({...formData, bookingNumber: e.target.value})}
                    placeholder="Nhập số booking"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-800"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="transportCompanyName" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <Truck className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Đơn vị vận tải</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="transportCompanyName"
                    value={formData.transportCompanyName}
                    placeholder="Tự động lấy từ hệ thống"
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                  />
                </div>
                {/* Mã đơn vị vận tải */}
                <div className="flex flex-col hidden">
                  <Label htmlFor="transportCompanyId" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <Truck className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Mã đơn vị vận tải</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="transportCompanyId"
                    type="number"
                    value={formData.transportCompanyId}
                    onChange={(e) => setFormData({...formData, transportCompanyId: e.target.value})}
                    placeholder="Tự động lấy từ hệ thống"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                    readOnly
                  />
                  {loadingUserCompany && (
                    <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                      <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                      Đang lấy thông tin công ty...
                    </p>
                  )}
                  {!loadingUserCompany && formData.transportCompanyId && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ ID: {formData.transportCompanyId} {userCompany && `- ${userCompany.name}`}
                    </p>
                  )}
                </div>

                {/* Chọn xe từ danh sách */}
                <div className="flex flex-col">
                  <Label htmlFor="vehicleSelect" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <Truck className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>Chọn xe</span>
                  </Label>
                  <Select 
                    value={selectedVehicle?.vehiclePlate || ''} 
                    onValueChange={(value) => {
                      const vehicle = vehicles.find(v => v.vehiclePlate === value)
                      setSelectedVehicle(vehicle || null)
                    }}
                    disabled={!formData.transportCompanyId || loadingVehicles || vehicles.length === 0}
                  >
                    <SelectTrigger className="w-full h-11 min-h-11 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-blue-500">
                      <SelectValue placeholder={
                        !formData.transportCompanyId 
                          ? "Chọn đơn vị vận tải trước" 
                          : loadingVehicles 
                          ? "Đang tải..." 
                          : vehicles.length === 0 
                          ? "Không có xe" 
                          : "Chọn biển số xe"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.vehiclePlate} value={vehicle.vehiclePlate}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{vehicle.vehiclePlate}</span>
                            {vehicle.drivers && vehicle.drivers.length > 0 && (
                              <span className="text-xs text-slate-500">
                                {vehicle.drivers.length} tài xế
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {vehicles.length > 0 && (
                    <p className="text-xs text-blue-500 mt-1">Có {vehicles.length} xe khả dụng</p>
                  )}
                </div>

                {/* Tài xế - New field */}
                <div className="flex flex-col">
                  <Label htmlFor="driverId" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <UserCheck className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Tài xế</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="driverId"
                    type="text"
                    value={drivers.length > 0 && formData.driverId ? drivers.find(d => d.id === formData.driverId)?.driverName || formData.driverId : ''}
                    placeholder="Chọn xe để tải danh sách tài xế"
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                  />
                </div>

                {/* Mã người tạo - Auto from user login */}
                <div className="flex flex-col hidden">
                  <Label htmlFor="creatorId" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <User className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Mã người tạo</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="creatorId"
                    type="text"
                    value={`${user?.username}`}
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                  />
                </div>

                {/* Công ty in hóa đơn phí hạ tầng - Auto from company */}
                <div className="flex flex-col hidden">
                  <Label htmlFor="invoiceCompanyInfra" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <DollarSign className="h-4 w-4 text-red-500 shrink-0" />
                    <span>CT HĐ phí hạ tầng</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="invoiceCompanyInfra"
                    type="number"
                    value={formData.invoiceCompanyInfra}
                    onChange={(e) => setFormData({...formData, invoiceCompanyInfra: e.target.value})}
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 bg-purple-50/50"
                    readOnly
                  />
                </div>
                {/* <div className="flex flex-col">
                  <Label htmlFor="invoiceCompanyInfra_Name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <DollarSign className="h-4 w-4 text-red-500 shrink-0" />
                    <span>CT HĐ phí hạ tầng</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="invoiceCompanyInfra_Name"
                    type="text"
                    value={formData.invoiceCompanyInfra_Name}
                    placeholder="Tự động từ HRMS"
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                  />
                </div> */}

                {/* Công ty in hóa đơn - Auto from company */}
                <div className="flex flex-col">
                  <Label htmlFor="invoiceCompany_Name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <DollarSign className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Công ty in hóa đơn</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="invoiceCompany"
                    type="text"
                    value={formData.invoiceCompany_Name}
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                  />
                </div>
                <div className="flex flex-col hidden">
                  <Label htmlFor="invoiceCompany" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <DollarSign className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Công ty in hóa đơn</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="invoiceCompany"
                    type="number"
                    value={formData.invoiceCompany}
                    onChange={(e) => setFormData({...formData, invoiceCompany: e.target.value})}
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 bg-purple-50/50"
                    readOnly
                  />
                </div>

                {/* Số lượng container */}
                {/* <div className="flex flex-col">
                  <Label htmlFor="containerQuantity" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Số lượng</span>
                  </Label>
                  <Input 
                    id="containerQuantity"
                    type="number"
                    value={formData.containerQuantity}
                    disabled
                    className="h-11 text-sm bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-600 opacity-80"
                    min="1"
                  />
                </div> */}

                {/* Hàng hóa */}
                <div className="flex flex-col">
                  <Label htmlFor="goods" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Hàng hóa</span>
                  </Label>
                  <Select 
                    value={formData.goods} 
                    onValueChange={(value) => setFormData({...formData, goods: value})}
                    disabled={loadingGoods}
                  >
                    <SelectTrigger className="w-full h-11 min-h-11 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-blue-500">
                      <SelectValue placeholder={loadingGoods ? "Đang tải..." : "Chọn loại hàng"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">Không xác định</SelectItem>
                      {goodsList.map((goods) => (
                        <SelectItem key={goods.id} value={goods.id}>
                          {goods.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-6 border-t bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="text-red-500 font-bold">*</span> Các trường bắt buộc phải điền
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
            </p>
          </div>
          <DialogFooter className="gap-3 flex-row w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              disabled={loading}
              className="h-11 px-6 text-sm flex-1 sm:flex-none min-w-[120px]"
            >
              Hủy bỏ
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 h-11 px-8 text-sm font-semibold flex-1 sm:flex-none min-w-[160px]"
            >
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
