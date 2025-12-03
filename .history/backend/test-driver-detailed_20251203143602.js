const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';
const REQID = 'GetList_TaiXe_Thuoc_NhaXe';

async function testDriverAPI() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('TESTING API: GetList_TaiXe_Thuoc_NhaXe');
    console.log('='.repeat(80) + '\n');

    // Step 1: Get token
    console.log('Step 1: Getting token...');
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: REQID,
      data: {
        appversion: '2023'
      }
    });

    if (!tokenResponse.data.token || !tokenResponse.data.reqtime) {
      console.log('❌ Failed to get token');
      console.log('Response:', tokenResponse.data);
      return;
    }

    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    console.log('✅ Token received');
    console.log('   Token (first 30 chars):', token.substring(0, 30) + '...');
    console.log('   Reqtime:', reqtime);

    // Step 2: Try different request structures
    console.log('\n' + '='.repeat(80));
    console.log('Step 2: Testing different request structures...');
    console.log('='.repeat(80) + '\n');

    const testCases = [
      {
        name: 'Test 1: Without DonViVanTaiID (like depot API)',
        payload: {
          reqid: REQID,
          token: token,
          reqtime: reqtime,
          data: {
            appversion: '2023'
          }
        }
      },
      {
        name: 'Test 2: With DonViVanTaiID in data',
        payload: {
          reqid: REQID,
          token: token,
          reqtime: reqtime,
          data: {
            DonViVanTaiID: 39503,
            appversion: '2023'
          }
        }
      },
      {
        name: 'Test 3: With DonViVanTaiID as string',
        payload: {
          reqid: REQID,
          token: token,
          reqtime: reqtime,
          data: {
            DonViVanTaiID: '39503',
            appversion: '2023'
          }
        }
      },
      {
        name: 'Test 4: With NhaXeID instead',
        payload: {
          reqid: REQID,
          token: token,
          reqtime: reqtime,
          data: {
            NhaXeID: 39503,
            appversion: '2023'
          }
        }
      },
      {
        name: 'Test 5: With TransportCompanyID',
        payload: {
          reqid: REQID,
          token: token,
          reqtime: reqtime,
          data: {
            TransportCompanyID: 39503,
            appversion: '2023'
          }
        }
      },
      {
        name: 'Test 6: Only appversion',
        payload: {
          reqid: REQID,
          token: token,
          reqtime: reqtime,
          data: {
            appversion: '2023'
          }
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n${testCase.name}`);
      console.log('-'.repeat(80));
      console.log('Payload:', JSON.stringify(testCase.payload, null, 2));
      
      try {
        const response = await axios.post(
          `${API_URL}/api/data/process/${REQID}`,
          testCase.payload,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );

        console.log('\n✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response keys:', Object.keys(response.data));
        
        if (response.data.data) {
          console.log('Data type:', Array.isArray(response.data.data) ? 'Array' : typeof response.data.data);
          
          if (Array.isArray(response.data.data)) {
            console.log('Total records:', response.data.data.length);
            
            if (response.data.data.length > 0) {
              console.log('\n📊 FIRST RECORD - FULL STRUCTURE:');
              console.log(JSON.stringify(response.data.data[0], null, 2));
              
              console.log('\n📋 ALL FIELDS:');
              Object.keys(response.data.data[0]).forEach(key => {
                const value = response.data.data[0][key];
                let displayValue = value;
                
                if (value && typeof value === 'object' && (value.v !== undefined || value.r !== undefined)) {
                  displayValue = `{ v: "${value.v || ''}", r: "${value.r || ''}" }`;
                } else if (typeof value === 'object') {
                  displayValue = JSON.stringify(value);
                }
                
                console.log(`   ${key}: ${displayValue}`);
              });
            }
          } else {
            console.log('Data content:', JSON.stringify(response.data.data, null, 2));
          }
        }
        
        console.log('\n🎉 THIS TEST CASE WORKED!');
        console.log('='.repeat(80));
        break; // Stop testing once we find a working combination
        
      } catch (error) {
        if (error.response) {
          console.log(`❌ Failed with status ${error.response.status}`);
          if (error.response.data) {
            console.log('Error response:', JSON.stringify(error.response.data, null, 2));
          }
        } else {
          console.log('❌ Network error:', error.message);
        }
      }
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDriverAPI();
