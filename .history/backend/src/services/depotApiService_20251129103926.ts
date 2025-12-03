import axios from 'axios';

class DepotApiService {
  private apiUrl: string;
  private token: string | null = null;
  private reqtime: string | null = null;

  constructor() {
    // URL API thực - có thể cấu hình trong .env
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
  }

  /**
   * Lấy token từ API
   */
  async getToken(): Promise<boolean> {
    try {
      console.log('🔑 Getting token from API...');
      
      const response = await axios.post(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
        reqid: "iContainerHub_Depot",
        data: {
          appversion: '2023'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
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
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/iContainerHub_Depot`, {
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
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
      if (!apiData || !apiData.data) {
        return [];
      }

      const depots = apiData.data;

      // Transform sang format chuẩn
      return depots.map((depot: any, index: number) => {
        const id = depot.ID || `DEPOT${String(index + 1).padStart(3, '0')}`;
        const name = depot.TenDepot?.v || depot.TenVietTat?.v || 'Unknown Depot';
        const location = depot.TenVietTat?.v || '';
        const address = depot.DiaChi?.v || '';
        const active = depot.Active?.v === 'True' || depot.Active_eDepot?.v === 'True';
        
        // Lấy số từ Maxstock hoặc mặc định
        const capacity = parseInt(depot.Maxstock?.v || depot.DienTich?.v || '500') || 500;
        const containerCount = Math.floor(capacity * (0.3 + Math.random() * 0.5)); // Random 30-80%

        return {
          id: `DEPOT${String(id).padStart(3, '0')}`,
          name: name,
          location: location,
          address: address,
          image: `https://images.unsplash.com/photo-${1566576721346 + index}?w=800&q=80`,
          containerCount: containerCount,
          capacity: capacity,
          status: active ? 'active' : 'inactive',
          province: this.getProvinceName(depot.ThanhPho?.v || '51')
        };
      });
    } catch (error) {
      console.error('❌ Error transforming depot data:', error);
      return [];
    }
  }

  /**
   * Chuyển mã thành phố thành tên tỉnh
   */
  private getProvinceName(cityCode: string): string {
    const cityMap: Record<string, string> = {
      '51': 'TP. Hồ Chí Minh',
      '59': 'Đà Nẵng',
      '1': 'Hà Nội',
      '77': 'Bà Rịa - Vũng Tàu',
      '74': 'Bình Dương',
      '75': 'Đồng Nai',
      '80': 'Long An',
      '56': 'Khánh Hòa',
      '31': 'Hải Phòng',
      '82': 'Tiền Giang'
    };
    return cityMap[cityCode] || 'TP. Hồ Chí Minh';
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
