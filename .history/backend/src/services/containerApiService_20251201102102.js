const axios = require('axios');

class ContainerApiService {
  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
    this.token = null;
    this.reqtime = null;
    this.depotIdMap = null; // Cache for depot ID mapping
  }

  /**
   * Get depot ID mapping from depot API
   * Maps API depot ID to frontend depot ID (DEPOT{SEQ})
   */
  async getDepotIdMapping() {
    // Không cần mapping nữa vì giờ cả depot và container đều dùng ID từ API
    // Trả về empty object để transformContainerData không bị lỗi
    return {};
  }

  async getToken() {
    try {
      console.log('🔑 Getting token for GetListReUse_Now...');
      const response = await axios.post(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
        reqid: "GetListReUse_Now",
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
      console.error('❌ Failed to get token:', error.message || error);
      return false;
    }
  }

  async getListReUseNow() {
    try {
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenSuccess = await this.getToken();
        if (!tokenSuccess) {
          throw new Error('Failed to get token');
        }
      }

      console.log('📡 Calling API to get reuse container list...');
      console.log(`URL: ${this.apiUrl}/api/data/process/GetListReUse_Now`);
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/GetListReUse_Now`, {
        reqid: "GetListReUse_Now",
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

      if (response.data && response.data.data) {
        console.log('✅ Reuse container list retrieved successfully');
        console.log('📊 Containers count:', response.data.data.length);
        
        // Transform API data to match frontend Container interface
        const containers = await this.transformContainerData(response.data.data);
        return containers;
      } else {
        console.error('❌ Invalid data response');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to get reuse container list:', error.message || error);
      // Nếu lỗi 401/403, thử lấy token mới
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken();
        if (tokenSuccess) {
          return await this.getListReUseNow();
        }
      }
      return null;
    }
  }

  /**
   * Transform API data to frontend Container format
   */
  async transformContainerData(apiData) {
    if (!Array.isArray(apiData)) {
      console.warn('⚠️ API data is not an array');
      return [];
    }

    return apiData.map(item => {
      // Parse container size (20', 40', 45')
      const sizeMap = {
        "20'": '20ft',
        "40'": '40ft',
        "45'": '45ft'
      };
      const size = sizeMap[item.ContainerSize?.v] || '40ft';

      // Parse container type
      const typeMap = {
        'GP': 'dry',
        'HC': 'dry',
        'RF': 'reefer',
        'OT': 'opentop',
        'FR': 'flatrack',
        'TK': 'tank'
      };
      const type = typeMap[item.ContainerType?.v] || 'dry';

      // Get depot ID from API - use directly without mapping
      const depotId = item.DepotID?.v || item.DepotID?.r || '';

      return {
        id: item.ID || '',
        containerId: item.ContID?.v || item.ContID?.r || '',
        size: size,
        type: type,
        status: 'available', // Default status
        depotId: depotId, // Dùng ID từ API (15, 1, 3, etc.)
        depotName: item.Depot?.v || item.Depot?.r || '',
        owner: item.HangTau?.v || item.HangTau?.r || 'N/A',
        condition: 'good', // Default condition
        lastInspection: new Date().toISOString().split('T')[0],
        inDate: new Date().toISOString().split('T')[0],
        estimatedOutDate: item.HanTraRong?.v || undefined,
        currentLocation: item.Depot?.v || '',
        // Store raw API data for gate-out
        rawApiData: {
          HangTauID: item.HangTauID?.v || item.HangTauID?.r || '',
          ContTypeSizeID: item.ContTypeSizeID?.v || item.ContTypeSizeID?.r || '',
          DepotID: item.DepotID?.v || item.DepotID?.r || '',
        }
      };
    });
  }

  /**
   * Create Gate Out for Reuse container
   */
  async createGateOut(gateOutData) {
    try {
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenSuccess = await this.getToken();
        if (!tokenSuccess) {
          throw new Error('Failed to get token');
        }
      }

      console.log('📡 Calling Create_GateOut_Reuse API...');
      console.log('Data:', JSON.stringify(gateOutData, null, 2));
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/Create_GateOut_Reuse`, {
        reqid: "Create_GateOut_Reuse",
        token: this.token,
        reqtime: this.reqtime,
        data: gateOutData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        console.log('✅ Gate out created successfully');
        console.log('Response:', response.data);
        return {
          success: true,
          data: response.data
        };
      } else {
        console.error('❌ Invalid response from API');
        return {
          success: false,
          error: 'Invalid response from API'
        };
      }
    } catch (error) {
      console.error('❌ Failed to create gate out:', error.message || error);
      
      // Nếu lỗi 401/403, thử lấy token mới
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenSuccess = await this.getToken();
        if (tokenSuccess) {
          return await this.createGateOut(gateOutData);
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create gate out'
      };
    }
  }
}

module.exports = { ContainerApiService };
