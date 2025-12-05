/**
 * Test script for GetList_DonHang_ReUse_Out_Now API
 * Tests the registered containers/orders endpoint
 */

const axios = require('axios');

const API_URL = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
const REQID = 'GetList_DonHang_ReUse_Out_Now';

/**
 * Get authentication token
 */
async function getToken() {
  try {
    console.log('\n🔑 Getting token...');
    
    const response = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: REQID,
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
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
    console.error('❌ Failed to get token:', error.message);
    if (error.response) {
      console.error('📛 Response status:', error.response.status);
      console.error('📛 Response data:', error.response.data);
    }
    return null;
  }
}

/**
 * Get list of registered orders/containers
 */
async function getRegisteredOrders(token, reqtime, companyId = null) {
  try {
    console.log('\n📡 Calling GetList_DonHang_ReUse_Out_Now API...');
    console.log(`URL: ${API_URL}/api/data/process/${REQID}`);
    if (companyId) {
      console.log(`🏢 Filtering by Company ID: ${companyId}`);
    }
    
    const requestData = {
      appversion: '2023'
    };
    
    // Try adding company filter if provided
    if (companyId) {
      requestData.DonViVanTaiID = companyId;
    }
    
    console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));
    
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

    if (response.data) {
      console.log('✅ API call successful!');
      console.log('📊 Response status:', response.status);
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log('📦 Total orders/containers:', response.data.data.length);
        
        // Show first order details
        if (response.data.data.length > 0) {
          console.log('\n📋 Sample order (first record):');
          const firstOrder = response.data.data[0];
          console.log(JSON.stringify(firstOrder, null, 2));
          
          // Show all field names available
          console.log('\n📝 Available fields in order data:');
          Object.keys(firstOrder).forEach(key => {
            const value = firstOrder[key];
            let displayValue = value;
            if (typeof value === 'object' && value !== null) {
              displayValue = value.v !== undefined ? value.v : (value.r !== undefined ? value.r : JSON.stringify(value));
            }
            console.log(`  - ${key}: ${displayValue}`);
          });
        }
        
        // Show company distribution
        console.log('\n🏢 Orders by company:');
        const companyMap = {};
        response.data.data.forEach(order => {
          const companyId = order.DonViVanTaiID?.v || order.DonViVanTaiID || 'Unknown';
          companyMap[companyId] = (companyMap[companyId] || 0) + 1;
        });
        Object.entries(companyMap).forEach(([companyId, count]) => {
          console.log(`  Company ${companyId}: ${count} orders`);
        });
        
        return response.data.data;
      } else {
        console.log('⚠️ No data array found in response');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        return [];
      }
    }
  } catch (error) {
    console.error('❌ Failed to get registered orders:', error.message);
    if (error.response) {
      console.error('📛 Response status:', error.response.status);
      console.error('📛 Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

/**
 * Main test function
 */
async function main() {
  console.log('🚀 Starting GetList_DonHang_ReUse_Out_Now API Test');
  console.log('=' .repeat(60));
  
  // Step 1: Get token
  const tokenData = await getToken();
  if (!tokenData) {
    console.error('❌ Cannot proceed without token');
    return;
  }
  
  // Step 2: Test without company filter
  console.log('\n\n🧪 TEST 1: Get ALL orders (no filter)');
  console.log('-'.repeat(60));
  let orders = await getRegisteredOrders(tokenData.token, tokenData.reqtime);
  
  if (orders && orders.length > 0) {
    console.log(`✅ Found ${orders.length} orders without filter`);
  } else {
    console.log('⚠️ No orders found without filter');
  }
  
  // Step 3: Test with company filters from local data
  const testCompanyIds = [24953, 38512];
  
  for (const companyId of testCompanyIds) {
    console.log(`\n\n🧪 TEST: Get orders for Company ${companyId}`);
    console.log('-'.repeat(60));
    orders = await getRegisteredOrders(tokenData.token, tokenData.reqtime, companyId);
    
    if (orders && orders.length > 0) {
      console.log(`✅ Found ${orders.length} orders for company ${companyId}`);
    } else {
      console.log(`⚠️ No orders found for company ${companyId}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY:');
  console.log('💡 If no orders found, it means:');
  console.log('   1. API test database was reset/cleared');
  console.log('   2. Need to create new Gate Out orders first');
  console.log('   3. Or orders exist but with different company IDs');
  console.log('='.repeat(60));
}

// Run the test
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
