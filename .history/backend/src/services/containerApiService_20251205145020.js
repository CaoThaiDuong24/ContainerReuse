const axios = require('axios');

class ContainerApiService {
  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
    this.token = null;
    this.reqtime = null;
    this.depotIdMap = null; // Cache for depot ID mapping
    this.cache = {}; // Cache for API responses
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
        data: data,
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

  /**
   * Get list of reuse containers grouped by type
   * Uses GetListReUse_Group_Now API endpoint
   */
  async getListReUseGroupNow() {
    try {
      // Cache data for 2 minutes to reduce API calls
      const cacheKey = 'reuse_group_now';
      const cacheExpiry = 2 * 60 * 1000; // 2 minutes
      
      if (this.cache[cacheKey] && (Date.now() - this.cache[cacheKey].timestamp < cacheExpiry)) {
        console.log('✨ Returning cached reuse container list (grouped)');
        return this.cache[cacheKey].data;
      }

      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenData = await this.getToken("GetListReUse_Group_Now", {
          appversion: '2023'
        });
        if (!tokenData) {
          throw new Error('Failed to get token');
        }
        this.token = tokenData.token;
        this.reqtime = tokenData.reqtime;
      }

      console.log('📡 Calling API to get reuse container list (grouped)...');
      console.log(`URL: ${this.apiUrl}/api/data/process/GetListReUse_Group_Now`);
      console.log('payload', {
        reqid: "GetListReUse_Group_Now",
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023'
        }
      });
      
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/GetListReUse_Group_Now`, {
        reqid: "GetListReUse_Group_Now",
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023'
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout (increased from 30s)
      });

      if (response.data && response.data.data) {
        console.log('✅ Reuse container list (grouped) retrieved successfully');
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
      console.error('❌ Failed to get reuse container list (grouped):', error.message || error);
      // Nếu lỗi 401/403, thử lấy token mới
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenData = await this.getToken("GetListReUse_Group_Now", {
          appversion: '2023'
        });
        if (tokenData) {
          this.token = tokenData.token;
          this.reqtime = tokenData.reqtime;
          return await this.getListReUseGroupNow();
        }
      }
      return null;
    }
  }

  async getListReUseNow() {
    try {
      // Cache data for 2 minutes to reduce API calls
      const cacheKey = 'reuse_now';
      const cacheExpiry = 2 * 60 * 1000; // 2 minutes
      
      if (this.cache[cacheKey] && (Date.now() - this.cache[cacheKey].timestamp < cacheExpiry)) {
        console.log('✨ Returning cached reuse container list');
        return this.cache[cacheKey].data;
      }

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
        timeout: 60000 // 60 second timeout (increased from 30s)
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
        
        // Cache the result for getListReUseNow
        this.cache[cacheKey] = {
          data: containers,
          timestamp: Date.now()
        };
        
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
   * Get list of registered containers (orders that have been gate-out)
   * Uses GetList_DonHang_ReUse_Out_Now API endpoint
   */
  async getListDonHangReUseOutNow(userId = null) {
    try {
      // Cache data for 1 minute to reduce API calls
      const cacheKey = `donhang_out_now_${userId || 'all'}`;
      const cacheExpiry = 1 * 60 * 1000; // 1 minute
      
      if (this.cache[cacheKey] && (Date.now() - this.cache[cacheKey].timestamp < cacheExpiry)) {
        console.log('✨ Returning cached registered container list');
        return this.cache[cacheKey].data;
      }

      if (!this.token || !this.reqtime) {
        console.log('⚠️ Token not available, getting new token...');
        const tokenData = await this.getToken("GetList_DonHang_ReUse_Out_Now", {
          appversion: '2023'
        });
        if (!tokenData) {
          throw new Error('Failed to get token');
        }
        this.token = tokenData.token;
        this.reqtime = tokenData.reqtime;
      }

      console.log('📡 Calling API to get registered container list (DonHang Out Now)...');
      console.log(`URL: ${this.apiUrl}/api/data/process/GetList_DonHang_ReUse_Out_Now`);
      
      const requestData = {
        appversion: '2023'
      };
      
      // Note: API returns all containers, filter by userId on backend if needed
      console.log('payload', {
        reqid: "GetList_DonHang_ReUse_Out_Now",
        token: this.token,
        reqtime: this.reqtime,
        data: requestData
      });
      
      const response = await axios.post(`${this.apiUrl}/api/data/process/GetList_DonHang_ReUse_Out_Now`, {
        reqid: "GetList_DonHang_ReUse_Out_Now",
        token: this.token,
        reqtime: this.reqtime,
        data: requestData
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      });

      if (response.data && response.data.data) {
        console.log('✅ Registered container list retrieved successfully');
        console.log('📊 Response status:', response.status);
        console.log('📊 Total registered containers count:', response.data.data.length);
        
        // Transform API data to match frontend format
        let containers = await this.transformRegisteredContainerData(response.data.data);
        
        // Filter by userId if provided
        if (userId) {
          containers = containers.filter(c => c.userId && c.userId.toString() === userId.toString());
          console.log('📊 Filtered containers for user', userId, ':', containers.length);
        }
        
        // Cache the result
        this.cache[cacheKey] = {
          data: containers,
          timestamp: Date.now()
        };
        
        return containers;
      } else {
        console.error('❌ Invalid data response');
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to get registered container list:', error.message || error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      // If token error, try to get new token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('⚠️ Token expired, getting new token...');
        this.token = null;
        this.reqtime = null;
        const tokenData = await this.getToken("GetList_DonHang_ReUse_Out_Now", {
          appversion: '2023'
        });
        if (tokenData) {
          this.token = tokenData.token;
          this.reqtime = tokenData.reqtime;
          return await this.getListDonHangReUseOutNow(userId);
        }
      }
      return [];
    }
  }

  /**
   * Transform registered container API data to frontend format
   */
  async transformRegisteredContainerData(apiData) {
    if (!Array.isArray(apiData)) {
      console.warn('⚠️ API data is not an array');
      return [];
    }

    return apiData.map(item => {
      // Helper function to get value from API field
      const getValue = (field) => {
        if (!field) return '';
        if (typeof field === 'object') {
          return field.v !== undefined ? field.v : (field.r !== undefined ? field.r : '');
        }
        return field;
      };

      return {
        id: getValue(item.ID) || getValue(item.MaPhieuXuat) || '',
        containerId: getValue(item.MaPhieuXuat) || '',
        containerNumber: getValue(item.SoChungTuNhapBai) || getValue(item.ContID) || 'N/A',
        type: getValue(item.ContainerType) || getValue(item.LoaiCont) || 'GP',
        size: getValue(item.ContainerSize) || getValue(item.KichThuoc) || "40'",
        status: getValue(item.TrangThai) || 'Đã đăng ký',
        depot: getValue(item.DepotName) || getValue(item.Depot) || 'N/A',
        depotId: getValue(item.DepotID) || '',
        registeredAt: getValue(item.NgayTao) || getValue(item.ThoiGianTao) || new Date().toISOString(),
        location: getValue(item.ViTri) || getValue(item.Location) || '',
        vehicleNumber: getValue(item.SoXe) || '',
        shippingLine: getValue(item.HangTau) || 'N/A',
        shippingLineId: getValue(item.HangTauID) || '',
        emptyReturnDeadline: getValue(item.HanTraRong) || '',
        userId: getValue(item.NguoiTao) || null,
        goods: getValue(item.HangHoa) || '',
        companyId: getValue(item.DonViVanTaiID) || '',
        rawData: item
      };
    });
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
      // Helper function to get value from API field
      const getValue = (field) => {
        if (!field) return '';
        if (typeof field === 'object') {
          return field.v !== undefined ? field.v : (field.r !== undefined ? field.r : '');
        }
        return field;
      };

      // Lấy trực tiếp ContainerSize và ContainerType từ API (giữ nguyên format)
      // API trả về: "20'", "40'", "45'" cho size
      // API trả về: "GP", "RF", "UT", "PC", "PF", "TN" cho type
      const size = getValue(item.ContainerSize) || "40'";
      const type = getValue(item.ContainerType) || 'GP';

      // Get depot ID from API - use directly without mapping
      const depotId = getValue(item.DepotID) || '';

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
        // returnEmptyDate: getValue(item.HanTraRong) || undefined, // Hạn trả rỗng - không hiển thị
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
        NguoiTao: String(gateOutData.NguoiTao),
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
      
      // STEP 1: Get initial token for GetListReUse_Now if not exists
      if (!this.token || !this.reqtime) {
        console.log('\n🔑 Getting initial token with reqid: GetListReUse_Now...');
        const initialToken = await this.getToken("GetListReUse_Now", {
          appversion: '2023'
        });
        if (!initialToken) {
          return {
            success: false,
            error: 'Failed to get initial authentication token'
          };
        }
        this.token = initialToken.token;
        this.reqtime = initialToken.reqtime;
      }
      
      // STEP 2: Call gettokenNonAid with Create_GateOut_Reuse reqid to get new token
      console.log('\n🔑 Step 1: Calling gettokenNonAid for Create_GateOut_Reuse...');
      const gateOutTokenPayload = {
        reqid: "Create_GateOut_Reuse",
        token: this.token,
        reqtime: this.reqtime,
        data: {
          ...sanitizedData,
          appversion: '2023'
        }
      };
      
      console.log('📤 Token Request Payload:', JSON.stringify(gateOutTokenPayload, null, 2));
      
      let gateOutTokenResponse;
      try {
        gateOutTokenResponse = await axios.post(
          `${this.apiUrl}/api/data/util/gettokenNonAid`,
          gateOutTokenPayload,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );
        
        console.log('📥 Token Response:', JSON.stringify(gateOutTokenResponse.data, null, 2));
        
        if (!gateOutTokenResponse.data || !gateOutTokenResponse.data.token || !gateOutTokenResponse.data.reqtime) {
          console.error('❌ Invalid token response from gettokenNonAid');
          return {
            success: false,
            error: 'Failed to get Create_GateOut_Reuse token'
          };
        }
      } catch (error) {
        console.error('❌ Error getting token:', error.message);
        return {
          success: false,
          error: `Failed to get token: ${error.message}`
        };
      }
      
      // STEP 3: Use the new token to call Create_GateOut_Reuse API
      const newToken = gateOutTokenResponse.data.token;
      const newReqtime = gateOutTokenResponse.data.reqtime;
      
      console.log('\n📡 Step 2: Calling Create_GateOut_Reuse API with new token...');
      
      const requestPayload = {
        reqid: "Create_GateOut_Reuse",
        token: newToken,
        reqtime: newReqtime,
        data: {
          ...sanitizedData,
          appversion: '2023'
        }
      };
      
      try {
        console.log('📤 Request URL:', `${this.apiUrl}/api/data/process/Create_GateOut_Reuse`);
        console.log('📤 Request Payload:', JSON.stringify(requestPayload, null, 2));
        
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
