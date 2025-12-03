import axios from 'axios';

interface LocationData {
  code: string;
  name: string;
}

class LocationApiService {
  private apiUrl: string;
  private token: string | null = null;
  private reqtime: string | null = null;
  private locationCache: LocationData[] | null = null;
  private locationMap: Map<string, string> = new Map();

  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
  }

  /**
   * Get token from API
   */
  async getToken(reqid: string = "GetList_tbLocation"): Promise<boolean> {
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
        console.log('✅ Token retrieved successfully for GetList_tbLocation');
        return true;
      } else {
        console.error('❌ Invalid token response:', response.data);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Failed to get token:', error.message || error);
      return false;
    }
  }

  /**
   * Fetch location data from GetList_tbLocation API
   */
  async getLocationData(): Promise<any> {
    try {
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenSuccess = await this.getToken();
        if (!tokenSuccess) {
          throw new Error('Failed to get token');
        }
      }

      console.log('📡 Calling GetList_tbLocation API...');
      console.log(`URL: ${this.apiUrl}/api/data/process/GetList_tbLocation`);
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/GetList_tbLocation`, {
        reqid: "GetList_tbLocation",
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
        console.log('✅ Location data retrieved successfully');
        return response.data;
      } else {
        console.error('❌ Invalid data response');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Failed to get location data:', error.message);
      
      // Retry with new token if unauthorized
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken();
        if (tokenSuccess) {
          return await this.getLocationData();
        }
      }
      
      return null;
    }
  }

  /**
   * Transform location data from API to standard format
   */
  transformLocationData(apiData: any): LocationData[] {
    try {
      if (!apiData || !apiData.data) {
        console.log('⚠️ No data field in API response');
        return [];
      }

      const locations = apiData.data;
      
      if (!Array.isArray(locations)) {
        console.log('⚠️ Data is not an array');
        return [];
      }

      // Helper function to get value from {v: "", r: ""} structure
      const getValue = (field: any) => {
        if (!field) return '';
        return field.v || field.r || '';
      };

      const transformedLocations = locations.map((location: any) => {
        const code = getValue(location.ID) || location.ID;
        const name = getValue(location.TenThanhPho);
        
        return {
          code: String(code),
          name: name || 'Khác'
        };
      }).filter((loc: LocationData) => loc.code && loc.name);

      console.log(`✅ Transformed ${transformedLocations.length} locations`);
      return transformedLocations;
    } catch (error) {
      console.error('❌ Error transforming location data:', error);
      return [];
    }
  }

  /**
   * Fetch and cache locations
   */
  async fetchLocations(): Promise<LocationData[]> {
    try {
      // Return cached data if available
      if (this.locationCache) {
        console.log('✅ Returning cached location data');
        return this.locationCache;
      }

      const rawData = await this.getLocationData();
      if (!rawData) {
        console.log('⚠️ No data received from API');
        return [];
      }

      const transformedData = this.transformLocationData(rawData);
      
      // Cache the data
      this.locationCache = transformedData;
      
      // Build location map for quick lookup
      this.locationMap.clear();
      transformedData.forEach(location => {
        this.locationMap.set(location.code, location.name);
      });
      
      console.log(`✅ Cached ${transformedData.length} locations`);
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching locations:', error);
      return [];
    }
  }

  /**
   * Get location name by code
   */
  async getLocationName(code: string): Promise<string> {
    try {
      // Ensure locations are loaded
      if (!this.locationCache) {
        await this.fetchLocations();
      }

      // Return from map or default to 'Khác'
      return this.locationMap.get(String(code)) || 'Khác';
    } catch (error) {
      console.error('❌ Error getting location name:', error);
      return 'Khác';
    }
  }

  /**
   * Clear cache (useful for refreshing data)
   */
  clearCache(): void {
    this.locationCache = null;
    this.locationMap.clear();
    console.log('🗑️ Location cache cleared');
  }
}

// Singleton instance
const locationApiService = new LocationApiService();

export default locationApiService;
