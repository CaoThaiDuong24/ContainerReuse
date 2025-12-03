import axios from 'axios';
import { Company } from '../models/company';

/**
 * Company API Service
 * Extracts company information from driver API (GetList_TaiXe_Thuoc_NhaXe)
 * Similar to depot API structure
 */
class CompanyApiService {
  private apiUrl: string;
  private token: string | null = null;
  private reqtime: string | null = null;
  private cache: Map<string, { data: Company[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
  }

  /**
   * Get token from API
   */
  async getToken(reqid: string = "GetList_TaiXe_Thuoc_NhaXe"): Promise<boolean> {
    try {
      console.log(`🔑 Getting token for ${reqid}...`);
      
      const response = await axios.post(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
        reqid: reqid,
        data: {
          appversion: '2023'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data && response.data.token && response.data.reqtime) {
        this.token = response.data.token;
        this.reqtime = response.data.reqtime;
        console.log('✅ Token retrieved successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('❌ Failed to get token:', error.message || error);
      return false;
    }
  }

  /**
   * Get company profile data from HRMS_UserProfile API
   */
  async getUserProfileData(): Promise<any> {
    try {
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token for HRMS_UserProfile...');
        const tokenSuccess = await this.getToken("HRMS_UserProfile");
        if (!tokenSuccess) {
          throw new Error('Failed to get token for HRMS_UserProfile');
        }
      }

      console.log('📡 Calling HRMS_UserProfile API to get company data...');
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/HRMS_UserProfile`, {
        reqid: "HRMS_UserProfile",
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data) {
        console.log('✅ HRMS_UserProfile data retrieved successfully');
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('📊 Company profiles count:', response.data.data.length);
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get HRMS_UserProfile data:', error.message);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken("HRMS_UserProfile");
        if (tokenSuccess) {
          return await this.getUserProfileData();
        }
      }
      
      return null;
    }
  }



  /**
   * Get driver data from API
   */
  async getDriverData(): Promise<any> {
    try {
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenSuccess = await this.getToken();
        if (!tokenSuccess) {
          throw new Error('Failed to get token');
        }
      }

      console.log('📡 Calling API to get driver data...');
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/GetList_TaiXe_Thuoc_NhaXe`, {
        reqid: "GetList_TaiXe_Thuoc_NhaXe",
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data) {
        console.log('✅ Driver data retrieved successfully');
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('📊 Drivers count:', response.data.data.length);
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get driver data:', error.message);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken();
        if (tokenSuccess) {
          return await this.getDriverData();
        }
      }
      
      return null;
    }
  }

  /**
   * Extract unique companies from driver data
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

      console.log(`🏢 Extracting companies from driver API...`);
      const rawData = await this.getDriverData();
      
      if (!rawData || !rawData.data) {
        console.error('❌ No data received from API');
        return cached?.data || [];
      }

      // Extract unique companies
      const companies = this.extractCompaniesFromDrivers(rawData);
      
      // Update cache
      this.cache.set(cacheKey, {
        data: companies,
        timestamp: now
      });
      
      console.log(`✅ Extracted ${companies.length} unique companies`);
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
   * Get company by user ID
   * Extracts company information from Driver API
   */
  async fetchCompanyByUserId(userId: string): Promise<Company | null> {
    try {
      console.log(`🔍 Finding company for user ID: ${userId}`);
      
      // Get company from Driver API
      console.log('📡 Fetching from Driver API...');
      const driverData = await this.getDriverData();
      
      if (!driverData || !driverData.data || !Array.isArray(driverData.data)) {
        console.error('❌ No driver data available');
        return null;
      }

      const getValue = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field.v || field.r || '';
      };

      // Find driver with matching user ID
      const userDriver = driverData.data.find((driver: any) => {
        const driverId = getValue(driver.ID_driver);
        return driverId === userId;
      });

      if (!userDriver) {
        console.warn(`⚠️ No data found for user: ${userId}`);
        return null;
      }

      const nhaXeID = getValue(userDriver.NhaXeID);
      
      if (!nhaXeID) {
        console.warn(`⚠️ User ${userId} has no company assigned`);
        return null;
      }

      console.log(`✅ Found company from Driver API: ${nhaXeID}`);

      // Return company info from driver data
      return {
        id: nhaXeID,
        code: nhaXeID,
        name: `Nhà xe ${nhaXeID}`,
        taxCode: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: '',
        type: 'transport',
        rawApiData: { 
          nhaXeID, 
          id: userId,
          source: 'driver_api',
          driverInfo: {
            id: getValue(userDriver.ID_driver),
            name: getValue(userDriver.TenHT),
            phone: getValue(userDriver.SoDT)
          }
        }
      };
    } catch (error) {
      console.error('❌ Error in fetchCompanyByUserId:', error);
      return null;
    }
  }



  /**
   * Extract unique companies from driver data
   */
  private extractCompaniesFromDrivers(apiData: any): Company[] {
    try {
      if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
        console.warn('⚠️ No driver data to extract companies from');
        return [];
      }

      const getValue = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field.v || field.r || '';
      };

      // Extract unique companies using Map
      const companyMap = new Map<string, Company>();

      apiData.data.forEach((driver: any) => {
        const nhaXeID = getValue(driver.NhaXeID);
        
        if (nhaXeID && !companyMap.has(nhaXeID)) {
          // Create company entry from first driver with this NhaXeID
          companyMap.set(nhaXeID, {
            id: nhaXeID,
            code: nhaXeID,
            name: `Nhà xe ${nhaXeID}`, // Default name, could be enhanced later
            taxCode: '',
            address: '',
            phone: '',
            email: '',
            contactPerson: '',
            type: 'transport',
            rawApiData: { nhaXeID, source: 'driver_api' }
          });
        }
      });

      const companies = Array.from(companyMap.values());
      console.log(`✅ Extracted ${companies.length} unique companies from driver data`);
      return companies;
    } catch (error) {
      console.error('❌ Error extracting companies from driver data:', error);
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
