"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Upload, X, Download, PackageCheck, FileText, User, Truck, DollarSign, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface PickupContainerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  containerId?: string
  depotName?: string
}

export function PickupContainerModal({ 
  open, 
  onOpenChange,
  containerId = "",
  depotName = ""
}: PickupContainerModalProps) {
  const [formData, setFormData] = useState({
    gateType: "",
    billNumber: "",
    depot: depotName,
    shipping: "",
    depotAddress: "",
    containerType: "",
    containerSize: "",
    transportType: "",
    vehicleNumber: "",
    cmndNumber: "",
    driverName: "",
    dateOfBirth: undefined as Date | undefined,
    phoneNumber: "",
    shippingCompanyMst: "",
    companyName: "",
    address: "",
    inspectionFee: "",
    liftFee: "",
    containerFee: "",
    totalAmount: "",
    orderStatus: "pending",
    creator: "Quản Trị GSOT"
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const newFiles = [...imageFiles, ...files]
      setImageFiles(newFiles)
      
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const requiredFields = [
      'billNumber', 'depot', 'shipping', 'transportType', 
      'vehicleNumber', 'cmndNumber', 'shippingCompanyMst'
    ]
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
      return
    }

    if (imageFiles.length === 0) {
      alert('Vui lòng chọn ít nhất một hình ảnh')
      return
    }

    console.log('Form data:', formData)
    console.log('Image files:', imageFiles)
    
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      gateType: "",
      billNumber: "",
      depot: depotName,
      shipping: "",
      depotAddress: "",
      containerType: "",
      containerSize: "",
      transportType: "",
      vehicleNumber: "",
      cmndNumber: "",
      driverName: "",
      dateOfBirth: undefined,
      phoneNumber: "",
      shippingCompanyMst: "",
      companyName: "",
      address: "",
      inspectionFee: "",
      liftFee: "",
      containerFee: "",
      totalAmount: "",
      orderStatus: "pending",
      creator: "Quản Trị GSOT"
    })
    setImageFiles([])
    setImagePreviews([])
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
                  Điền đầy đủ thông tin để đăng ký lấy container <span className="font-semibold text-blue-600">{containerId}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          <div className="space-y-8">
            {/* Section 1: Thông tin đơn hàng */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <PackageCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin đơn hàng</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Điền thông tin cơ bản về đơn hàng</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Số B/L - Trường quan trọng nhất */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="billNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Số B/L</span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </Label>
                  </div>
                  <Input 
                    id="billNumber"
                    value={formData.billNumber}
                    onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                    placeholder="VD: MAEU123456789"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Depot */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="depot" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <PackageCheck className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Depot</span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </Label>
                  </div>
                  <Select value={formData.depot} onValueChange={(value) => setFormData({...formData, depot: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn Depot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="depot-1">Depot 1</SelectItem>
                      <SelectItem value="depot-2">Depot 2</SelectItem>
                      <SelectItem value="depot-3">Depot 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hãng tàu */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="shipping" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <PackageCheck className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Hãng tàu</span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </Label>
                  </div>
                  <Select value={formData.shipping} onValueChange={(value) => setFormData({...formData, shipping: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn hãng tàu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maersk">Maersk</SelectItem>
                      <SelectItem value="msc">MSC</SelectItem>
                      <SelectItem value="cma-cgm">CMA CGM</SelectItem>
                      <SelectItem value="cosco">COSCO</SelectItem>
                      <SelectItem value="hapag-lloyd">Hapag-Lloyd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Loại container */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="containerSize" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Loại Container</span>
                    </Label>
                  </div>
                  <Select value={formData.containerSize} onValueChange={(value) => setFormData({...formData, containerSize: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn loại container" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20ft">20ft</SelectItem>
                      <SelectItem value="40ft">40ft</SelectItem>
                      <SelectItem value="45ft">45ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Loại đơn hàng */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="gateType" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Loại đơn hàng</span>
                    </Label>
                  </div>
                  <Select value={formData.gateType} onValueChange={(value) => setFormData({...formData, gateType: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Gate OUT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gate-out">Gate OUT</SelectItem>
                      <SelectItem value="gate-in">Gate IN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Địa chỉ Depot */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="depotAddress" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Địa chỉ Depot</span>
                    </Label>
                  </div>
                  <Input 
                    id="depotAddress"
                    value={formData.depotAddress}
                    onChange={(e) => setFormData({...formData, depotAddress: e.target.value})}
                    placeholder="Nhập địa chỉ depot"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Trạng thái */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="orderStatus" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <PackageCheck className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Trạng thái</span>
                    </Label>
                  </div>
                  <Select value={formData.orderStatus} onValueChange={(value) => setFormData({...formData, orderStatus: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Đang chờ duyệt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Đang chờ duyệt</SelectItem>
                      <SelectItem value="approved">Đã duyệt</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Người tạo */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="creator" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Người tạo</span>
                    </Label>
                  </div>
                  <Select value={formData.creator} onValueChange={(value) => setFormData({...formData, creator: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Quản Trị GSOT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản Trị GSOT">Quản Trị GSOT</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Section 2: Thông tin vận tải */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin vận tải</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Thông tin về phương tiện và tài xế</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Đơn vị vận tải */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="transportType" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Đơn vị vận tải</span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </Label>
                  </div>
                  <Select value={formData.transportType} onValueChange={(value) => setFormData({...formData, transportType: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn đơn vị vận tải" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company-a">Công ty A</SelectItem>
                      <SelectItem value="company-b">Công ty B</SelectItem>
                      <SelectItem value="company-c">Công ty C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Số xe */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="vehicleNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Số xe</span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </Label>
                  </div>
                  <Input 
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="VD: 51A-12345"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* CMND / Căn cước */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="cmndNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-red-500 shrink-0" />
                      <span>CMND</span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </Label>
                  </div>
                  <Select value={formData.cmndNumber} onValueChange={(value) => setFormData({...formData, cmndNumber: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn CMND/Căn cước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cmnd-1">CMND-001234567</SelectItem>
                      <SelectItem value="cmnd-2">CMND-987654321</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Họ tên tài xế */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="driverName" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Tài xế</span>
                    </Label>
                  </div>
                  <Input 
                    id="driverName"
                    value={formData.driverName}
                    onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                    placeholder="Nhập họ tên tài xế"
                    className="h-14 text-base"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="flex flex-col">
                  <div className="min-h-[40px] flex items-center mb-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>SĐT</span>
                    </Label>
                  </div>
                  <Input 
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="VD: 0912345678"
                    className="h-14 text-base"
                  />
                </div>

                {/* Ngày sinh */}
                <div className="space-y-2.5">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 text-slate-500" />
                    Ngày sinh
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal text-base",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth ? (
                          format(formData.dateOfBirth, "dd/MM/yyyy", { locale: vi })
                        ) : (
                          <span>Chọn ngày sinh</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => setFormData({...formData, dateOfBirth: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Section 3: Thông tin công ty */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin công ty</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Thông tin công ty in hóa đơn</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {/* MST */}
                <div className="flex flex-col">
                  <Label htmlFor="shippingCompanyMst" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2 h-5">
                    <FileText className="h-4 w-4 text-red-500 shrink-0" />
                    <span className="truncate">MST</span>
                    <span className="text-red-500 shrink-0">*</span>
                  </Label>
                  <Select value={formData.shippingCompanyMst} onValueChange={(value) => setFormData({...formData, shippingCompanyMst: value})}>
                    <SelectTrigger className="h-11 text-sm focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn MST công ty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mst-001">MST-001</SelectItem>
                      <SelectItem value="mst-002">MST-002</SelectItem>
                      <SelectItem value="mst-003">MST-003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tên công ty */}
                <div className="flex flex-col">
                  <Label htmlFor="companyName" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2 h-5">
                    <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="truncate">Tên công ty</span>
                  </Label>
                  <Input 
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Nhập tên công ty"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Địa chỉ công ty */}
                <div className="flex flex-col">
                  <Label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2 h-5">
                    <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="truncate">Địa chỉ</span>
                  </Label>
                  <Input 
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Nhập địa chỉ công ty"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Section 4: Phí và chi phí */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                  <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Phí và chi phí</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Các khoản phí liên quan</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                {/* Phí kiểm soát */}
                <div className="flex flex-col">
                  <Label htmlFor="inspectionFee" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2 h-5">
                    <DollarSign className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="truncate">Phí cổng</span>
                  </Label>
                  <Input 
                    id="inspectionFee"
                    type="number"
                    value={formData.inspectionFee}
                    onChange={(e) => setFormData({...formData, inspectionFee: e.target.value})}
                    placeholder="0"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Phí nâng hạ */}
                <div className="flex flex-col">
                  <Label htmlFor="liftFee" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2 h-5">
                    <DollarSign className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="truncate">Phí nâng hạ</span>
                  </Label>
                  <Input 
                    id="liftFee"
                    type="number"
                    value={formData.liftFee}
                    onChange={(e) => setFormData({...formData, liftFee: e.target.value})}
                    placeholder="0"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Phụ phí xe nâng */}
                <div className="flex flex-col">
                  <Label htmlFor="containerFee" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2 h-5">
                    <DollarSign className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="truncate">Phụ phí</span>
                  </Label>
                  <Input 
                    id="containerFee"
                    type="number"
                    value={formData.containerFee}
                    onChange={(e) => setFormData({...formData, containerFee: e.target.value})}
                    placeholder="0"
                    className="h-11 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* Tổng tiền */}
                <div className="flex flex-col">
                  <Label htmlFor="totalAmount" className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2 h-5">
                    <DollarSign className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="truncate">Tổng tiền</span>
                  </Label>
                  <Input 
                    id="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                    placeholder="0"
                    className="h-11 text-sm font-semibold bg-green-50 dark:bg-green-950/20 border-green-500 focus-visible:ring-2 focus-visible:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Section 5: Hình ảnh */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                  <ImageIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Hình ảnh <span className="text-red-500">*</span>
                    {imagePreviews.length > 0 && (
                      <span className="ml-2 text-base font-normal text-muted-foreground">({imagePreviews.length} ảnh)</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tải lên hình ảnh container (tối thiểu 1 ảnh)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-36 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-blue-400 transition-colors">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground truncate text-center">
                      {imageFiles[index]?.name}
                    </p>
                  </div>
                ))}
                
                <label
                  htmlFor="image-upload"
                  className="relative flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:border-blue-500 dark:hover:border-blue-500 group"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                    Thêm ảnh
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF</p>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
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
              className="h-11 px-6 text-sm flex-1 sm:flex-none min-w-[120px]"
            >
              Hủy bỏ
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 h-11 px-8 text-sm font-semibold flex-1 sm:flex-none min-w-[160px]"
            >
              <Download className="h-4 w-4 mr-2" />
              Xác nhận đăng ký
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
