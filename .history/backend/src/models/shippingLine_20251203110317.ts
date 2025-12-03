/**
 * Shipping Line (Hãng tàu) Model
 * Represents shipping lines/carriers that operate container services
 */

export interface ShippingLine {
  id: string;
  code: string;              // Mã hãng tàu (e.g., MAEU, COSU, HLCU)
  name: string;              // Tên hãng tàu (e.g., Maersk, COSCO, Hapag-Lloyd)
  fullName: string;          // Tên đầy đủ
  scacCode?: string;         // Standard Carrier Alpha Code
  country?: string;          // Quốc gia
  website?: string;          // Website
  email?: string;            // Email liên hệ
  phone?: string;            // Số điện thoại
  address?: string;          // Địa chỉ
  taxCode?: string;          // Mã số thuế
  logo?: string;             // Logo path
  colorTemplate?: string;    // Màu template
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingLineApiResponse {
  success: boolean;
  message?: string;
  data?: ShippingLine[];
  count?: number;
}
