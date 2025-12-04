import axios, { AxiosInstance } from 'axios';

/**
 * Base API Service class for all external API integrations
 * Provides common functionality for authentication, token management, and API calls
 */
export abstract class BaseApiService {
  protected apiUrl: string;
  protected token: string | null = null;
  protected reqtime: string | null = null;
  protected axiosInstance: AxiosInstance;

  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
    
    // Create axios instance with common config
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get authentication token from API
   * @param reqid - Request ID for the specific endpoint
   * @returns Promise<boolean> - True if token retrieved successfully
   */
  protected async getToken(reqid: string): Promise<boolean> {
    try {
      console.log(`🔑 Getting token for ${reqid}...`);
      
      const response = await this.axiosInstance.post('/api/data/util/gettokenNonAid', {
        reqid: reqid,
        data: {
          appversion: '2023'
        }
      }, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data && response.data.token && response.data.reqtime) {
        this.token = response.data.token;
        this.reqtime = response.data.reqtime;
        console.log('✅ Token retrieved successfully');
        if (this.token) {
          console.log('🔐 Token (first 20 chars):', this.token.substring(0, 20) + '...');
        }
        console.log('⏰ Reqtime:', this.reqtime);
        return true;
      } else {
        console.error('❌ Invalid token response:', response.data);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Failed to get token:', error.message || error);
      if (error.response) {
        console.error('📛 Response status:', error.response.status);
        console.error('📛 Response data:', error.response.data);
      }
      return false;
    }
  }
protected async getTokenData(reqid: string , dataPayload?: any): Promise<boolean> {
    try {
      console.log(`🔑 Getting token with data for ${reqid}...`);
      console.log('📦 Token request data:', JSON.stringify(dataPayload, null, 2));
      
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
        if (this.token) {
          console.log('🔐 Token (first 20 chars):', this.token);
        }
        console.log('⏰ Reqtime:', this.reqtime);
        return true;
      } else {
        console.error('❌ Invalid token response:', response.data);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Failed to get token with data:', error.message || error);
      if (error.response) {
        console.error('📛 Response status:', error.response.status);
        console.error('📛 Response data:', error.response.data);
      }
      return false;
    }
  }
  /**
   * Make authenticated API call
   * @param endpoint - API endpoint path
   * @param reqid - Request ID
   * @param data - Request payload data
   * @param config - Additional axios config
   * @returns API response data
   */
  protected async makeAuthenticatedRequest(
    endpoint: string,
    reqid: string,
    data: any = {},
    config: any = {}
  ): Promise<any> {
    try {
      // Ensure we have a valid token
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        
        let tokenSuccess;
        if(data && Object.keys(data).length > 0){
          tokenSuccess = await this.getTokenData(reqid, data);
        }
        else{
          tokenSuccess = await this.getToken(reqid);
        }
        if (!tokenSuccess) {
          throw new Error('Failed to get authentication token');
        }
      }

      console.log(`📡 Calling API: ${endpoint}`);
      console.log(`URL: ${this.apiUrl}${endpoint}`);
      
      const requestPayload = {
        reqid: reqid,
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023',
          ...data
        }
      };

      const response = await this.axiosInstance.post(endpoint, requestPayload, {
        timeout: 30000, // 30 second timeout
        ...config
      });

      if (response.data) {
        console.log('✅ API call successful');
        console.log('📊 Response status:', response.status);
        
        // Check if response indicates invalid token
        if (response.data.error && 
            (response.data.error.toLowerCase().includes('invalid token') || 
             response.data.error.toLowerCase().includes('token expired'))) {
          console.log('⚠️ API returned invalid token error, refreshing...');
          this.token = null;
          this.reqtime = null;
          
          const tokenSuccess = data && Object.keys(data).length > 0 
            ? await this.getTokenData(reqid, data)
            : await this.getToken(reqid);
            
          if (tokenSuccess) {
            return await this.makeAuthenticatedRequest(endpoint, reqid, data, config);
          }
        }
        
        return response.data;
      } else {
        console.error('❌ Invalid response data');
        return null;
      }
    } catch (error: any) {
      console.error(`❌ API call failed for ${endpoint}:`, error.message);
      
      // Auto-retry on token expiration
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired (HTTP 401/403), retrying with new token...');
        this.token = null;
        this.reqtime = null;
        
        const tokenSuccess = data && Object.keys(data).length > 0
          ? await this.getTokenData(reqid, data)
          : await this.getToken(reqid);
          
        if (tokenSuccess) {
          // Retry the request once
          return await this.makeAuthenticatedRequest(endpoint, reqid, data, config);
        }
      }
      
      if (error.response) {
        console.error('📛 Response status:', error.response.status);
        console.error('📛 Response data:', error.response.data);
      }
      
      throw error;
    }
  }

  /**
   * Helper to extract value from API field format {v: value, r: value}
   * @param field - API field object or direct value
   * @returns Extracted value
   */
  protected getValue(field: any): any {
    if (!field) return '';
    if (typeof field === 'object' && !Array.isArray(field)) {
      return field.v !== undefined ? field.v : (field.r !== undefined ? field.r : '');
    }
    return field;
  }

  /**
   * Reset token - useful for testing or forced re-authentication
   */
  protected resetToken(): void {
    console.log('🔄 Resetting authentication token...');
    this.token = null;
    this.reqtime = null;
  }

  /**
   * Check if currently authenticated
   */
  protected isAuthenticated(): boolean {
    return !!(this.token && this.reqtime);
  }
}
