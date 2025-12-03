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
      
      const missingFields = requiredFields.filter(field => 
        gateOutData[field] === undefined || gateOutData[field] === null || gateOutData[field] === ''
      );
      
      if (missingFields.length > 0) {
        console.error('❌ Missing fields:', missingFields);
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        };
      }
      
      // Convert all numeric fields to integers
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
      
      console.log('✅ Sanitized Data:', JSON.stringify(sanitizedData, null, 2));
      
      // Try with different reqid values for token
      const reqidOptions = [
        "Create_GateOut_Reuse",
        "GetListReUse_Now",
        "iContainerHub_Depot"
      ];
      
      let lastError = null;
      
      for (const reqid of reqidOptions) {
        try {
          console.log(`\n🔑 Attempt with reqid: ${reqid}`);
          
          // Get fresh token
          const tokenData = await this.getToken(reqid);
          if (!tokenData) {
            console.warn(`⚠️ Failed to get token with reqid: ${reqid}`);
            continue;
          }

          console.log('📡 Calling Create_GateOut_Reuse API...');
          
          const requestPayload = {
            reqid: "Create_GateOut_Reuse",
            token: tokenData.token,
            reqtime: tokenData.reqtime,
            data: sanitizedData
          };
          
          console.log('📤 Request URL:', `${this.apiUrl}/api/data/process/Create_GateOut_Reuse`);
          console.log('📤 Request Payload (partial):', {
            reqid: requestPayload.reqid,
            tokenLength: requestPayload.token.length,
            reqtime: requestPayload.reqtime,
            dataKeys: Object.keys(requestPayload.data)
          });
          
          const response = await axios.post(
            `${this.apiUrl}/api/data/process/Create_GateOut_Reuse`, 
            requestPayload, 
            {
              headers: {
                'Content-Type': 'application/json'
              },
              timeout: 30000, // 30 second timeout
              validateStatus: (status) => status < 500 // Don't throw on 4xx errors
            }
          );

          console.log('📥 API Response Status:', response.status);
          console.log('📥 API Response Data:', JSON.stringify(response.data, null, 2));

          // Handle different response formats
          if (response.status === 200 || response.status === 201) {
            if (response.data) {
              // Check for explicit error in response
              if (response.data.errorcode && response.data.errorcode !== '0' && response.data.errorcode !== 0) {
                console.warn(`⚠️ API returned error code: ${response.data.errorcode}`);
                lastError = {
                  success: false,
                  error: response.data.msg || response.data.error || 'API returned error',
                  errorCode: response.data.errorcode,
                  apiResponse: response.data,
                  attemptedReqid: reqid
                };
                continue; // Try next reqid
              }
              
              // Check for success indicators
              if (response.data.result === 'Success' || 
                  response.data.success === true || 
                  response.data.errorcode === '0' ||
                  response.data.errorcode === 0) {
                console.log('✅ Gate out created successfully!');
                return {
                  success: true,
                  data: response.data
                };
              }
              
              // If no clear error, treat as success
              console.log('✅ Response received, treating as success');
              return {
                success: true,
                data: response.data
              };
            }
          }
          
          // If we get here, response wasn't successful
          lastError = {
            success: false,
            error: `Unexpected response status: ${response.status}`,
            statusCode: response.status,
            apiResponse: response.data,
            attemptedReqid: reqid
          };
          
        } catch (error) {
          console.error(`❌ Error with reqid ${reqid}:`, error.message);
          
          if (error.response) {
            console.error('📛 Response status:', error.response.status);
            console.error('📛 Response data:', JSON.stringify(error.response.data, null, 2));
          }
          
          lastError = {
            success: false,
            error: error.response?.data?.msg || error.response?.data?.error || error.message,
            errorCode: error.response?.data?.errorcode,
            statusCode: error.response?.status,
            apiResponse: error.response?.data,
            attemptedReqid: reqid
          };
          
          // If not auth error, don't try other reqids
          if (error.response?.status !== 400 && error.response?.status !== 401 && error.response?.status !== 403) {
            break;
          }
        }
      }
      
      // All attempts failed
      console.error('❌ All authentication attempts failed');
      console.log('========== END CREATE GATE OUT ==========\n');
      return lastError || {
        success: false,
        error: 'Failed to create gate out after trying all authentication methods'
      };
      
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
