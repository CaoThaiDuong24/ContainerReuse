import { BaseApiService } from './baseApiService';

/**
 * Container Type API Service
 * Handles all API calls related to container types (loại container)
 */

export interface ContainerType {
  id: string;
  name: string;
  code: string;
  containerSize?: string;
  imageUrl?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

class ContainerTypeApiService extends BaseApiService {
  private readonly REQID = 'iContainerHub_LoaiCont';
  private cache: ContainerType[] | null = null;
  private cacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    super();
  }

  /**
   * Fetch container types data from API
   * Uses caching to reduce API calls
   */
  async fetchContainerTypes(): Promise<ContainerType[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.cache && (now - this.cacheTime) < this.CACHE_DURATION) {
        console.log('📦 Using cached container types data');
        return this.cache;
      }

      console.log('📋 Fetching container types from API...');
      const rawData = await this.getContainerTypeData();
      
      if (!rawData) {
        console.error('❌ No data received from API');
        return this.cache || [];
      }

      const transformed = this.transformContainerTypeData(rawData);
      
      // Update cache
      this.cache = transformed;
      this.cacheTime = now;
      
      console.log(`✅ Fetched ${transformed.length} container types`);
      return transformed;
    } catch (error) {
      console.error('❌ Error in fetchContainerTypes:', error);
      return this.cache || [];
    }
  }

  /**
   * Get container type data from API
   */
  private async getContainerTypeData(): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(
        '/api/data/process/iContainerHub_LoaiCont',
        this.REQID,
        {}
      );

      if (response) {
        console.log('✅ Container type data retrieved successfully');
        console.log('📊 Response status code received');
        if (response.data && Array.isArray(response.data)) {
          console.log('📍 Container types count:', response.data.length);
        }
        return response;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get container type data:', error.message);
      
      // If token expired, retry with new token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, refreshing...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken(this.REQID);
        if (tokenSuccess) {
          return await this.getContainerTypeData();
        }
      }
      
      return null;
    }
  }

  /**
   * Transform API data to ContainerType format
   * API returns data with structure: { v: "value", r: "value" }
   */
  private transformContainerTypeData(apiData: any): ContainerType[] {
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

      console.log('📝 Sample raw container type data:', JSON.stringify(rawData[0], null, 2));

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
        const id = item.ID || '';
        const name = getValue(item.TenGoi); // "Cont 20'DC - Khô"
        const code = getValue(item.ContainerType); // "GP", "RF", "UT", etc.
        const isoCode = getValue(item.ISO6346_1995typegroup); // "22GP", "42RF", etc.
        const description = getValue(item.TypegroupDescription); // "GENERAL PURPOSE CONT."
        const containerSize = getValue(item.ContainerSize); // "20'", "40'", "45'"
        const imageUrl = getValue(item.UrlHinhAnh); // "/fileman/Uploads/..."
        const active = getValue(item.Active); // "True" or "False"
        const createdAt = getValue(item.colDateAdd);
        const updatedAt = getValue(item.colDateModified);

        const result: ContainerType = {
          id: id,
          name: name || `${containerSize} ${code}`,
          code: code,
          status: active === 'True' ? 'active' : 'inactive',
        };

        // Add optional fields
        if (containerSize) result.containerSize = containerSize;
        if (imageUrl) result.imageUrl = `https://cms.ltacv.com${imageUrl}`;
        if (description) {
          result.description = `${description} - ${isoCode} (${containerSize})`;
        }
        if (createdAt) result.createdAt = createdAt;
        if (updatedAt) result.updatedAt = updatedAt;

        return result;
      });
    } catch (error) {
      console.error('❌ Error transforming container type data:', error);
      return [];
    }
  }

  /**
   * Get a specific container type by ID
   */
  async getContainerTypeById(id: string): Promise<ContainerType | null> {
    try {
      const containerTypes = await this.fetchContainerTypes();
      return containerTypes.find(ct => ct.id === id) || null;
    } catch (error) {
      console.error('❌ Error getting container type by ID:', error);
      return null;
    }
  }

  /**
   * Get a specific container type by code
   */
  async getContainerTypeByCode(code: string): Promise<ContainerType | null> {
    try {
      const containerTypes = await this.fetchContainerTypes();
      return containerTypes.find(ct => ct.code === code) || null;
    } catch (error) {
      console.error('❌ Error getting container type by code:', error);
      return null;
    }
  }

  /**
   * Search container types by name
   */
  async searchContainerTypes(searchTerm: string): Promise<ContainerType[]> {
    try {
      const containerTypes = await this.fetchContainerTypes();
      const lowerSearch = searchTerm.toLowerCase();
      return containerTypes.filter(ct => 
        ct.name.toLowerCase().includes(lowerSearch) ||
        ct.code.toLowerCase().includes(lowerSearch) ||
        (ct.description && ct.description.toLowerCase().includes(lowerSearch))
      );
    } catch (error) {
      console.error('❌ Error searching container types:', error);
      return [];
    }
  }

  /**
   * Get active container types only
   */
  async getActiveContainerTypes(): Promise<ContainerType[]> {
    try {
      const containerTypes = await this.fetchContainerTypes();
      return containerTypes.filter(ct => ct.status === 'active');
    } catch (error) {
      console.error('❌ Error getting active container types:', error);
      return [];
    }
  }

  /**
   * Refresh the cache
   */
  async refreshCache(): Promise<ContainerType[]> {
    console.log('🔄 Refreshing container types cache...');
    this.cache = null;
    this.cacheTime = 0;
    return await this.fetchContainerTypes();
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

export default new ContainerTypeApiService();
