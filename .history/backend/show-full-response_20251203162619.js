const axios = require('axios');

const apiUrl = 'http://apiedepottest.gsotgroup.vn';

async function showFullResponse() {
  try {
    console.log('📡 Request to HRMS_UserProfile API');
    console.log('Request Body: { AccountID: 111735 }\n');
    
    // Get token
    const tokenResponse = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: "HRMS_UserProfile",
      data: {
        appversion: '2023',
        AccountID: 111735
      }
    });

    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    
    // Call HRMS_UserProfile API
    const response = await axios.post(`${apiUrl}/api/data/process/HRMS_UserProfile`, {
      reqid: "HRMS_UserProfile",
      token: token,
      reqtime: reqtime,
      data: {
        appversion: '2023',
        AccountID: 111735
      }
    });

    console.log('✅ FULL API RESPONSE:');
    console.log('=' .repeat(100));
    console.log(JSON.stringify(response.data, null, 2));
    console.log('=' .repeat(100));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

showFullResponse();
