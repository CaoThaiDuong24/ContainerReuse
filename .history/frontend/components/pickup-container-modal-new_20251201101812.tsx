"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, PackageCheck, FileText, User, Truck, DollarSign } from "lucide-react"
import { Container } from "@/lib/mockData"
import { toast } from "sonner"

interface PickupContainerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  container?: Container
  depotName?: string
}

export function PickupContainerModal({ 
  open, 
  onOpenChange,
  container,
  depotName = ""
}: PickupContainerModalProps) {
  const [formData, setFormData] = useState({
    bookingNumber: "", // SoChungTuNhapBai
    transportCompanyId: "", // DonViVanTaiID
    vehicleNumber: "", // SoXe
    creatorId: "", // NguoiTao
    invoiceCompanyInfra: "", // CongTyInHoaDon_PhiHaTang
    invoiceCompany: "", // CongTyInHoaDon
    containerQuantity: "1", // SoLuongCont
    goods: "-1", // HangHoa
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!container) {
      toast.error('Không có thông tin container')
      return
    }

    // Validate required fields
    const requiredFields = [
      { key: 'bookingNumber', label: 'Số booking' },
      { key: 'transportCompanyId', label: 'Mã đơn vị vận tải' },
      { key: 'vehicleNumber', label: 'Số xe' },
      { key: 'creatorId', label: 'Mã người tạo' },
      { key: 'invoiceCompanyInfra', label: 'Công ty in hóa đơn phí hạ tầng' },
      { key: 'invoiceCompany', label: 'Công ty in hóa đơn' },
    ]
    
    const missingFields = requiredFields.filter(field => !formData[field.key as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền đầy đủ các trường: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }

    // Validate rawApiData exists
    if (!container.rawApiData) {
      toast.error('Thiếu thông tin container từ API')
      return
    }

    setLoading(true)

    try {
      // Prepare gate-out data matching API structure
      const gateOutData = {
        HangTauID: parseInt(container.rawApiData.HangTauID),
        ContTypeSizeID: parseInt(container.rawApiData.ContTypeSizeID),
        SoChungTuNhapBai: formData.bookingNumber,
        DonViVanTaiID: parseInt(formData.transportCompanyId),
        SoXe: formData.vehicleNumber,
        NguoiTao: parseInt(formData.creatorId),
        CongTyInHoaDon_PhiHaTang: parseInt(formData.invoiceCompanyInfra),
        CongTyInHoaDon: parseInt(formData.invoiceCompany),
        DepotID: parseInt(container.rawApiData.DepotID),
        SoLuongCont: parseInt(formData.containerQuantity),
        HangHoa: parseInt(formData.goods)
      }

      console.log('Submitting gate-out data:', gateOutData)

      // Call backend API
      const response = await fetch('http://localhost:5000/api/containers/gate-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gateOutData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Đăng ký lấy container thành công!')
        onOpenChange(false)
        resetForm()
      } else {
        toast.error(result.message || 'Đăng ký thất bại')
      }
    } catch (error) {
      console.error('Error submitting gate-out:', error)
      toast.error('Có lỗi xảy ra khi đăng ký')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      bookingNumber: "",
      transportCompanyId: "",
      vehicleNumber: "",
      creatorId: "",
      invoiceCompanyInfra: "",
      invoiceCompany: "",
      containerQuantity: "1",
      goods: "-1",
    })
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
                  Điền đầy đủ thông tin để đăng ký lấy container <span className="font-semibold text-blue-600">{container?.containerId}</span>
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
                {/* Container ID - Read only */}
                <div className="flex flex-col">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Mã Container
                  </Label>
                  <Input 
                    value={container?.containerId || ''}
                    disabled
                    className="h-11 text-sm bg-slate-100 dark:bg-slate-800"
                  />
                </div>

                {/* Depot - Read only */}
                <div className="flex flex-col">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Depot
                  </Label>
                  <Input 
                    value={container?.depotName || depotName}
                    disabled
                    className="h-11 text-sm bg-slate-100 dark:bg-slate-800"
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
                    className="h-11 text-sm bg-slate-100 dark:bg-slate-800"
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
                    placeholder="VD: SGN0002222"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Mã đơn vị vận tải */}
                <div className="flex flex-col">
                  <Label htmlFor="transportCompanyId" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <Truck className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Mã đơn vị vận tải</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="transportCompanyId"
                    value={formData.transportCompanyId}
                    onChange={(e) => setFormData({...formData, transportCompanyId: e.target.value})}
                    placeholder="VD: 39503"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Số xe */}
                <div className="flex flex-col">
                  <Label htmlFor="vehicleNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <Truck className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Số xe</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="VD: 93H-0000"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Mã người tạo */}
                <div className="flex flex-col">
                  <Label htmlFor="creatorId" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <User className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Mã người tạo</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="creatorId"
                    value={formData.creatorId}
                    onChange={(e) => setFormData({...formData, creatorId: e.target.value})}
                    placeholder="VD: 111735"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Công ty in hóa đơn phí hạ tầng */}
                <div className="flex flex-col">
                  <Label htmlFor="invoiceCompanyInfra" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <DollarSign className="h-4 w-4 text-red-500 shrink-0" />
                    <span>CT HĐ phí hạ tầng</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="invoiceCompanyInfra"
                    value={formData.invoiceCompanyInfra}
                    onChange={(e) => setFormData({...formData, invoiceCompanyInfra: e.target.value})}
                    placeholder="VD: 90750"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Công ty in hóa đơn */}
                <div className="flex flex-col">
                  <Label htmlFor="invoiceCompany" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <DollarSign className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Công ty in hóa đơn</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input 
                    id="invoiceCompany"
                    value={formData.invoiceCompany}
                    onChange={(e) => setFormData({...formData, invoiceCompany: e.target.value})}
                    placeholder="VD: 90750"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Số lượng container */}
                <div className="flex flex-col">
                  <Label htmlFor="containerQuantity" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Số lượng</span>
                  </Label>
                  <Input 
                    id="containerQuantity"
                    type="number"
                    value={formData.containerQuantity}
                    onChange={(e) => setFormData({...formData, containerQuantity: e.target.value})}
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                    min="1"
                  />
                </div>

                {/* Hàng hóa */}
                <div className="flex flex-col">
                  <Label htmlFor="goods" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                    <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Hàng hóa</span>
                  </Label>
                  <Select value={formData.goods} onValueChange={(value) => setFormData({...formData, goods: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn loại hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">Không xác định</SelectItem>
                      <SelectItem value="1">Hàng thường</SelectItem>
                      <SelectItem value="2">Hàng đặc biệt</SelectItem>
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
