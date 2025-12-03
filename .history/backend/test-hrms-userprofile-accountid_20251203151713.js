const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

async function testHRMSUserProfileWithAccountID() {
  console.log('🔍 Testing HRMS_UserProfile API with AccountID parameter...\n');
  
  try {
    // Test với AccountID = 111735 (như ví dụ của bạn)
    const testAccountIDs = [111735, 111736, 111737, 111738, 111740, 111750];
    
    for (const accountId of testAccountIDs) {
      console.log('='.repeat(60));
      console.log(`Testing with AccountID: ${accountId}`);
      console.log('='.repeat(60));
      
      try {
        // Step 1: Get Token
        const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
          reqid: 'HRMS_UserProfile',
          data: {
            appversion: '2023'
          }
        });
        
        const { token, reqtime } = tokenResponse.data;
        console.log('✅ Token received\n');
        
        // Step 2: Call HRMS_UserProfile with AccountID
        const apiResponse = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
          reqid: 'HRMS_UserProfile',
          token: token,
          reqtime: reqtime,
          data: {
            appversion: '2023',
            AccountID: accountId
          }
        });
        
        console.log('Status:', apiResponse.status);
        
        if (apiResponse.data.data) {
          const data = apiResponse.data.data;
          if (Array.isArray(data)) {
            console.log('✅ Result: Array with', data.length, 'items');
            
            if (data.length > 0) {
              console.log('\n📋 User Profile Data:');
              console.log(JSON.stringify(data[0], null, 2));
              
              // Extract important fields
              const getValue = (field) => {
                if (!field) return '';
                if (typeof field === 'string') return field;
                return field.v || field.r || '';
              };
              
              const profile = data[0];
              console.log('\n📊 Extracted Information:');
              console.log('  AccountID:', getValue(profile.AccountID) || accountId);
              console.log('  CompanyID:', getValue(profile.CompanyID) || getValue(profile.NhaXeID));
              console.log('  Company Name:', getValue(profile.CompanyName) || getValue(profile.TenNhaXe));
              console.log('  Company Code:', getValue(profile.CompanyCode) || getValue(profile.MaNhaXe));
              console.log('  Name:', getValue(profile.Name) || getValue(profile.TenHT));
              console.log('  Email:', getValue(profile.Email));
              console.log('  Phone:', getValue(profile.Phone) || getValue(profile.DienThoai));
              console.log('  Address:', getValue(profile.Address) || getValue(profile.DiaChi));
              
              // SUCCESS - found data
              console.log('\n✅ SUCCESS! Found profile data for AccountID:', accountId);
              console.log('\n🎯 This AccountID works! Use it for testing.\n');
              break;
            } else {
              console.log('⚠️ Empty array for AccountID:', accountId);
            }
          } else {
            console.log('⚠️ Data is not an array:', typeof data);
          }
        } else {
          console.log('⚠️ No data field in response');
        }
        
      } catch (err) {
        if (err.response) {
          console.log('❌ Error:', err.response.status, err.response.data.error || err.response.statusText);
        } else {
          console.log('❌ Error:', err.message);
        }
      }
      
      console.log(''); // Empty line between tests
    }

    // Test with backend API
    console.log('\n' + '='.repeat(60));
    console.log('Testing Backend API: /api/companies/by-user/:accuserkey');
    console.log('='.repeat(60));
    
    const backendUrl = 'http://localhost:5000';
    
    try {
      const response = await axios.get(`${backendUrl}/api/companies/by-user/111735`);
      console.log('✅ Status:', response.status);
      console.log('📋 Company Data from Backend:');
      console.log(JSON.stringify(response.data, null, 2));
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log('⚠️ Backend not running. Start it with: cd backend && npm run dev');
      } else if (err.response) {
        console.log('❌ Error:', err.response.status);
        console.log('Response:', err.response.data);
      } else {
        console.log('❌ Error:', err.message);
      }
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testHRMSUserProfileWithAccountID();
