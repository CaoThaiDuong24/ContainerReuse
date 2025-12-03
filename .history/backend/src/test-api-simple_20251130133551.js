const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

async function testApi() {
  console.log('🧪 Testing API:', API_URL);
  console.log('='.repeat(60));
  
  try {
    // Test 1: Get Token
    console.log('\n1️⃣ Getting Token...');
    console.log(`URL: ${API_URL}/api/data/util/gettokenNonAid`);
    
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: "iContainerHub_Depot",
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Token Response:');
    console.log(JSON.stringify(tokenResponse.data, null, 2));

    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;

    // Test 2: Get Depot Data
    console.log('\n2️⃣ Getting Depot Data...');
    console.log(`URL: ${API_URL}/api/data/process/iContainerHub_Depot`);
    
    const depotResponse = await axios.post(`${API_URL}/api/data/process/iContainerHub_Depot`, {
      reqid: "iContainerHub_Depot",
      token: token,
      reqtime: reqtime,
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Depot Data Response:');
    console.log('Data structure:', Object.keys(depotResponse.data));
    console.log('Full data:');
    console.log(JSON.stringify(depotResponse.data, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Test completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.error('\nFull error:', error);
  }
}

testApi();
