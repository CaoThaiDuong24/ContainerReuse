const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

// List of possible REQID values to test
const API_ENDPOINTS = [
  'HRMS_UserProfile',
  'GetList_NhaXe',
  'GetList_DonViVanTai',
  'GetList_Company',
  'iContainerHub_NhaXe',
  'GetList_TransportCompany',
  'HRMS_Company',
  'HRMS_CompanyList',
  'Get_NhaXe_All',
  'GetAll_NhaXe'
];

async function testAPI(reqid) {
  try {
    // Get token
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: reqid,
      data: { appversion: '2023' }
    });
    
    if (!tokenResponse.data || !tokenResponse.data.token) {
      return { reqid, success: false, error: 'No token received' };
    }
    
    const { token, reqtime } = tokenResponse.data;
    
    // Call API
    const apiResponse = await axios.post(`${API_URL}/api/data/process/${reqid}`, {
      reqid: reqid,
      token: token,
      reqtime: reqtime,
      data: { appversion: '2023' }
    });
    
    const hasData = apiResponse.data && apiResponse.data.data;
    const dataLength = Array.isArray(apiResponse.data.data) ? apiResponse.data.data.length : 0;
    
    return {
      reqid,
      success: true,
      status: apiResponse.status,
      hasData,
      dataLength,
      dataType: hasData ? (Array.isArray(apiResponse.data.data) ? 'array' : typeof apiResponse.data.data) : 'none',
      sampleData: dataLength > 0 ? apiResponse.data.data[0] : null
    };
    
  } catch (error) {
    return {
      reqid,
      success: false,
      error: error.message,
      status: error.response?.status,
      errorData: error.response?.data
    };
  }
}

async function testAllAPIs() {
  console.log('🔍 Testing multiple API endpoints to find company/transport data...\n');
  console.log('='.repeat(80));
  
  for (const reqid of API_ENDPOINTS) {
    console.log(`\nTesting: ${reqid}`);
    console.log('-'.repeat(80));
    
    const result = await testAPI(reqid);
    
    if (result.success) {
      console.log(`✅ SUCCESS`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Has Data: ${result.hasData}`);
      console.log(`   Data Type: ${result.dataType}`);
      console.log(`   Data Length: ${result.dataLength}`);
      
      if (result.sampleData) {
        console.log(`\n   📋 Sample Record Fields:`);
        console.log(`   ${Object.keys(result.sampleData).join(', ')}`);
        console.log(`\n   📄 Sample Record:`);
        console.log(JSON.stringify(result.sampleData, null, 4).split('\n').map(l => '   ' + l).join('\n'));
      }
    } else {
      console.log(`❌ FAILED`);
      console.log(`   Error: ${result.error}`);
      if (result.status) {
        console.log(`   Status: ${result.status}`);
      }
      if (result.errorData) {
        console.log(`   Error Data: ${JSON.stringify(result.errorData)}`);
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('Testing complete!');
}

testAllAPIs();
