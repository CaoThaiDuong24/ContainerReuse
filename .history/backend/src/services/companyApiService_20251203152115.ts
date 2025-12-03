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
   * Get user profile data from HRMS_UserProfile API
   * Note: API doesn't support ID filter, so we get all data and filter client-side by ID/AccountID/UserID
   */
  async getUserProfileData(userId: string): Promise<any> {
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

      console.log('📡 Calling HRMS_UserProfile API (getting all data)...');
      
      // Call API without AccountID filter (API doesn't support it)
      const response = await axios.post(`${this.apiUrl}/api/data/process/HRMS_UserProfile`, {
        reqid: reqid,
        token: tokenResponse.data.token,
        reqtime: tokenResponse.data.reqtime,
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
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('📊 Total profiles from API:', response.data.data.length);
          
          // Filter client-side by ID (checking AccountID, ID, UserID fields)
          if (response.data.data.length > 0) {
            const getValue = (field: any): string => {
              if (!field) return '';
              if (typeof field === 'string') return field;
              return field.v || field.r || '';
            };

            const filtered = response.data.data.filter((profile: any) => {
              const id = getValue(profile.ID) || getValue(profile.AccountID) || getValue(profile.UserID);
              return id === userId || id === String(userId);
            });

            if (filtered.length > 0) {
              console.log(`✅ Found profile for user ID ${userId}`);
              return { ...response.data, data: filtered };
            } else {
              console.log(`⚠️ No profile found for user ID ${userId} in ${response.data.data.length} records`);
            }
          }
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
   * Get company by user ID
   * 1. First tries HRMS_UserProfile API with user ID parameter
   * 2. If no data, falls back to extracting from Driver API
   */
  async fetchCompanyByUserId(userId: string): Promise<Company | null> {
    try {
      console.log(`🔍 Finding company for user ID: ${userId}`);
      
      // Try Method 1: HRMS_UserProfile API (preferred method)
      console.log('📡 Method 1: Trying HRMS_UserProfile API...');
      const profileData = await this.getUserProfileData(userId);
      
      if (profileData && profileData.data) {
        const getValue = (field: any): string => {
          if (!field) return '';
          if (typeof field === 'string') return field;
          return field.v || field.r || '';
        };

        let profile = profileData.data;

        // Handle if data is array, get first record
        if (Array.isArray(profile)) {
          if (profile.length > 0) {
            profile = profile[0];
          } else {
            console.log('⚠️ HRMS_UserProfile returned empty array');
            profile = null;
          }
        }

        if (profile) {
          // Extract company information from profile
          const companyId = getValue(profile.CompanyID) || getValue(profile.NhaXeID) || getValue(profile.ID);
          const companyName = getValue(profile.CompanyName) || getValue(profile.TenNhaXe) || getValue(profile.Name) || `Công ty ${companyId}`;
          const companyCode = getValue(profile.CompanyCode) || getValue(profile.MaNhaXe) || companyId;
          
          if (companyId) {
            console.log(`✅ Found company from HRMS_UserProfile: ${companyId} (${companyName})`);

            return {
              id: companyId,
              code: companyCode,
              name: companyName,
              taxCode: getValue(profile.TaxCode) || getValue(profile.MST) || '',
              address: getValue(profile.Address) || getValue(profile.DiaChi) || '',
              phone: getValue(profile.Phone) || getValue(profile.DienThoai) || '',
              email: getValue(profile.Email) || '',
              contactPerson: getValue(profile.ContactPerson) || getValue(profile.NguoiLienHe) || '',
              type: getValue(profile.Type) || getValue(profile.LoaiHinh) || 'company',
              rawApiData: { 
                accountId: accuserkey,
                source: 'HRMS_UserProfile',
                fullProfile: profile
              }
            };
          }
        }
      }

      // Method 2: Fallback to Driver API
      console.log('📡 Method 2: Falling back to Driver API...');
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
          userId: userId,
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
