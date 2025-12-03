const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

async function testEndpoints() {
  console.log('🔍 Exploring API endpoints...\n');
  
  // Danh sách các endpoint có thể có
  const possibleEndpoints = [
    '/api/data/process/iContainerHub_Depot',
    '/api/data/process/depot',
    '/api/data/depot',
    '/api/depot',
    '/api/data/process/getDepot',
    '/api/data/process/DepotList',
    '/api/data/util/getDepot',
  ];

  // Lấy token trước
  console.log('1️⃣ Getting Token...');
  try {
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: "iContainerHub_Depot",
      data: {
        appversion: '2023'
      }
    });

    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    console.log('✅ Token:', token);
    console.log('✅ ReqTime:', reqtime);
    console.log('\n');

    // Thử từng endpoint
    for (const endpoint of possibleEndpoints) {
      console.log(`🔍 Testing: ${endpoint}`);
      
      // Thử POST với reqid + token + reqtime
      try {
        console.log('   - POST with reqid, token, reqtime...');
        const response = await axios.post(`${API_URL}${endpoint}`, {
          reqid: "iContainerHub_Depot",
          token: token,
          reqtime: reqtime,
          data: {
            appversion: '2023'
          }
        }, { timeout: 5000 });
        
        console.log('   ✅ SUCCESS!');
        console.log('   Response:', JSON.stringify(response.data).substring(0, 200));
        console.log('\n');
        break; // Nếu thành công thì dừng
      } catch (error) {
        if (error.response) {
          console.log(`   ❌ ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`   ❌ ${error.message}`);
        }
      }
      
      // Thử POST chỉ với token + reqtime (không có reqid)
      try {
        console.log('   - POST without reqid...');
        const response = await axios.post(`${API_URL}${endpoint}`, {
          token: token,
          reqtime: reqtime,
          data: {
            appversion: '2023'
          }
        }, { timeout: 5000 });
        
        console.log('   ✅ SUCCESS!');
        console.log('   Response:', JSON.stringify(response.data).substring(0, 200));
        console.log('\n');
        break;
      } catch (error) {
        if (error.response) {
          console.log(`   ❌ ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`   ❌ ${error.message}`);
        }
      }
      
      // Thử GET
      try {
        console.log('   - GET with query params...');
        const response = await axios.get(`${API_URL}${endpoint}`, {
          params: {
            token: token,
            reqtime: reqtime
          },
          timeout: 5000
        });
        
        console.log('   ✅ SUCCESS!');
        console.log('   Response:', JSON.stringify(response.data).substring(0, 200));
        console.log('\n');
        break;
      } catch (error) {
        if (error.response) {
          console.log(`   ❌ ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`   ❌ ${error.message}`);
        }
      }
      
      console.log('\n');
    }

  } catch (error) {
    console.error('❌ Failed to get token:', error.message);
  }
}

testEndpoints();
