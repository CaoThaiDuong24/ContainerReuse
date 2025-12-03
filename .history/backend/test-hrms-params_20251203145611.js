const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';
const REQID = 'HRMS_UserProfile';

async function testHRMSAPIWithParams() {
  console.log('🔍 Testing HRMS_UserProfile API with different parameters...\n');
  
  try {
    // Step 1: Get Token
    console.log('Step 1: Getting token...');
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: REQID,
      data: {
        appversion: '2023'
      }
    });
    
    const { token, reqtime } = tokenResponse.data;
    console.log('✅ Token received\n');
    
    // Try different parameter combinations
    const testCases = [
      {
        name: 'Test 1: Empty data object',
        data: {}
      },
      {
        name: 'Test 2: With UserID',
        data: { UserID: 111735 }
      },
      {
        name: 'Test 3: With CompanyID',
        data: { CompanyID: 39503 }
      },
      {
        name: 'Test 4: With filter param',
        data: { filter: '' }
      },
      {
        name: 'Test 5: With all companies flag',
        data: { GetAll: true }
      },
      {
        name: 'Test 6: With page/limit',
        data: { page: 1, limit: 100 }
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(testCase.name);
      console.log(`${'='.repeat(60)}`);
      
      try {
        const apiResponse = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
          reqid: REQID,
          token: token,
          reqtime: reqtime,
          data: {
            appversion: '2023',
            ...testCase.data
          }
        });
        
        console.log('Status:', apiResponse.status);
        
        if (apiResponse.data.data) {
          const data = apiResponse.data.data;
          if (Array.isArray(data)) {
            console.log('✅ Result: Array with', data.length, 'items');
            
            if (data.length > 0) {
              console.log('\n📋 First record fields:');
              console.log(Object.keys(data[0]));
              console.log('\n📄 First record data:');
              console.log(JSON.stringify(data[0], null, 2));
              
              // Show a few more if available
              if (data.length > 1) {
                console.log('\n📄 Second record data:');
                console.log(JSON.stringify(data[1], null, 2));
              }
              
              if (data.length > 2) {
                console.log('\n📊 Sample of all records (showing ID and Name only):');
                data.slice(0, 10).forEach((item, i) => {
                  const id = item.ID || item.CompanyID || item.UserID || item.NhaXeID || 'N/A';
                  const name = item.Name || item.CompanyName || item.UserName || item.TenNhaXe || 'N/A';
                  console.log(`  ${i + 1}. ID: ${id}, Name: ${name}`);
                });
              }
              
              // SUCCESS - stop testing
              console.log('\n✅ SUCCESS! Found data with this configuration.');
              break;
            } else {
              console.log('⚠️ Empty array');
            }
          } else {
            console.log('Data type:', typeof data);
            console.log('Data:', JSON.stringify(data, null, 2));
          }
        } else {
          console.log('❌ No data field in response');
        }
        
      } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testHRMSAPIWithParams();
