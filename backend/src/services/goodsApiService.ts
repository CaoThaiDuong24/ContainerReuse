import { BaseApiService } from './baseApiService';

/**
 * Goods API Service
 * Handles all API calls related to goods types (loại hàng hóa)
 */

export interface Goods {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

class GoodsApiService extends BaseApiService {
  private readonly REQID = 'iContainerHub_HangHoa';
  private cache: Goods[] | null = null;
  private cacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    super();
  }

  /**
   * Fetch goods data from API
   * Uses caching to reduce API calls
   */
  async fetchGoods(): Promise<Goods[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.cache && (now - this.cacheTime) < this.CACHE_DURATION) {
        console.log('📦 Using cached goods data');
        return this.cache;
      }

      console.log('📋 Fetching goods from API...');
      const rawData = await this.getGoodsData();
      
      if (!rawData) {
        console.error('❌ No data received from API');
        return this.cache || [];
      }

      const transformed = this.transformGoodsData(rawData);
      
      // Update cache
      this.cache = transformed;
      this.cacheTime = now;
      
      console.log(`✅ Fetched ${transformed.length} goods types`);
      return transformed;
    } catch (error) {
      console.error('❌ Error in fetchGoods:', error);
      return this.cache || [];
    }
  }

  /**
   * Get goods data from API
   */
  private async getGoodsData(): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(
        '/api/data/process/iContainerHub_HangHoa',
        this.REQID,
        {}
      );

      if (response) {
        console.log('✅ Goods data retrieved successfully');
        console.log('📊 Response status code received');
        if (response.data && Array.isArray(response.data)) {
          console.log('📍 Goods count:', response.data.length);
        }
        return response;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get goods data:', error.message);
      
      // If token expired, retry with new token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, refreshing...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken(this.REQID);
        if (tokenSuccess) {
          return await this.getGoodsData();
        }
      }
      
      return null;
    }
  }

  /**
   * Transform API data to Goods format
   * API returns data with structure: { v: "value", r: "value" }
   */
  private transformGoodsData(apiData: any): Goods[] {
    try {
      if (!apiData || !apiData.data) {
        console.log('⚠️ No data field in API response');
        return [];
      }

      const rawData = apiData.data;
      
      if (!Array.isArray(rawData)) {
        console.error('⚠️ API data is not an array');
        return [];
      }

      console.log('📝 Sample raw goods data:', JSON.stringify(rawData[0], null, 2));

      return rawData.map((item: any) => {
        // Helper function to get value from API field
        const getValue = (field: any): string => {
          if (!field) return '';
          if (typeof field === 'object') {
            return field.v !== undefined ? field.v : (field.r !== undefined ? field.r : '');
          }
          return String(field);
        };

        // Extract values from API response
        const id = getValue(item.ID) || getValue(item.id);
        const name = getValue(item.Tenhanghoa) || getValue(item.TenGoi) || getValue(item.Ten) || getValue(item.Name);
        const code = getValue(item.MaHangHoa) || getValue(item.Ma) || getValue(item.Code);
        const description = getValue(item.MoTa) || getValue(item.GhiChu);
        const active = getValue(item.Active) || getValue(item.TrangThai);
        const createdAt = getValue(item.colDateAdd) || getValue(item.NgayTao);
        const updatedAt = getValue(item.colDateModified) || getValue(item.NgayCapNhat);

        const result: Goods = {
          id: id || code || name,
          name: name || `Hàng hóa ${id}`,
          status: active === 'True' || active === '1' || active === 'true' ? 'active' : 'inactive',
        };

        // Add optional fields
        if (code) result.code = code;
        if (description) result.description = description;
        if (createdAt) result.createdAt = createdAt;
        if (updatedAt) result.updatedAt = updatedAt;

        return result;
      });
    } catch (error) {
      console.error('❌ Error transforming goods data:', error);
      return [];
    }
  }

  /**
   * Get a specific goods type by ID
   */
  async getGoodsById(id: string): Promise<Goods | null> {
    try {
      const goods = await this.fetchGoods();
      return goods.find(g => g.id === id) || null;
    } catch (error) {
      console.error('❌ Error getting goods by ID:', error);
      return null;
    }
  }

  /**
   * Get a specific goods type by code
   */
  async getGoodsByCode(code: string): Promise<Goods | null> {
    try {
      const goods = await this.fetchGoods();
      return goods.find(g => g.code === code) || null;
    } catch (error) {
      console.error('❌ Error getting goods by code:', error);
      return null;
    }
  }

  /**
   * Search goods by name
   */
  async searchGoods(searchTerm: string): Promise<Goods[]> {
    try {
      const goods = await this.fetchGoods();
      const lowerSearch = searchTerm.toLowerCase();
      return goods.filter(g => 
        g.name.toLowerCase().includes(lowerSearch) ||
        (g.code && g.code.toLowerCase().includes(lowerSearch)) ||
        (g.description && g.description.toLowerCase().includes(lowerSearch))
      );
    } catch (error) {
      console.error('❌ Error searching goods:', error);
      return [];
    }
  }

  /**
   * Get active goods only
   */
  async getActiveGoods(): Promise<Goods[]> {
    try {
      const goods = await this.fetchGoods();
      return goods.filter(g => g.status === 'active');
    } catch (error) {
      console.error('❌ Error getting active goods:', error);
      return [];
    }
  }

  /**
   * Refresh the cache
   */
  async refreshCache(): Promise<Goods[]> {
    console.log('🔄 Refreshing goods cache...');
    this.cache = null;
    this.cacheTime = 0;
    return await this.fetchGoods();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { isCached: boolean; age: number; count: number } {
    const now = Date.now();
    return {
      isCached: this.cache !== null && (now - this.cacheTime) < this.CACHE_DURATION,
      age: this.cache ? now - this.cacheTime : 0,
      count: this.cache ? this.cache.length : 0,
    };
  }
}

export default new GoodsApiService();
