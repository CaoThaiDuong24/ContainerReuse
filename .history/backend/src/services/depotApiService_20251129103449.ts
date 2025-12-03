import axios from 'axios';

interface TokenResponse {
  token: string;
  reqtime: string;
}

interface DepotApiResponse {
  data?: any;
  error?: string;
}

class DepotApiService {
  private apiUrl: string;
  private token: string | null = null;
  private reqtime: string | null = null;

  constructor() {
    // URL API thực - có thể cấu hình trong .env
    this.apiUrl = process.env.EXTERNAL_API_URL || 'https://your-api-url.com';
  }

  /**
   * Lấy token từ API
   */
  async getToken(): Promise<boolean> {
    try {
      console.log('🔑 Getting token from API...');
      
      const response = await axios.get(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          reqid: "Get_GateOut_CMA_RELEASE",
          data: {
            appversion: '2023'
          }
        }
      });

      if (response.data && response.data.token && response.data.reqtime) {
        this.token = response.data.token;
        this.reqtime = response.data.reqtime;
        console.log('✅ Token retrieved successfully');
        return true;
      } else {
        console.error('❌ Invalid token response');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to get token:', error);
      return false;
    }
  }

  /**
   * Lấy dữ liệu depot từ API thực
   */
  async getDepotData(): Promise<any> {
    try {
      // Kiểm tra token, nếu chưa có thì lấy mới
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenSuccess = await this.getToken();
        if (!tokenSuccess) {
          throw new Error('Failed to get token');
        }
      }

      console.log('📡 Calling API to get depot data...');
      console.log(`URL: ${this.apiUrl}/api/data/process/iContainerHub_Depot`);
      
      const response = await axios.get(`${this.apiUrl}/api/data/process/iContainerHub_Depot`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          token: this.token,
          reqtime: this.reqtime,
          data: {
            appversion: '2023'
          }
        }
      });

      if (response.data) {
        console.log('✅ Depot data retrieved successfully');
        console.log('📊 Data structure:', Object.keys(response.data));
        return response.data;
      } else {
        console.error('❌ Invalid data response');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Failed to get depot data:', error.message);
      
      // Nếu lỗi 401/403, thử lấy token mới
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken();
        if (tokenSuccess) {
          return await this.getDepotData();
        }
      }
      
      return null;
    }
  }

  /**
   * Transform dữ liệu từ API thành format chuẩn
   */
  transformDepotData(apiData: any): any[] {
    try {
      // Kiểm tra cấu trúc dữ liệu từ API
      // Tùy thuộc vào cấu trúc response thực tế, cần điều chỉnh
      if (!apiData) {
        return [];
      }

      // Giả sử API trả về array hoặc object chứa array
      let depots = Array.isArray(apiData) ? apiData : apiData.depots || apiData.data || [];

      // Transform sang format chuẩn
      return depots.map((depot: any, index: number) => ({
        id: depot.id || depot.depotId || `DEPOT${String(index + 1).padStart(3, '0')}`,
        name: depot.name || depot.depotName || 'Unknown Depot',
        location: depot.location || depot.city || '',
        address: depot.address || depot.fullAddress || '',
        image: depot.image || depot.imageUrl || 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80',
        containerCount: depot.containerCount || depot.containers || 0,
        capacity: depot.capacity || depot.maxCapacity || 0,
        status: depot.status || 'active',
        province: depot.province || depot.region || depot.location || ''
      }));
    } catch (error) {
      console.error('❌ Error transforming depot data:', error);
      return [];
    }
  }

  /**
   * Lấy và transform dữ liệu depot
   */
  async fetchDepots(): Promise<any[]> {
    try {
      const rawData = await this.getDepotData();
      if (!rawData) {
        console.log('⚠️ No data received from API');
        return [];
      }

      const transformedData = this.transformDepotData(rawData);
      console.log(`✅ Transformed ${transformedData.length} depots`);
      
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching depots:', error);
      return [];
    }
  }

  /**
   * Lấy thống kê từ dữ liệu depot
   */
  async getStatistics(): Promise<any> {
    try {
      const depots = await this.fetchDepots();
      
      const totalCapacity = depots.reduce((sum, depot) => sum + (depot.capacity || 0), 0);
      const totalContainers = depots.reduce((sum, depot) => sum + (depot.containerCount || 0), 0);
      const activeDepots = depots.filter(depot => depot.status === 'active').length;
      const utilizationRate = totalCapacity > 0 ? Math.round((totalContainers / totalCapacity) * 100) : 0;

      return {
        totalCapacity,
        totalContainers,
        activeDepots,
        utilizationRate,
        totalDepots: depots.length,
        availableSpace: totalCapacity - totalContainers
      };
    } catch (error) {
      console.error('❌ Error getting statistics:', error);
      return {
        totalCapacity: 0,
        totalContainers: 0,
        activeDepots: 0,
        utilizationRate: 0,
        totalDepots: 0,
        availableSpace: 0
      };
    }
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   */
  async getProvinces(): Promise<string[]> {
    try {
      const depots = await this.fetchDepots();
      const provinces = Array.from(new Set(depots.map(depot => depot.province).filter(p => p)));
      return provinces;
    } catch (error) {
      console.error('❌ Error getting provinces:', error);
      return [];
    }
  }
}

// Singleton instance
const depotApiService = new DepotApiService();

export default depotApiService;
