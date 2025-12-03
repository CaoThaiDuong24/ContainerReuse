import { BaseApiService } from './baseApiService';
import { Company } from '../models/company';

/**
 * Company API Service
 * Handles all API calls related to company information via HRMS_UserProfile
 */
class CompanyApiService extends BaseApiService {
  private readonly REQID = 'HRMS_UserProfile';
  private cache: Map<string, { data: Company[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

  constructor() {
    super();
  }

  /**
   * Fetch all companies from HRMS_UserProfile API
   * Uses caching to reduce API calls
   */
  async fetchAllCompanies(): Promise<Company[]> {
    try {
      // Check cache first
      const cacheKey = 'all_companies';
      const now = Date.now();
      const cached = this.cache.get(cacheKey);
      
      if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
        console.log(`📦 Using cached companies data`);
        return cached.data;
      }

      console.log(`🏢 Fetching all companies from HRMS_UserProfile API...`);
      const rawData = await this.getAllCompanies();
      
      if (!rawData) {
        console.error('❌ No data received from API');
        return cached?.data || [];
      }

      // Transform company data
      const companies = this.transformCompanyData(rawData);
      
      // Update cache
      this.cache.set(cacheKey, {
        data: companies,
        timestamp: now
      });
      
      console.log(`✅ Fetched ${companies.length} companies`);
      return companies;
    } catch (error) {
      console.error('❌ Error in fetchAllCompanies:', error);
      const cached = this.cache.get('all_companies');
      return cached?.data || [];
    }
  }

  /**
   * Fetch company by ID
   */
  async fetchCompanyById(companyId: string): Promise<Company | null> {
    try {
      const companies = await this.fetchAllCompanies();
      const company = companies.find(c => c.id === companyId || c.code === companyId);
      
      if (!company) {
        console.warn(`⚠️ Company not found with ID: ${companyId}`);
        return null;
      }
      
      return company;
    } catch (error) {
      console.error('❌ Error in fetchCompanyById:', error);
      return null;
    }
  }

  /**
   * Get all companies from API
   */
  private async getAllCompanies(): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(
        '/api/data/process/HRMS_UserProfile',
        this.REQID,
        {}
      );

      if (response && response.data) {
        console.log('✅ Company data retrieved successfully');
        console.log('📊 Total companies:', Array.isArray(response.data) ? response.data.length : 0);
        return response;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get company data:', error.message);
      
      // If token expired, retry with new token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, refreshing...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken(this.REQID);
        if (tokenSuccess) {
          return await this.getAllCompanies();
        }
      }
      
      return null;
    }
  }

  /**
   * Transform raw API data to Company model
   */
  private transformCompanyData(apiResponse: any): Company[] {
    try {
      if (!apiResponse || !apiResponse.data) {
        console.warn('⚠️ No company data to transform');
        return [];
      }

      let rawData = apiResponse.data;
      
      // Handle various response formats
      if (!Array.isArray(rawData)) {
        if (typeof rawData === 'string') {
          try {
            rawData = JSON.parse(rawData);
          } catch (e) {
            console.error('❌ Failed to parse company data string:', e);
            return [];
          }
        } else if (rawData.data && Array.isArray(rawData.data)) {
          rawData = rawData.data;
        } else {
          console.warn('⚠️ Company data is not an array:', typeof rawData);
          return [];
        }
      }

      const companies: Company[] = rawData.map((item: any) => {
        // Transform based on actual API response structure
        // You may need to adjust these field mappings based on actual API response
        return {
          id: item.ID?.toString() || item.CompanyID?.toString() || item.NhaXeID?.toString() || '',
          code: item.Code || item.CompanyCode || item.MaNhaXe || item.ID?.toString() || '',
          name: item.Name || item.CompanyName || item.TenNhaXe || '',
          taxCode: item.TaxCode || item.MST || '',
          address: item.Address || item.DiaChi || '',
          phone: item.Phone || item.DienThoai || '',
          email: item.Email || '',
          contactPerson: item.ContactPerson || item.NguoiLienHe || '',
          type: item.Type || item.LoaiHinh || '',
          rawApiData: item // Keep original data for debugging
        };
      }).filter((company: Company) => company.id && company.name); // Filter out invalid entries

      console.log(`✅ Transformed ${companies.length} companies`);
      return companies;
    } catch (error) {
      console.error('❌ Error transforming company data:', error);
      return [];
    }
  }

  /**
   * Clear cache for specific key or all
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
      console.log(`🗑️ Cleared cache for key: ${key}`);
    } else {
      this.cache.clear();
      console.log('🗑️ Cleared all company cache');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const stats = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      itemCount: value.data.length,
      age: Date.now() - value.timestamp,
      timestamp: new Date(value.timestamp).toISOString()
    }));

    return {
      cacheCount: this.cache.size,
      cacheDuration: this.CACHE_DURATION,
      entries: stats
    };
  }
}

// Export singleton instance
const companyApiService = new CompanyApiService();
export default companyApiService;
