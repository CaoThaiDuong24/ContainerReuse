/**
 * Test script for Driver API
 * Tests the GetList_TaiXe_Thuoc_NhaXe endpoint with proper token handling
 */

const axios = require('axios');

const API_URL = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
const REQID = 'GetList_TaiXe_Thuoc_NhaXe';

// Test company IDs to try
const TEST_COMPANY_IDS = ['68400', '12345']; // Add more as needed

/**
 * Get authentication token
 */
async function getToken(transportCompanyId) {
  try {
    console.log(`\n🔑 Getting token for company ${transportCompanyId}...`);
    
    const response = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: REQID,
      data: {
        NhaXeID: transportCompanyId,
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
 * Get drivers for a transport company
 */
async function getDrivers(transportCompanyId, token, reqtime) {
  try {
    console.log(`\n📞 Requesting driver data for company ${transportCompanyId}...`);
    
    const response = await axios.post(
      `${API_URL}/api/data/process/GetList_TaiXe_Thuoc_NhaXe`,
      {
        reqid: REQID,
        token: token,
        reqtime: reqtime,
        data: {
          NhaXeID: transportCompanyId,
          appversion: '2023'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data) {
      console.log('✅ API call successful');
      console.log('📊 Response status:', response.status);
      
      // Check for errors in response
      if (response.data.error) {
        console.error('❌ API returned error:', response.data.error);
        return null;
      }
      
      // Check for data
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log('✅ Driver data received');
        console.log('📊 Total drivers:', response.data.data.length);
        
        // Show sample driver data (first 2)
        if (response.data.data.length > 0) {
          console.log('\n📝 Sample driver data (first 2):');
          response.data.data.slice(0, 2).forEach((driver, index) => {
            console.log(`\nDriver ${index + 1}:`);
            console.log('  ID:', driver.ID_driver?.v || driver.ID_driver);
            console.log('  Name:', driver.TenHT?.v || driver.TenHT);
            console.log('  Phone:', driver.SoDT?.v || driver.SoDT);
            console.log('  Vehicle:', driver.BienXe?.v || driver.BienXe);
            console.log('  Company ID:', driver.DoanhNghiepVanTaiID?.v || driver.DoanhNghiepVanTaiID);
          });
        }
        
        return response.data;
      } else {
        console.warn('⚠️ No data array in response');
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        return response.data;
      }
    } else {
      console.error('❌ No response data');
      return null;
    }
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    if (error.response) {
      console.error('📛 Response status:', error.response.status);
      console.error('📛 Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

/**
 * Test driver API for a specific company
 */
async function testDriverAPI(transportCompanyId) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing Driver API for Company: ${transportCompanyId}`);
  console.log('='.repeat(60));
  
  // Step 1: Get token
  const tokenData = await getToken(transportCompanyId);
  if (!tokenData) {
    console.error('❌ Failed to get token, aborting test');
    return false;
  }
  
  // Step 2: Get drivers
  const driversData = await getDrivers(transportCompanyId, tokenData.token, tokenData.reqtime);
  if (!driversData) {
    console.error('❌ Failed to get drivers');
    return false;
  }
  
  console.log('\n✅ Test completed successfully');
  return true;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Driver API Tests');
  console.log('API URL:', API_URL);
  console.log('REQID:', REQID);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const companyId of TEST_COMPANY_IDS) {
    const success = await testDriverAPI(companyId);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Wait a bit between tests
    if (TEST_COMPANY_IDS.indexOf(companyId) < TEST_COMPANY_IDS.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${TEST_COMPANY_IDS.length}`);
}

// Run tests
runTests().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});
