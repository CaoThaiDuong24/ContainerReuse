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
   * Get user profile data from HRMS_UserProfile API by AccountID
   */
  async getUserProfileData(accountId: string): Promise<any> {
    try {
      const reqid = 'HRMS_UserProfile';
      
      // Get token for HRMS_UserProfile
      const tokenResponse = await axios.post(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
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

      if (!tokenResponse.data || !tokenResponse.data.token) {
        throw new Error('Failed to get token');
      }

      console.log('📡 Calling HRMS_UserProfile API with AccountID:', accountId);
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/HRMS_UserProfile`, {
        reqid: reqid,
        token: tokenResponse.data.token,
        reqtime: tokenResponse.data.reqtime,
        data: {
          appversion: '2023',
          AccountID: parseInt(accountId)
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data) {
        console.log('✅ User profile data retrieved successfully');
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('📊 Profile records:', response.data.data.length);
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get user profile data:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
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
   * Get company by user accuserkey from HRMS_UserProfile API
   * Uses AccountID parameter to get specific user's company info
   */
  async fetchCompanyByUserId(accuserkey: string): Promise<Company | null> {
    try {
      console.log(`🔍 Finding company for user AccountID: ${accuserkey}`);
      
      // Get user profile from HRMS_UserProfile with AccountID
      const rawData = await this.getUserProfileData(accuserkey);
      
      if (!rawData || !rawData.data) {
        console.error('❌ No user profile data available');
        return null;
      }

      const getValue = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field.v || field.r || '';
      };

      let profileData = rawData.data;

      // Handle if data is array, get first record
      if (Array.isArray(profileData)) {
        if (profileData.length === 0) {
          console.warn(`⚠️ No profile found for AccountID: ${accuserkey}`);
          return null;
        }
        profileData = profileData[0];
      }

      // Extract company information from profile
      const companyId = getValue(profileData.CompanyID) || getValue(profileData.NhaXeID) || getValue(profileData.ID);
      const companyName = getValue(profileData.CompanyName) || getValue(profileData.TenNhaXe) || getValue(profileData.Name) || `Công ty ${companyId}`;
      const companyCode = getValue(profileData.CompanyCode) || getValue(profileData.MaNhaXe) || companyId;
      
      if (!companyId) {
        console.warn(`⚠️ User ${accuserkey} has no company assigned`);
        return null;
      }

      console.log(`✅ Found company ${companyId} (${companyName}) for user ${accuserkey}`);

      // Return company info from HRMS_UserProfile
      return {
        id: companyId,
        code: companyCode,
        name: companyName,
        taxCode: getValue(profileData.TaxCode) || getValue(profileData.MST) || '',
        address: getValue(profileData.Address) || getValue(profileData.DiaChi) || '',
        phone: getValue(profileData.Phone) || getValue(profileData.DienThoai) || '',
        email: getValue(profileData.Email) || '',
        contactPerson: getValue(profileData.ContactPerson) || getValue(profileData.NguoiLienHe) || '',
        type: getValue(profileData.Type) || getValue(profileData.LoaiHinh) || 'company',
        rawApiData: { 
          accountId: accuserkey,
          source: 'HRMS_UserProfile',
          fullProfile: profileData
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
