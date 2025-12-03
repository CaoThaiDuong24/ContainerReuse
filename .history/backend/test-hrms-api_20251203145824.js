const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';
const REQID = 'HRMS_UserProfile';

async function testHRMSAPI() {
  console.log('🔍 Testing HRMS_UserProfile API...\n');
  
  try {
    // Step 1: Get Token
    console.log('Step 1: Getting token...');
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: REQID,
      data: {
        appversion: '2023'
      }
    });
    
    if (!tokenResponse.data || !tokenResponse.data.token) {
      console.error('❌ Failed to get token');
      console.log('Response:', tokenResponse.data);
      return;
    }
    
    const { token, reqtime } = tokenResponse.data;
    console.log('✅ Token received');
    console.log('Token (first 30 chars):', token.substring(0, 30) + '...');
    console.log('Reqtime:', reqtime);
    
    // Step 2: Call HRMS_UserProfile API
    console.log('\nStep 2: Calling HRMS_UserProfile API...');
    const apiResponse = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
      reqid: REQID,
      token: token,
      reqtime: reqtime,
      data: {
        appversion: '2023'
      }
    });
    
    console.log('\n✅ API Response received!');
    console.log('\n=== RESPONSE STRUCTURE ===');
    console.log('Status:', apiResponse.status);
    console.log('Response keys:', Object.keys(apiResponse.data));
    
    if (apiResponse.data.data) {
      const data = apiResponse.data.data;
      console.log('\nData type:', Array.isArray(data) ? 'Array' : typeof data);
      
      if (Array.isArray(data)) {
        console.log('Array length:', data.length);
        
        if (data.length > 0) {
          console.log('\n=== FIRST RECORD STRUCTURE ===');
          console.log('Keys:', Object.keys(data[0]));
          console.log('\n=== FIRST RECORD (FULL) ===');
          console.log(JSON.stringify(data[0], null, 2));
          
          if (data.length > 1) {
            console.log('\n=== SECOND RECORD (FULL) ===');
            console.log(JSON.stringify(data[1], null, 2));
          }
          
          console.log('\n=== ALL RECORDS (Summary) ===');
          data.slice(0, 5).forEach((item, index) => {
            console.log(`\nRecord ${index + 1}:`);
            console.log('  Keys:', Object.keys(item));
            // Try to show ID and Name fields
            const possibleIdFields = ['ID', 'CompanyID', 'NhaXeID', 'UserID', 'id'];
            const possibleNameFields = ['Name', 'CompanyName', 'TenNhaXe', 'UserName', 'FullName', 'HoTen'];
            
            possibleIdFields.forEach(field => {
              if (item[field] !== undefined) {
                console.log(`  ${field}:`, item[field]);
              }
            });
            
            possibleNameFields.forEach(field => {
              if (item[field] !== undefined) {
                console.log(`  ${field}:`, item[field]);
              }
            });
          });
        } else {
          console.log('⚠️ Data array is empty');
        }
      } else if (typeof data === 'string') {
        console.log('\nData is string, attempting to parse...');
        try {
          const parsed = JSON.parse(data);
          console.log('Parsed data type:', Array.isArray(parsed) ? 'Array' : typeof parsed);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('\n=== FIRST RECORD FROM PARSED STRING ===');
            console.log(JSON.stringify(parsed[0], null, 2));
          }
        } catch (e) {
          console.log('Failed to parse string data');
          console.log('Raw data:', data.substring(0, 500));
        }
      } else {
        console.log('\nData structure:');
        console.log(JSON.stringify(data, null, 2));
      }
    } else {
      console.log('\n⚠️ No data field in response');
      console.log('Full response:', JSON.stringify(apiResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testHRMSAPI();
