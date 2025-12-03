import { BaseApiService } from './baseApiService';
import { ShippingLine } from '../models/shippingLine';

/**
 * Shipping Line API Service
 * Handles all API calls related to shipping lines (hãng tàu)
 */
class ShippingLineApiService extends BaseApiService {
  private readonly REQID = 'iContainerHub_HangTau';
  private cache: ShippingLine[] | null = null;
  private cacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    super();
  }

  /**
   * Fetch shipping lines data from API
   * Uses caching to reduce API calls
   */
  async fetchShippingLines(): Promise<ShippingLine[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.cache && (now - this.cacheTime) < this.CACHE_DURATION) {
        console.log('📦 Using cached shipping lines data');
        return this.cache;
      }

      console.log('🚢 Fetching shipping lines from API...');
      const rawData = await this.getShippingLineData();
      
      if (!rawData) {
        console.error('❌ No data received from API');
        return this.cache || [];
      }

      const transformed = this.transformShippingLineData(rawData);
      
      // Update cache
      this.cache = transformed;
      this.cacheTime = now;
      
      console.log(`✅ Fetched ${transformed.length} shipping lines`);
      return transformed;
    } catch (error) {
      console.error('❌ Error in fetchShippingLines:', error);
      return this.cache || [];
    }
  }

  /**
   * Get shipping line data from API
   */
  private async getShippingLineData(): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(
        '/api/data/process/iContainerHub_HangTau',
        this.REQID,
        {}
      );

      if (response) {
        console.log('✅ Shipping line data retrieved successfully');
        console.log('📊 Response status code received');
        if (response.data && Array.isArray(response.data)) {
          console.log('📍 Shipping lines count:', response.data.length);
        }
        return response;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get shipping line data:', error.message);
      
      // If token expired, retry with new token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, refreshing...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken(this.REQID);
        if (tokenSuccess) {
          return await this.getShippingLineData();
        }
      }
      
      return null;
    }
  }

  /**
   * Transform API data to ShippingLine format
   * API returns data with structure: { v: "value", r: "value" }
   */
  private transformShippingLineData(apiData: any): ShippingLine[] {
    try {
      if (!apiData || !apiData.data) {
        console.log('⚠️ No data field in API response');
        return [];
      }

      const shippingLines = apiData.data;
      
      if (!Array.isArray(shippingLines)) {
        console.log('⚠️ Data is not an array');
        return [];
      }

      // Helper function to get value from object {v: "", r: ""}
      const getValue = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field.v || field.r || '';
      };

      // Transform each shipping line
      const transformed = shippingLines.map((line: any, index: number) => {
        try {
          const id = getValue(line.HangTauID) || `${index + 1}`;
          const code = getValue(line.MaHangTau) || getValue(line.Code) || '';
          const name = getValue(line.TenHangTau) || getValue(line.Name) || '';
          const fullName = getValue(line.TenDayDu) || getValue(line.FullName) || name;
          
          return {
            id: id.toString(),
            code: code.toUpperCase(),
            name: name,
            fullName: fullName,
            scacCode: getValue(line.SCACCode) || getValue(line.SCAC),
            country: getValue(line.QuocGia) || getValue(line.Country),
            website: getValue(line.Website),
            email: getValue(line.Email),
            phone: getValue(line.DienThoai) || getValue(line.Phone),
            status: (getValue(line.TrangThai) || getValue(line.Status) || 'active') === 'active' ? 'active' : 'inactive',
            createdAt: getValue(line.NgayTao) || getValue(line.CreatedAt),
            updatedAt: getValue(line.NgayCapNhat) || getValue(line.UpdatedAt)
          } as ShippingLine;
        } catch (err) {
          console.error('⚠️ Error transforming shipping line:', err);
          return null;
        }
      }).filter((line): line is ShippingLine => line !== null);

      console.log(`✅ Transformed ${transformed.length} shipping lines`);
      return transformed;
    } catch (error) {
      console.error('❌ Error transforming shipping line data:', error);
      return [];
    }
  }

  /**
   * Get shipping line by ID
   */
  async getShippingLineById(id: string): Promise<ShippingLine | null> {
    try {
      const shippingLines = await this.fetchShippingLines();
      return shippingLines.find(line => line.id === id) || null;
    } catch (error) {
      console.error('❌ Error getting shipping line by ID:', error);
      return null;
    }
  }

  /**
   * Get shipping line by code
   */
  async getShippingLineByCode(code: string): Promise<ShippingLine | null> {
    try {
      const shippingLines = await this.fetchShippingLines();
      return shippingLines.find(line => line.code.toUpperCase() === code.toUpperCase()) || null;
    } catch (error) {
      console.error('❌ Error getting shipping line by code:', error);
      return null;
    }
  }

  /**
   * Search shipping lines by name or code
   */
  async searchShippingLines(query: string): Promise<ShippingLine[]> {
    try {
      const shippingLines = await this.fetchShippingLines();
      const searchTerm = query.toLowerCase();
      
      return shippingLines.filter(line => 
        line.name.toLowerCase().includes(searchTerm) ||
        line.code.toLowerCase().includes(searchTerm) ||
        line.fullName.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('❌ Error searching shipping lines:', error);
      return [];
    }
  }

  /**
   * Get statistics about shipping lines
   */
  async getStatistics() {
    try {
      const shippingLines = await this.fetchShippingLines();
      
      const stats = {
        total: shippingLines.length,
        active: shippingLines.filter(line => line.status === 'active').length,
        inactive: shippingLines.filter(line => line.status === 'inactive').length,
        byCountry: {} as Record<string, number>
      };

      // Count by country
      shippingLines.forEach(line => {
        if (line.country) {
          stats.byCountry[line.country] = (stats.byCountry[line.country] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('❌ Error getting statistics:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byCountry: {}
      };
    }
  }

  /**
   * Clear cache - useful for forcing refresh
   */
  clearCache(): void {
    this.cache = null;
    this.cacheTime = 0;
    console.log('🗑️ Shipping line cache cleared');
  }
}

// Export singleton instance
const shippingLineApiService = new ShippingLineApiService();
export default shippingLineApiService;
