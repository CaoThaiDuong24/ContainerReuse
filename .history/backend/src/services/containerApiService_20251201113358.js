const axios = require('axios');

class ContainerApiService {
  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
    this.username = process.env.API_USERNAME || '';
    this.password = process.env.API_PASSWORD || '';
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

  /**
   * Get token with AID (username/password) for authenticated endpoints
   */
  async getTokenWithAuth(reqid = "Create_GateOut_Reuse") {
    try {
      if (!this.username || !this.password) {
        console.warn('⚠️ API_USERNAME or API_PASSWORD not configured in .env');
        return null;
      }

      console.log(`🔑 Getting authenticated token for ${reqid} with username: ${this.username}...`);
      const response = await axios.post(`${this.apiUrl}/api/data/util/gettoken`, {
        reqid: reqid,
        aid: this.username,
        pwd: this.password,
        data: {
          appversion: '2023'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.token && response.data.reqtime) {
        console.log('✅ Authenticated token retrieved successfully');
        return {
          token: response.data.token,
          reqtime: response.data.reqtime
        };
      } else {
        console.error('❌ Invalid authenticated token response');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to get authenticated token:', error.response?.data || error.message);
      return null;
    }
  }

  async getToken(reqid = "GetListReUse_Now") {
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
        }
      });

      if (response.data && response.data.token && response.data.reqtime) {
        console.log('✅ Token retrieved successfully');
        return {
          token: response.data.token,
          reqtime: response.data.reqtime
        };
      } else {
        console.error('❌ Invalid token response');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to get token:', error.message || error);
      return null;
    }
  }

  async getListReUseNow() {
    try {
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenData = await this.getToken("GetListReUse_Now");
        if (!tokenData) {
          throw new Error('Failed to get token');
        }
        this.token = tokenData.token;
        this.reqtime = tokenData.reqtime;
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
        
        // Log depot ID distribution
        const depotIdCounts = {};
        containers.forEach(c => {
          depotIdCounts[c.depotId] = (depotIdCounts[c.depotId] || 0) + 1;
        });
        console.log('📍 Containers by Depot ID:', depotIdCounts);
        
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
        const tokenData = await this.getToken("GetListReUse_Now");
        if (tokenData) {
          this.token = tokenData.token;
          this.reqtime = tokenData.reqtime;
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
      // Get fresh token specifically for Create_GateOut_Reuse
      console.log('🔑 Getting token for Create_GateOut_Reuse...');
      const tokenData = await this.getToken("Create_GateOut_Reuse");
      if (!tokenData) {
        throw new Error('Failed to get token for gate out');
      }

      console.log('📡 Calling Create_GateOut_Reuse API...');
      console.log('🔐 Token:', tokenData.token.substring(0, 10) + '...');
      console.log('⏰ Reqtime:', tokenData.reqtime);
      console.log('📦 Data:', JSON.stringify(gateOutData, null, 2));
      
      const requestPayload = {
        reqid: "Create_GateOut_Reuse",
        token: tokenData.token,
        reqtime: tokenData.reqtime,
        data: gateOutData
      };
      
      console.log('📤 Full request payload:', JSON.stringify(requestPayload, null, 2));
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/Create_GateOut_Reuse`, requestPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 API Response Status:', response.status);
      console.log('📥 API Response Data:', JSON.stringify(response.data, null, 2));

      // Check response for success
      if (response.data) {
        // API may return different success formats
        if (response.data.result === 'Success' || response.data.success === true || !response.data.error) {
          console.log('✅ Gate out created successfully');
          return {
            success: true,
            data: response.data
          };
        } else if (response.data.error || response.data.result === 'Failed') {
          console.error('❌ API returned error:', response.data.error || response.data.msg);
          return {
            success: false,
            error: response.data.error || response.data.msg || 'API returned failed status',
            errorCode: response.data.errorcode,
            apiResponse: response.data
          };
        } else {
          // Unknown response format, treat as success
          console.log('⚠️ Unknown response format, treating as success');
          return {
            success: true,
            data: response.data
          };
        }
      } else {
        console.error('❌ Invalid response from API');
        return {
          success: false,
          error: 'Invalid response from API'
        };
      }
    } catch (error) {
      console.error('❌ Failed to create gate out:', error.message || error);
      
      // Log full error details
      if (error.response) {
        console.error('📛 Response status:', error.response.status);
        console.error('📛 Response data:', JSON.stringify(error.response.data, null, 2));
        console.error('📛 Response headers:', error.response.headers);
      }
      
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.msg || error.message || 'Failed to create gate out',
        errorCode: error.response?.data?.errorcode,
        statusCode: error.response?.status,
        apiResponse: error.response?.data
      };
    }
  }
}

module.exports = { ContainerApiService };
