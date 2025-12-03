import axios from 'axios';

class DepotApiService {
  private apiUrl: string;
  private token: string | null = null;
  private reqtime: string | null = null;

  constructor() {
    // URL API thực
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
        reqid: "iContainerHub_Depot",
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
   * Transform dữ liệu từ API thực thành format chuẩn
   * API trả về data với cấu trúc: { v: "value", r: "value" }
   */
  transformDepotData(apiData: any): any[] {
    try {
      if (!apiData || !apiData.data) {
        console.log('⚠️ No data field in API response');
        return [];
      }

      const depots = apiData.data;
      
      if (!Array.isArray(depots)) {
        console.log('⚠️ Data is not an array');
        return [];
      }

      // Helper function để lấy giá trị từ object {v: "", r: ""}
      const getValue = (field: any) => {
        if (!field) return '';
        return field.v || field.r || '';
      };

      // Map city code to name
      const getCityName = (code: string): string => {
        const cities: any = {
          '51': 'TP. Hồ Chí Minh',
          '59': 'Đà Nẵng',
          '36': 'Bà Rịa - Vũng Tàu',
          '24': 'Bình Dương',
          '39': 'Đồng Nai',
          '41': 'Hải Phòng',
          '80': 'Long An',
          '56': 'Khánh Hòa',
          '74': 'Tây Ninh',
          '82': 'Tiền Giang'
        };
        return cities[code] || 'Khác';
      };

      // Transform sang format chuẩn
      return depots.map((depot: any) => {
        // ID field là string trực tiếp, không có cấu trúc {v, r}
        const depotId = depot.ID;
        
        const name = getValue(depot.TenDepot) || getValue(depot.TenVietTat) || 'Unknown Depot';
        const shortName = getValue(depot.TenVietTat);
        const address = getValue(depot.DiaChi);
        const maxStock = parseInt(getValue(depot.Maxstock)) || 0;
        const isActive = getValue(depot.Active) === 'True';
        
        return {
          id: depotId, // ID thật: "0", "1", "3", "4", "15"...
          name: name,
          location: shortName || name,
          address: address,
          image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80',
          containerCount: 0, // API không trả về số container hiện tại
          capacity: maxStock,
          status: isActive ? 'active' : 'inactive',
          province: getCityName(getValue(depot.ThanhPho))
        };
      }).filter(depot => depot.status === 'active'); // Chỉ lấy depot đang hoạt động
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
