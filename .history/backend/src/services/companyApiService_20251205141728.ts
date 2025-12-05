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
  async getToken(reqid: string = "GetList_TaiXe_Thuoc_NhaXe", dataPayload?: any): Promise<boolean> {
    try {
      console.log(`🔑 Getting token for ${reqid}...`);
      
      const tokenData = dataPayload || { appversion: '2023' };
      
      const response = await axios.post(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
        reqid: reqid,
        data: tokenData
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
   * Get company profile data from GetList_AccountInfo API
   * @param accountId - Optional AccountID to get specific user profile
   */
  async getUserProfileData(accountId?: string): Promise<any> {
    try {
      // Prepare data payload
      const dataPayload: any = {
        appversion: '2023'
      };
      
      if (accountId) {
         dataPayload.AccountID = accountId;
      }

      
      const tokenSuccess = await this.getToken("GetList_AccountInfo", dataPayload);
      if (!tokenSuccess) {
        throw new Error('Failed to get token for GetList_AccountInfo');
      }
      

      console.log(`📡 Calling GetList_AccountInfo API${accountId ? ' for AccountID: ' + accountId : ''}...`);
      const response = await axios.post(`${this.apiUrl}/api/data/process/GetList_AccountInfo`, {
        reqid: "GetList_AccountInfo",
        token: this.token,
        reqtime: this.reqtime,
        data: dataPayload
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data) {
        console.log('✅ GetList_AccountInfo data retrieved successfully');
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('📊 Company profiles count:', response.data.data.length);
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Failed to get GetList_AccountInfo data:', error.message);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const retryDataPayload: any = {
          appversion: '2023'
        };
        if (accountId) {
          retryDataPayload.AccountID = accountId;
        }
        const tokenSuccess = await this.getToken("GetList_AccountInfo", retryDataPayload);
        if (tokenSuccess) {
          return await this.getUserProfileData(accountId);
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

      console.log(`🏢 Fetching companies from GetList_AccountInfo API...`);
      
      // Try GetList_AccountInfo API first
      const userProfileData = await this.getUserProfileData();
      
      let companies: Company[] = [];
      
      if (userProfileData && userProfileData.data && Array.isArray(userProfileData.data) && userProfileData.data.length > 0) {
        console.log('✅ Using data from GetList_AccountInfo API');
        companies = this.extractCompaniesFromUserProfile(userProfileData);
      } else {
        console.log('⚠️ GetList_AccountInfo returned no data, falling back to Driver API...');
        // Fallback to extracting from driver API
        const rawData = await this.getDriverData();
        
        if (!rawData || !rawData.data) {
          console.error('❌ No data received from any API');
          return cached?.data || [];
        }
        
        companies = this.extractCompaniesFromDrivers(rawData);
      }
      
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
   * Get company by user ID
   * Extracts company information from GetList_AccountInfo API (primary) or Driver API (fallback)
   */
  async fetchCompanyByUserId(userId: string): Promise<Company | null> {
    try {
      console.log(`🔍 Finding company for user ID: ${userId}`);
      
      // Try GetList_AccountInfo API first with AccountID
      console.log('📡 Fetching from GetList_AccountInfo API...');
      const userProfileData = await this.getUserProfileData(userId);
      
      if (userProfileData && userProfileData.data && Array.isArray(userProfileData.data) && userProfileData.data.length > 0) {
        const getValue = (field: any): string => {
          if (!field) return '';
          if (typeof field === 'string') return field;
          return field.v || field.r || '';
        };

        // Get first profile (should be the user we requested)
        const userProfile = userProfileData.data[0];

        if (userProfile) {
          // DVVanTaiID_CMS is the transport company ID
          // Fallback order: DVVanTaiID_CMS -> DonViVanTaiID -> CompanyID -> NhaXeID -> AccountGroupID
          const companyId = getValue(userProfile.DVVanTaiID_CMS) || 
                           getValue(userProfile.DonViVanTaiID) || 
                           getValue(userProfile.CompanyID) || 
                           getValue(userProfile.NhaXeID) ||
                           getValue(userProfile.AccountGroupID);
          
          if (!companyId) {
            console.warn(`⚠️ User ${userId} has no company assigned in GetList_AccountInfo`);
          } else {
            console.log(`✅ Found company from GetList_AccountInfo: ${companyId}`);
            
            const companyName = getValue(userProfile.CompanyName) || getValue(userProfile.VanTaiTenDayDu) || `Nhà xe ${companyId}`;
            const taxCode = getValue(userProfile.TaxCode) || getValue(userProfile.MaSoThue);
            const address = getValue(userProfile.Address) || getValue(userProfile.DiaChi);
            const phone = getValue(userProfile.Phone) || getValue(userProfile.SoDT);
            const email = getValue(userProfile.Email);
            const contactPerson = getValue(userProfile.ContactPerson) || getValue(userProfile.NguoiLienHe);
            
            const companyNameInvoice = getValue(userProfile.TenCongTyInHoaDon) ;
            const companyId_Invoice = getValue(userProfile.MaSoThue	);
            return {
              id: companyId,
              code: companyId,
              name: companyName,
              companyid_Invoice: companyId_Invoice,
              companyname_Invoice: companyNameInvoice,
              taxCode: taxCode,
              address: address,
              phone: phone,
              email: email,
              contactPerson: contactPerson,
              type: 'transport',
              rawApiData: { 
                companyId, 
                id: userId,
                source: 'GetList_AccountInfo',
                userProfile: {
                  userId: getValue(userProfile.UserID) || getValue(userProfile.AccUserKey),
                  userName: getValue(userProfile.UserName) || getValue(userProfile.TenHT),
                  phone: getValue(userProfile.Phone) || getValue(userProfile.SoDT)
                }
              }
            };
          }
        }
      }
      
      // Fallback to Driver API
      console.log('📡 Fetching from Driver API (fallback)...');
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
   * Extract companies from GetList_AccountInfo data
   */
  private extractCompaniesFromUserProfile(apiData: any): Company[] {
    try {
      if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
        console.warn('⚠️ No GetList_AccountInfo data to extract companies from');
        return [];
      }

      const getValue = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field.v || field.r || '';
      };

      // Extract unique companies using Map
      const companyMap = new Map<string, Company>();

      apiData.data.forEach((profile: any) => {
        // DonViVanTaiID is the transport company ID field
        const companyId = getValue(profile.DonViVanTaiID) || getValue(profile.CompanyID) || getValue(profile.NhaXeID);
        
        if (companyId && !companyMap.has(companyId)) {
          const companyName = getValue(profile.CompanyName) || getValue(profile.TenNhaXe) || getValue(profile.TenDonViVanTai) || `Nhà xe ${companyId}`;
          const taxCode = getValue(profile.TaxCode) || getValue(profile.MaSoThue);
          const address = getValue(profile.Address) || getValue(profile.DiaChi);
          const phone = getValue(profile.Phone) || getValue(profile.SoDT);
          const email = getValue(profile.Email);
          const contactPerson = getValue(profile.ContactPerson) || getValue(profile.NguoiLienHe);
          
          companyMap.set(companyId, {
            id: companyId,
            code: companyId,
            name: companyName,
            taxCode: taxCode,
            address: address,
            phone: phone,
            email: email,
            contactPerson: contactPerson,
            type: 'transport',
            rawApiData: { 
              companyId, 
              source: 'GetList_AccountInfo',
              originalData: profile 
            }
          });
        }
      });

      const companies = Array.from(companyMap.values());
      console.log(`✅ Extracted ${companies.length} unique companies from GetList_AccountInfo`);
      return companies;
    } catch (error) {
      console.error('❌ Error extracting companies from GetList_AccountInfo:', error);
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
