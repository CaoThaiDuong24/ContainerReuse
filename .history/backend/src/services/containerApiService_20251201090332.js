const axios = require('axios');

class ContainerApiService {
  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
    this.token = null;
    this.reqtime = null;
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
        const containers = this.transformContainerData(response.data.data);
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
  transformContainerData(apiData) {
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

      return {
        id: item.ID || '',
        containerId: item.ContID?.v || item.ContID?.r || '',
        size: size,
        type: type,
        status: 'available', // Default status
        depotId: item.DepotID?.v || '',
        depotName: item.Depot?.v || item.Depot?.r || '',
        owner: item.HangTau?.v || item.HangTau?.r || 'N/A',
        condition: 'good', // Default condition
        lastInspection: new Date().toISOString().split('T')[0],
        inDate: new Date().toISOString().split('T')[0],
        estimatedOutDate: item.HanTraRong?.v || undefined,
        currentLocation: item.Depot?.v || ''
      };
    });
  }
}

module.exports = { ContainerApiService };
