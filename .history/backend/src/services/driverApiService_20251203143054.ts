import { BaseApiService } from './baseApiService';
import { Driver } from '../models/driver';

/**
 * Driver API Service
 * Handles all API calls related to drivers (tài xế)
 */
class DriverApiService extends BaseApiService {
  private readonly REQID = 'GetList_TaiXe_Thuoc_NhaXe';
  private cache: Map<string, { data: Driver[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    super();
  }

  /**
   * Fetch drivers by transport company ID from API
   * Uses caching to reduce API calls
   * @param transportCompanyId - ID of transport company (DonViVanTaiID)
   */
  async fetchDriversByCompany(transportCompanyId: string): Promise<Driver[]> {
    try {
      // Check cache first
      const now = Date.now();
      const cached = this.cache.get(transportCompanyId);
      
      if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
        console.log(`📦 Using cached drivers data for company ${transportCompanyId}`);
        return cached.data;
      }

      console.log(`🚗 Fetching drivers for company ${transportCompanyId} from API...`);
      const rawData = await this.getDriversByCompany(transportCompanyId);
      
      if (!rawData) {
        console.error('❌ No data received from API');
        return cached?.data || [];
      }

      const transformed = this.transformDriverData(rawData);
      
      // Update cache
      this.cache.set(transportCompanyId, {
        data: transformed,
        timestamp: now
      });
      
      console.log(`✅ Fetched ${transformed.length} drivers for company ${transportCompanyId}`);
      return transformed;
    } catch (error) {
      console.error('❌ Error in fetchDriversByCompany:', error);
      const cached = this.cache.get(transportCompanyId);
      return cached?.data || [];
    }
  }

  /**
   * Get raw driver data from API for a specific transport company
   */
  private async getDriversByCompany(transportCompanyId: string): Promise<any> {
    try {
      const payload = {
        ReqId: this.REQID,
        Token: this.generateToken(),
        DataJson: JSON.stringify({
          DonViVanTaiID: transportCompanyId
        })
      };

      console.log('📡 API Request payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('📦 API Response:', JSON.stringify(result, null, 2));

      if (!result.Data || result.Data.trim() === '') {
        console.warn('⚠️ Empty Data field in API response');
        return null;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(result.Data);
      } catch (parseError) {
        console.error('❌ Failed to parse Data field:', parseError);
        console.log('Raw Data:', result.Data);
        return null;
      }

      return parsedData;
    } catch (error) {
      console.error('❌ Error in getDriversByCompany:', error);
      throw error;
    }
  }

  /**
   * Transform raw API data to Driver model
   */
  private transformDriverData(rawData: any): Driver[] {
    try {
      if (!Array.isArray(rawData)) {
        console.error('❌ Raw data is not an array:', rawData);
        return [];
      }

      return rawData.map((item: any) => ({
        id: item.TaiXeID?.toString() || item.ID?.toString() || '',
        driverCode: item.MaTaiXe || item.Code || '',
        driverName: item.TenTaiXe || item.Name || item.FullName || '',
        fullName: item.HoTenDayDu || item.FullName || item.TenTaiXe || '',
        phoneNumber: item.SoDienThoai || item.PhoneNumber || '',
        licenseNumber: item.SoGiayPhep || item.LicenseNumber || '',
        licenseType: item.LoaiBangLai || item.LicenseType || '',
        idCard: item.CMND || item.CCCD || item.IdCard || '',
        email: item.Email || '',
        address: item.DiaChi || item.Address || '',
        transportCompanyId: item.DonViVanTaiID?.toString() || '',
        transportCompanyName: item.TenDonViVanTai || item.TransportCompanyName || '',
        status: item.TrangThai === 1 || item.Status === 'active' ? 'active' : 'inactive',
        createdAt: item.NgayTao || item.CreatedAt,
        updatedAt: item.NgayCapNhat || item.UpdatedAt
      }));
    } catch (error) {
      console.error('❌ Error transforming driver data:', error);
      return [];
    }
  }

  /**
   * Clear cache for a specific company or all companies
   */
  clearCache(transportCompanyId?: string): void {
    if (transportCompanyId) {
      this.cache.delete(transportCompanyId);
      console.log(`🗑️ Cleared cache for company ${transportCompanyId}`);
    } else {
      this.cache.clear();
      console.log('🗑️ Cleared all driver cache');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number, keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export default new DriverApiService();
