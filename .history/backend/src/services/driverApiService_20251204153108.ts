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
   * Fetch all drivers from API and filter by transport company ID
   * Uses caching to reduce API calls
   * @param transportCompanyId - ID of transport company (NhaXeID)
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

      console.log(`🚗 Fetching all drivers from API...`);
      const rawData = await this.getAllDrivers(transportCompanyId);
      
      if (!rawData) {
        console.error('❌ No data received from API');
        return cached?.data || [];
      }

      // Transform all drivers
      const allDrivers = this.transformDriverData(rawData);
      
      // Filter by transport company ID
      const filteredDrivers = allDrivers.filter(
        driver => driver.transportCompanyId === transportCompanyId
      );
      console.log(allDrivers[0].transportCompanyId)
            console.log(transportCompanyId)
      // Update cache
      this.cache.set(transportCompanyId, {
        data: filteredDrivers,
        timestamp: now
      });
      
      console.log(`✅ Fetched ${filteredDrivers.length} drivers for company ${transportCompanyId} (from ${allDrivers.length} total)`);
      return filteredDrivers;
    } catch (error) {
      console.error('❌ Error in fetchDriversByCompany:', error);
      const cached = this.cache.get(transportCompanyId);
      return cached?.data || [];
    }
  }

  /**
   * Get all drivers from API
   */
  private async getAllDrivers(transportCompanyId: string): Promise<any> {
    try {
      console.log(`📞 Requesting driver data for company: ${transportCompanyId}`);
      
      const requestData = {
        NhaXeID: transportCompanyId,
        appversion: '2023'
      };
 console.log(transportCompanyId)
      const response = await this.makeAuthenticatedRequest(
        '/api/data/process/GetList_TaiXe_Thuoc_NhaXe',
        this.REQID,
        requestData
      );

      if (response && response.data) {
        console.log('✅ Driver data retrieved successfully');
        console.log('📊 Total drivers:', Array.isArray(response.data) ? response.data.length : 0);
        return response;
      } else if (response && response.error) {
        console.error('❌ API returned error:', response.error);
        return null;
      } else {
        console.warn('⚠️ No data in response');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Failed to get driver data:', error.message);
      
      // If token expired, retry with new token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, refreshing...');
        this.token = null;
        this.reqtime = null;
        const requestData = {
          NhaXeID: transportCompanyId,
          appversion: '2023'
        };
        const tokenSuccess = await this.getTokenData(this.REQID, requestData);
        if (tokenSuccess) {
          return await this.getAllDrivers(transportCompanyId);
        }
      }
      
      return null;
    }
  }

  /**
   * Transform raw API data to Driver model
   * API returns data with structure: { v: "value", r: "value" }
   */
  private transformDriverData(apiData: any): Driver[] {
    try {
      if (!apiData || !apiData.data) {
        console.log('⚠️ No data field in API response');
        return [];
      }

      const drivers = apiData.data;
      
      if (!Array.isArray(drivers)) {
        console.log('⚠️ Data is not an array');
        return [];
      }

      // Helper function to get value from object {v: "", r: ""}
      const getValue = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field.v || field.r || '';
      };

      // Transform each driver
      const transformed = drivers.map((item: any) => {
        const idDriver = getValue(item.ID_driver);
        const fullName = getValue(item.TenHT);
        
        return {
          id: idDriver,
          driverCode: idDriver,
          driverName: fullName,
          fullName: fullName,
          phoneNumber: getValue(item.SoDT),
          idCard: getValue(item.SoCMND),
          birthDate: getValue(item.NgaySinh),
          vehicleId: getValue(item.ID_vehicle),
          vehiclePlate: getValue(item.BienXe),
          transportCompanyId: getValue(item.DoanhNghiepVanTaiID),
          status: 'active' as const
        } as Driver;
      }).filter((driver: Driver) => driver.id && driver.driverName);

      console.log(`✅ Transformed ${transformed.length} drivers`);
      return transformed;
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
