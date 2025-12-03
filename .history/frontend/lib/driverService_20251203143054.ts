/**
 * Driver Service
 * Frontend service for managing driver (tài xế) operations
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get all drivers for a specific transport company
 * @param transportCompanyId - ID of the transport company (DonViVanTaiID)
 */
export async function getDriversByCompany(
  transportCompanyId: string
): Promise<{ success: boolean; count: number; data: Driver[] }> {
  try {
    if (!transportCompanyId || transportCompanyId.trim() === '') {
      throw new Error('Transport company ID is required');
    }

    const url = `${API_BASE_URL}/api/drivers/company/${transportCompanyId}`;
    
    console.log('🚗 Fetching drivers from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Drivers data received:', result);

    return {
      success: result.success ?? true,
      count: result.count ?? result.data?.length ?? 0,
      data: result.data ?? []
    };
  } catch (error) {
    console.error('❌ Error fetching drivers:', error);
    throw error;
  }
}

/**
 * Refresh driver cache for a specific transport company
 * @param transportCompanyId - ID of the transport company
 */
export async function refreshDrivers(
  transportCompanyId: string
): Promise<{ success: boolean; count: number; data: Driver[] }> {
  try {
    if (!transportCompanyId || transportCompanyId.trim() === '') {
      throw new Error('Transport company ID is required');
    }

    const url = `${API_BASE_URL}/api/drivers/refresh/${transportCompanyId}`;
    
    console.log('🔄 Refreshing drivers cache for company:', transportCompanyId);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Driver cache refreshed:', result);

    return {
      success: result.success ?? true,
      count: result.count ?? result.data?.length ?? 0,
      data: result.data ?? []
    };
  } catch (error) {
    console.error('❌ Error refreshing drivers:', error);
    throw error;
  }
}

/**
 * Get driver cache statistics
 */
export async function getDriverCacheStats(): Promise<{
  success: boolean;
  data: { size: number; keys: string[] };
}> {
  try {
    const url = `${API_BASE_URL}/api/drivers/cache-stats`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: result.success ?? true,
      data: result.data ?? { size: 0, keys: [] }
    };
  } catch (error) {
    console.error('❌ Error fetching driver cache stats:', error);
    throw error;
  }
}
