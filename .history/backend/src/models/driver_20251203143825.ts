/**
 * Driver (Tài xế) Model
 * Represents drivers belonging to transport companies
 * Data from API: GetList_TaiXe_Thuoc_NhaXe
 */

export interface Driver {
  id: string;                  // ID_driver from API
  driverCode: string;          // ID_driver (same as id)
  driverName: string;          // TenHT - Tên đầy đủ
  fullName: string;            // TenHT - Tên đầy đủ
  phoneNumber?: string;        // SoDT - Số điện thoại
  idCard?: string;             // SoCMND - Số CMND/CCCD
  birthDate?: string;          // NgaySinh - Ngày sinh
  vehicleId?: string;          // ID_vehicle - ID xe
  vehiclePlate?: string;       // BienXe - Biển số xe
  transportCompanyId?: string; // NhaXeID - ID nhà xe/đơn vị vận tải
  status: 'active' | 'inactive';
}

export interface DriverApiResponse {
  success: boolean;
  message?: string;
  data?: Driver[];
  count?: number;
}
