/**
 * Test script for GetList_DonHang_ReUse_Out_Now API
 * This API returns containers that have been gate-out (registered orders)
 */

const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';
const REQID = 'GetList_DonHang_ReUse_Out_Now';

/**
 * Get authentication token from API
 */
async function getToken() {
  try {
    console.log('\n🔑 Getting token...');
    const reqtime = Date.now();
    
    const response = await axios.post(`${API_URL}/api/auth/token`, {
      reqid: REQID,
      reqtime: reqtime,
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.token) {
      console.log('✅ Token retrieved successfully');
      console.log('🔐 Token (first 20 chars):', response.data.token.substring(0, 20) + '...');
      console.log('⏰ Reqtime:', reqtime);
      return {
        token: response.data.token,
        reqtime: reqtime
      };
    } else {
      throw new Error('Invalid token response');
    }
  } catch (error) {
    console.error('❌ Failed to get token:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Get list of registered containers (gate-out orders)
 */
async function getRegisteredOrders(token, reqtime) {
  try {
    console.log('\n📡 Calling GetList_DonHang_ReUse_Out_Now API...');
    
    const requestData = {
      appversion: '2023'
    };
    
    console.log('📤 Request payload:', {
      reqid: REQID,
      token: token.substring(0, 20) + '...',
      reqtime: reqtime,
      data: requestData
    });

    const response = await axios.post(`${API_URL}/api/data/process/${REQID}`, {
      reqid: REQID,
      token: token,
      reqtime: reqtime,
      data: requestData
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });

    console.log('\n✅ API call successful');
    console.log('📊 Response status:', response.status);
    
    if (response.data && response.data.data) {
      console.log('📊 Total registered orders:', response.data.data.length);
      return response.data.data;
    } else {
      console.log('⚠️ No data in response');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
      return [];
    }
  } catch (error) {
    console.error('❌ Failed to get registered orders:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Analyze and display order data structure
 */
function analyzeOrderData(orders) {
  if (!orders || orders.length === 0) {
    console.log('\n⚠️ No orders to analyze');
    return;
  }

  console.log('\n============================================================');
  console.log('📊 DATA STRUCTURE ANALYSIS');
  console.log('============================================================');

  // Get first order as sample
  const sampleOrder = orders[0];
  console.log('\n📋 Sample Order Fields:');
  console.log('------------------------------------------------------------');
  
  Object.keys(sampleOrder).forEach(key => {
    const value = sampleOrder[key];
    const type = typeof value;
    const preview = value === null ? 'null' : 
                   type === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : 
                   JSON.stringify(value);
    console.log(`${key.padEnd(30)} | ${type.padEnd(10)} | ${preview}`);
  });

  console.log('\n============================================================');
  console.log('📦 SAMPLE ORDERS (First 3)');
  console.log('============================================================');
  
  orders.slice(0, 3).forEach((order, index) => {
    console.log(`\n--- Order ${index + 1} ---`);
    console.log(JSON.stringify(order, null, 2));
  });

  console.log('\n============================================================');
  console.log('📈 STATISTICS');
  console.log('============================================================');
  
  // Analyze unique values for key fields
  const stats = {
    totalOrders: orders.length,
    uniqueCompanies: new Set(orders.map(o => o.DonViVanTaiID).filter(Boolean)).size,
    uniqueContainerTypes: new Set(orders.map(o => o.LoaiCont).filter(Boolean)).size,
    uniqueDepots: new Set(orders.map(o => o.MaBaiHang).filter(Boolean)).size,
    ordersWithContainer: orders.filter(o => o.SoContainer).length,
    ordersWithSeal: orders.filter(o => o.SoSeal).length,
  };

  Object.entries(stats).forEach(([key, value]) => {
    console.log(`${key.padEnd(30)}: ${value}`);
  });
}

/**
 * Main test function
 */
async function main() {
  try {
    console.log('🚀 Starting GetList_DonHang_ReUse_Out_Now API Test');
    console.log('🌐 API URL:', API_URL);
    console.log('🔖 Request ID:', REQID);
    console.log('============================================================\n');

    // Step 1: Get token
    const { token, reqtime } = await getToken();

    // Step 2: Get registered orders
    const orders = await getRegisteredOrders(token, reqtime);

    // Step 3: Analyze data
    analyzeOrderData(orders);

    console.log('\n============================================================');
    console.log('✅ Test completed successfully');
    console.log('============================================================\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();
