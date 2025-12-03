// Test script to check GetList_TaiXe_Thuoc_NhaXe API response
const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';
const REQID = 'GetList_TaiXe_Thuoc_NhaXe';

async function getToken() {
  console.log('🔑 Getting token...');
  const response = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
    reqid: REQID,
    data: { appversion: '2023' }
  });
  
  if (response.data && response.data.token && response.data.reqtime) {
    console.log('✅ Token retrieved');
    return {
      token: response.data.token,
      reqtime: response.data.reqtime
    };
  }
  throw new Error('Failed to get token');
}

function generateToken() {
  const token = require('crypto').randomBytes(32).toString('hex');
  return token;
}

async function testDriverAPI() {
  try {
    console.log('\\n========== TESTING GetList_TaiXe_Thuoc_NhaXe API ==========\\n');
    
    // Get token first
    const { token, reqtime } = await getToken();
    
    // Test with a sample transport company ID
    const testCompanyIds = ['39503', '1', '100'];
    
    for (const companyId of testCompanyIds) {
      console.log(`\\n--- Testing with DonViVanTaiID: ${companyId} ---`);
      
      const payload = {
        ReqId: REQID,
        Token: generateToken(),
        DataJson: JSON.stringify({
          DonViVanTaiID: companyId
        })
      };

      console.log('📤 Request payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(`${API_URL}/api/data/util/iContainer`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('\\n📥 Response Status:', response.status);
      console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));

      if (response.data.Data) {
        try {
          const parsedData = JSON.parse(response.data.Data);
          console.log('\\n✅ Parsed Data:', JSON.stringify(parsedData, null, 2));
          
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log('\\n📊 Sample Driver Record:');
            console.log(JSON.stringify(parsedData[0], null, 2));
            console.log('\\n📋 Available Fields:');
            console.log(Object.keys(parsedData[0]));
          }
        } catch (e) {
          console.log('❌ Failed to parse Data field:', e.message);
        }
      }
      
      console.log('\\n' + '='.repeat(60));
    }
    
  } catch (error) {
    console.error('\\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDriverAPI();
