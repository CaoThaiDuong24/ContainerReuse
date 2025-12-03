// Test to discover available driver/transport company related APIs
const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

// Common API patterns based on existing working APIs
const POTENTIAL_DRIVER_APIS = [
  // Based on naming pattern from working APIs
  'iContainerHub_TaiXe',
  'iContainerHub_Driver',
  'iContainerHub_NhaXe',
  'iContainerHub_DonViVanTai',
  
  // Based on GetListReUse pattern
  'GetList_TaiXe',
  'GetListDriver',
  'GetList_DonViVanTai',
  
  // Simple names
  'TaiXe',
  'Driver',
  'NhaXe',
  'DonViVanTai',
];

async function testAPI(reqid) {
  try {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Testing: ${reqid}`);
    console.log('='.repeat(70));
    
    // Get token
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: reqid,
      data: { appversion: '2023' }
    });
    
    if (!tokenResponse.data.token) {
      console.log('❌ Failed to get token');
      return;
    }
    
    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    console.log('✅ Token received');
    
    // Try API without parameters first
    try {
      const response = await axios.post(
        `${API_URL}/api/data/process/${reqid}`,
        {
          reqid: reqid,
          token: token,
          reqtime: reqtime,
          data: {
            appversion: '2023'
          }
        }
      );
      
      console.log('✅ SUCCESS! Status:', response.status);
      console.log('📊 Response keys:', Object.keys(response.data));
      
      if (response.data.data) {
        console.log('📊 Data count:', Array.isArray(response.data.data) ? response.data.data.length : 'not an array');
        
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          console.log('\n🎯 SAMPLE RECORD:');
          console.log(JSON.stringify(response.data.data[0], null, 2));
          console.log('\n📋 Available fields:');
          console.log(Object.keys(response.data.data[0]).join(', '));
        }
      }
      
      console.log('\n🎉 FOUND WORKING API:', reqid);
      return true;
      
    } catch (err) {
      if (err.response) {
        console.log(`❌ Failed - Status ${err.response.status}`);
        if (err.response.status === 400) {
          // Try with DonViVanTaiID parameter
          console.log('  Trying with DonViVanTaiID parameter...');
          try {
            const response2 = await axios.post(
              `${API_URL}/api/data/process/${reqid}`,
              {
                reqid: reqid,
                token: token,
                reqtime: reqtime,
                data: {
                  DonViVanTaiID: '39503',
                  appversion: '2023'
                }
              }
            );
            
            console.log('  ✅ SUCCESS with parameter! Status:', response2.status);
            if (response2.data.data) {
              console.log('  📊 Data count:', Array.isArray(response2.data.data) ? response2.data.data.length : 'not an array');
              
              if (Array.isArray(response2.data.data) && response2.data.data.length > 0) {
                console.log('\n  🎯 SAMPLE RECORD:');
                console.log(JSON.stringify(response2.data.data[0], null, 2));
              }
            }
            console.log('\n🎉 FOUND WORKING API WITH PARAM:', reqid);
            return true;
          } catch (err2) {
            console.log('  ❌ Also failed with parameter');
          }
        }
      } else {
        console.log('❌ Network error:', err.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  return false;
}

async function discoverAPIs() {
  console.log('🔍 DISCOVERING DRIVER/TRANSPORT COMPANY APIs\n');
  
  const workingAPIs = [];
  
  for (const apiName of POTENTIAL_DRIVER_APIS) {
    const success = await testAPI(apiName);
    if (success) {
      workingAPIs.push(apiName);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n' + '='.repeat(70));
  console.log('📋 SUMMARY');
  console.log('='.repeat(70));
  console.log('Working APIs:', workingAPIs.length ? workingAPIs.join(', ') : 'None found');
  console.log('Tested APIs:', POTENTIAL_DRIVER_APIS.length);
}

discoverAPIs();
