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

  async getToken(reqid, data) {
    try {
      console.log(`🔑 Getting token for ${JSON.stringify(data)}...`);
      const response = await axios.post(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
        reqid: reqid,
        data: data
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data && response.data.token && response.data.reqtime) {
        console.log('✅ Token retrieved successfully');
        console.log('🔐 Token (first 20 chars):', response.data.token.substring(0, 20) + '...');
        console.log('⏰ Reqtime:', response.data.reqtime);
        return {
          token: response.data.token,
          reqtime: response.data.reqtime
        };
      } else {
        console.error('❌ Invalid token response:', response.data);
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to get token:', error.message || error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return null;
    }
  }

  async getListReUseNow() {
    try {
      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenData = await this.getToken("GetListReUse_Now", {
          appversion: '2023'
        });
        if (!tokenData) {
          throw new Error('Failed to get token');
        }
        this.token = tokenData.token;
        this.reqtime = tokenData.reqtime;
      }

      console.log('📡 Calling API to get reuse container list...');
      console.log(`URL: ${this.apiUrl}/api/data/process/GetListReUse_Now`);
      console.log('payload', {
        reqid: "GetListReUse_Now",
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023'
        }
      });
      
      
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
        },
        timeout: 30000 // 30 second timeout
      });

      if (response.data && response.data.data) {
        console.log('✅ Reuse container list retrieved successfully');
        console.log('📊 Response status:', response.status);
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

      // Helper function to get value from API field
      const getValue = (field) => {
        if (!field) return '';
        if (typeof field === 'object') {
          return field.v !== undefined ? field.v : (field.r !== undefined ? field.r : '');
        }
        return field;
      };

      return {
        id: item.ID || '',
        containerId: getValue(item.ContID) || '',
        size: size,
        type: type,
        status: 'available', // Default status
        depotId: depotId, // Dùng ID từ API (15, 1, 3, etc.)
        depotName: getValue(item.Depot) || '',
        owner: getValue(item.HangTau) || 'N/A',
        condition: 'good', // Default condition
        lastInspection: new Date().toISOString().split('T')[0],
        inDate: new Date().toISOString().split('T')[0],
        estimatedOutDate: getValue(item.HanTraRong) || undefined,
        currentLocation: getValue(item.Depot) || '',
        // Store raw API data for gate-out - ensure all fields are properly extracted
        rawApiData: {
          HangTauID: getValue(item.HangTauID),
          ContTypeSizeID: getValue(item.ContTypeSizeID),
          DepotID: getValue(item.DepotID),
          ContID: getValue(item.ContID),
          ContainerSize: getValue(item.ContainerSize),
          ContainerType: getValue(item.ContainerType),
          HangTau: getValue(item.HangTau),
          Depot: getValue(item.Depot),
          // Keep full item for debugging
          _fullItem: item
        }
      };
    });
  }

  /**
   * Create Gate Out for Reuse container
   */
  async createGateOut(gateOutData) {
    console.log('\n========== CREATE GATE OUT ==========');
    console.log('📦 Input Data:', JSON.stringify(gateOutData, null, 2));
    
    try {
      // Validate input data
      const requiredFields = [
        'HangTauID', 'ContTypeSizeID', 'SoChungTuNhapBai',
        'DonViVanTaiID', 'SoXe', 'NguoiTao',
        'CongTyInHoaDon_PhiHaTang', 'CongTyInHoaDon',
        'DepotID', 'SoLuongCont', 'HangHoa'
      ];
      
      const missingFields = requiredFields.filter(field => {
        const value = gateOutData[field];
        return value === undefined || 
               value === null || 
               value === '' ||
               (typeof value === 'number' && isNaN(value));
      });
      
      if (missingFields.length > 0) {
        console.error('❌ Missing or invalid fields:', missingFields);
        console.error('📋 Provided data:', gateOutData);
        return {
          success: false,
          error: `Missing or invalid required fields: ${missingFields.join(', ')}`
        };
      }
      
      // Convert all numeric fields to integers with validation
      const numericFields = [
        'HangTauID', 'ContTypeSizeID', 'DonViVanTaiID', 'NguoiTao',
        'CongTyInHoaDon_PhiHaTang', 'CongTyInHoaDon', 'DepotID', 'SoLuongCont', 'HangHoa'
      ];
      
      const sanitizedData = {
        HangTauID: parseInt(gateOutData.HangTauID),
        ContTypeSizeID: parseInt(gateOutData.ContTypeSizeID),
        SoChungTuNhapBai: String(gateOutData.SoChungTuNhapBai),
        DonViVanTaiID: parseInt(gateOutData.DonViVanTaiID),
        SoXe: String(gateOutData.SoXe),
        NguoiTao: parseInt(gateOutData.NguoiTao),
        CongTyInHoaDon_PhiHaTang: parseInt(gateOutData.CongTyInHoaDon_PhiHaTang),
        CongTyInHoaDon: parseInt(gateOutData.CongTyInHoaDon),
        DepotID: parseInt(gateOutData.DepotID),
        SoLuongCont: parseInt(gateOutData.SoLuongCont),
        HangHoa: parseInt(gateOutData.HangHoa)
      };
      
      // Check for NaN values after parseInt
      const nanFields = numericFields.filter(field => isNaN(sanitizedData[field]));
      if (nanFields.length > 0) {
        console.error('❌ Invalid numeric values for fields:', nanFields);
        return {
          success: false,
          error: `Invalid numeric values for: ${nanFields.join(', ')}. Please ensure all numeric fields contain valid numbers.`
        };
      }
      
      console.log('✅ Sanitized Data:', JSON.stringify(sanitizedData, null, 2));
      
      // Get token specifically for Create_GateOut_Reuse
      console.log('\n🔑 Getting token with reqid: Create_GateOut_Reuse...');
      let tokenData = await this.getToken("Create_GateOut_Reuse", sanitizedData);
      
      // If that fails, try GetListReUse_Now as fallback
      // if (!tokenData || !tokenData.token) {
      //   console.log('⚠️ Create_GateOut_Reuse token failed, trying GetListReUse_Now fallback...');
      //   tokenData = await this.getToken("GetListReUse_Now");
      // }
      
      if (!tokenData || !tokenData.token) {
        console.error('❌ Failed to get token from both reqids');
        return {
          success: false,
          error: 'Failed to get authentication token'
        };
      }
      
      // Save token for reuse
      this.token = tokenData.token;
      this.reqtime = tokenData.reqtime;

      console.log('📡 Calling Create_GateOut_Reuse API...');
      
      // Prepare request payload matching the depot API pattern
      const requestPayload = {
        reqid: "Create_GateOut_Reuse",
        token: tokenData.token,
        reqtime: tokenData.reqtime,
        data: {
          ...sanitizedData,
          appversion: '2023'
        }
      };

      // {
      //   reqid: "GetListReUse_Now",
      //   token: this.token,
      //   reqtime: this.reqtime,
      //   data: {
      //     appversion: '2023'
      //   }
      // }
      
      try {
        console.log('📤 Request URL:', `${this.apiUrl}/api/data/process/Create_GateOut_Reuse`);
        console.log('📤 Request Payload (sanitized):', {
          reqid: requestPayload.reqid,
          token: this.token,
          tokenLength: tokenData.token.length,
          reqtime: tokenData.reqtime,
          dataFields: Object.keys(requestPayload.data),
          sampleData: {
            HangTauID: requestPayload.data.HangTauID,
            ContTypeSizeID: requestPayload.data.ContTypeSizeID,
            SoChungTuNhapBai: requestPayload.data.SoChungTuNhapBai,
            DepotID: requestPayload.data.DepotID
          }
        });

        console.log('requestPayload', requestPayload);
        
        
        const response = await axios.post(
          `${this.apiUrl}/api/data/process/Create_GateOut_Reuse`, 
          requestPayload, 
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
          }
        );

        console.log('📥 API Response Status:', response.status);
        console.log('📥 API Response Data:', JSON.stringify(response.data, null, 2));

        // Check response
        if (response.data) {
          // Check for explicit error in response
          if (response.data.result === 'Failed' || 
              (response.data.errorcode && response.data.errorcode !== '0' && response.data.errorcode !== 0)) {
            console.error('❌ API returned error');
            console.log('========== END CREATE GATE OUT ==========\n');
            return {
              success: false,
              error: response.data.msg || response.data.error || 'API returned error',
              errorCode: response.data.errorcode,
              apiResponse: response.data
            };
          }
          
          // Check for success indicators
          if (response.data.result === 'Success' || 
              response.data.success === true || 
              response.data.errorcode === '0' ||
              response.data.errorcode === 0) {
            console.log('✅ Gate out created successfully!');
            console.log('========== END CREATE GATE OUT ==========\n');
            return {
              success: true,
              data: response.data
            };
          }
          
          // If no clear success/error indicator, treat 200/201 as success
          if (response.status === 200 || response.status === 201) {
            console.log('✅ Response received with 200/201, treating as success');
            console.log('========== END CREATE GATE OUT ==========\n');
            return {
              success: true,
              data: response.data
            };
          }
        }
        
        // Unexpected response format
        console.warn('⚠️ Unexpected response format');
        console.log('========== END CREATE GATE OUT ==========\n');
        return {
          success: false,
          error: `Unexpected response format`,
          apiResponse: response.data
        };
        
      } catch (error) {
        console.error('❌ Error calling API:', error.message);
        
        if (error.response) {
          console.error('📛 Response status:', error.response.status);
          console.error('📛 Response data:', JSON.stringify(error.response.data, null, 2));
          
          console.log('========== END CREATE GATE OUT ==========\n');
          return {
            success: false,
            error: error.response.data?.msg || error.response.data?.error || error.message,
            errorCode: error.response.data?.errorcode,
            statusCode: error.response.status,
            apiResponse: error.response.data
          };
        }
        
        console.log('========== END CREATE GATE OUT ==========\n');
        return {
          success: false,
          error: error.message || 'Network error calling API'
        };
      }
      
    } catch (error) {
      console.error('❌ Unexpected error in createGateOut:', error);
      console.log('========== END CREATE GATE OUT ==========\n');
      return {
        success: false,
        error: error.message || 'Unexpected error creating gate out'
      };
    }
  }
}

module.exports = { ContainerApiService };
