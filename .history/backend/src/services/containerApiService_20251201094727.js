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
    if (this.depotIdMap) {
      return this.depotIdMap; // Return cached mapping
    }

    try {
      console.log('🔄 Fetching depot ID mapping from API...');
      
      // Get depot data from depot API
      const { default: depotApiService } = await import('./depotApiService.js');
      const depotService = new depotApiService();
      
      const rawDepotData = await depotService.getDepotData();
      
      if (!rawDepotData || !rawDepotData.data) {
        console.warn('⚠️ No depot data available for mapping');
        return {};
      }

      // Build mapping: API depot ID -> Frontend depot ID
      const mapping = {};
      rawDepotData.data.forEach(depot => {
        const apiId = depot.ID;
        const seq = depot.SEQ?.v || depot.SEQ?.r;
        if (apiId && seq) {
          mapping[apiId] = `DEPOT${seq}`;
        }
      });

      console.log('✅ Depot ID mapping loaded:', Object.keys(mapping).length, 'depots');
      this.depotIdMap = mapping;
      return mapping;
      
    } catch (error) {
      console.error('❌ Failed to load depot mapping:', error.message);
      return {};
    }
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

      // Get depot ID from API
      const apiDepotId = item.DepotID?.v || '';
      
      // Map to frontend depot ID format
      // API depot ID 15 = Frontend DEPOT5 (based on SEQ field)
      // This mapping needs to match depotApiService.ts logic: `DEPOT${SEQ}`
      const depotIdMap = {
        '15': 'DEPOT5',  // TestDepot - SEQ = 5
        '1': 'DEPOT2',   // E-Depots Tiên Sa 1
        '3': 'DEPOT3',   // BNP Sóng Thần
        '4': 'DEPOT4',   // TRAPANG KRASANG
        '18': 'DEPOT6',  // Tây Nam Bình Dương
        '27': 'DEPOT7',  // E-Depots PTSC
        // Add more mappings as needed
      };
      
      const frontendDepotId = depotIdMap[apiDepotId] || apiDepotId;

      return {
        id: item.ID || '',
        containerId: item.ContID?.v || item.ContID?.r || '',
        size: size,
        type: type,
        status: 'available', // Default status
        depotId: frontendDepotId, // Use mapped depot ID
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
