const axios = require('axios');

const apiUrl = 'http://apiedepottest.gsotgroup.vn';

async function testHRMSUserProfile() {
  try {
    console.log('🔑 Step 1: Getting token for HRMS_UserProfile...');
    
    // Get token
    const tokenResponse = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: "HRMS_UserProfile",
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!tokenResponse.data || !tokenResponse.data.token) {
      console.error('❌ Failed to get token');
      console.log('Token response:', tokenResponse.data);
      return;
    }

    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    
    console.log('✅ Token retrieved');
    console.log('Token (first 30 chars):', token.substring(0, 30) + '...');
    console.log('Reqtime:', reqtime);

    console.log('\n📡 Step 2: Calling HRMS_UserProfile API...');
    
    // Call HRMS_UserProfile API
    const response = await axios.post(`${apiUrl}/api/data/process/HRMS_UserProfile`, {
      reqid: "HRMS_UserProfile",
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

    console.log('\n✅ HRMS_UserProfile API Response:');
    console.log('==========================================');
    console.log('Response status:', response.status);
    console.log('Response keys:', Object.keys(response.data));
    
    if (response.data.data) {
      console.log('\n📊 Data Array:');
      console.log('   - Type:', Array.isArray(response.data.data) ? 'Array' : typeof response.data.data);
      console.log('   - Count:', response.data.data.length);
      
      if (response.data.data.length > 0) {
        console.log('\n📝 First Record:');
        console.log(JSON.stringify(response.data.data[0], null, 2));
        
        console.log('\n📋 All Field Names in First Record:');
        console.log(Object.keys(response.data.data[0]));
        
        if (response.data.data.length > 1) {
          console.log('\n📝 Second Record (for comparison):');
          console.log(JSON.stringify(response.data.data[1], null, 2));
        }
      } else {
        console.log('\n⚠️ Data array is EMPTY (0 records)');
      }
    }
    
    console.log('\n📄 Full Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testHRMSUserProfile();
