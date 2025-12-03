// Test script to check GetList_TaiXe_Thuoc_NhaXe API response
const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

// Try different possible API names
const REQIDS_TO_TRY = [
  'GetList_TaiXe_Thuoc_NhaXe',
  'GetList_TaiXe',
  'iContainerHub_TaiXe',
  'Get_TaiXe_NhaXe',
  'GetListDriver',
  'Get_Driver_List'
];

async function getToken(reqid) {
  console.log(`🔑 Getting token for ${reqid}...`);
  const response = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
    reqid: reqid,
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
    console.log('\\n========== TESTING DRIVER API NAMES ==========\\n');
    
    const testCompanyId = '39503';
    
    for (const REQID of REQIDS_TO_TRY) {
      console.log(`\\n${'='.repeat(70)}`);
      console.log(`Testing ReqId: ${REQID}`);
      console.log('='.repeat(70));
      
      try {
        // Get token first
        const { token, reqtime } = await getToken(REQID);
        
        // Try both endpoint styles
        const endpoints = [
          {
            url: `${API_URL}/api/data/process/${REQID}`,
            payload: {
              reqid: REQID,
              token: token,
              reqtime: reqtime,
              data: {
                DonViVanTaiID: testCompanyId,
                appversion: '2023'
              }
            }
          },
          {
            url: `${API_URL}/api/data/util/iContainer`,
            payload: {
              ReqId: REQID,
              Token: generateToken(),
              DataJson: JSON.stringify({
                DonViVanTaiID: testCompanyId
              })
            }
          }
        ];

        let response = null;
        let successEndpoint = null;
        
        for (const endpoint of endpoints) {
          try {
            console.log('📤 Trying endpoint:', endpoint.url);
            console.log('📤 Request payload:', JSON.stringify(endpoint.payload, null, 2));

            response = await axios.post(endpoint.url, endpoint.payload, {
              headers: { 'Content-Type': 'application/json' }
            });
            
            successEndpoint = endpoint.url;
            break; // Success, exit loop
          } catch (err) {
            console.log(`❌ Failed with endpoint: ${endpoint.url}`);
            if (err.response) {
              console.log(`   Status: ${err.response.status}`);
            }
            continue; // Try next endpoint
          }
        }

        if (!response) {
          throw new Error('Both endpoints failed');
        }

        console.log('\\n✅ SUCCESS! Response Status:', response.status);
        console.log('✅ Successful endpoint:', successEndpoint);
        console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data.Data) {
          try {
            const parsedData = JSON.parse(response.data.Data);
            console.log('\\n✅ Parsed Data Count:', Array.isArray(parsedData) ? parsedData.length : 'Not an array');
            
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              console.log('\\n📊 SAMPLE DRIVER RECORD:');
              console.log(JSON.stringify(parsedData[0], null, 2));
              console.log('\\n📋 AVAILABLE FIELDS:');
              console.log(Object.keys(parsedData[0]).join(', '));
              
              console.log('\\n\\n🎉 FOUND THE CORRECT API!');
              console.log(`✅ ReqId: ${REQID}`);
              break; // Stop if we found the correct one
            }
          } catch (e) {
            console.log('⚠️  Failed to parse Data field:', e.message);
          }
        } else if (response.data.data) {
          // Try lowercase 'data' field (like depot API)
          console.log('\\n✅ Found data field (lowercase)');
          if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            console.log('\\n📊 SAMPLE DRIVER RECORD:');
            console.log(JSON.stringify(response.data.data[0], null, 2));
            console.log('\\n📋 AVAILABLE FIELDS:');
            console.log(Object.keys(response.data.data[0]).join(', '));
            
            console.log('\\n\\n🎉 FOUND THE CORRECT API!');
            console.log(`✅ ReqId: ${REQID}`);
            console.log(`✅ Endpoint: ${successEndpoint}`);
            break;
          }
        }
        
      } catch (error) {
        if (error.response) {
          console.log(`❌ Failed with status ${error.response.status}: ${REQID}`);
        } else {
          console.log(`❌ Error: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('\\n❌ Fatal Error:', error.message);
  }
}

testDriverAPI();
