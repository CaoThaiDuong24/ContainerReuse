/**
 * Driver (Tài xế) Model
 * Represents drivers belonging to transport companies
 */

export interface Driver {
  id: string;
  driverCode: string;        // Mã tài xế
  driverName: string;         // Tên tài xế
  fullName: string;           // Tên đầy đủ
  phoneNumber?: string;       // Số điện thoại
  licenseNumber?: string;     // Số giấy phép lái xe
  licenseType?: string;       // Loại bằng lái
  idCard?: string;            // CMND/CCCD
  email?: string;             // Email
  address?: string;           // Địa chỉ
  transportCompanyId?: string; // ID đơn vị vận tải
  transportCompanyName?: string; // Tên đơn vị vận tải
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverApiResponse {
  success: boolean;
  message?: string;
  data?: Driver[];
  count?: number;
}
