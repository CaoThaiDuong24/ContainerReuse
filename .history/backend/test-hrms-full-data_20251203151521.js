const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

async function testHRMSUserProfile() {
  console.log('🔍 Testing HRMS_UserProfile API - Full Data...\n');
  
  try {
    // Get Token
    console.log('Step 1: Getting token...');
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: 'HRMS_UserProfile',
      data: {
        appversion: '2023'
      }
    });
    
    const { token, reqtime } = tokenResponse.data;
    console.log('✅ Token received\n');
    
    // Call HRMS_UserProfile without parameters to get ALL data
    console.log('Step 2: Calling HRMS_UserProfile (no filters)...');
    const apiResponse = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
      reqid: 'HRMS_UserProfile',
      token: token,
      reqtime: reqtime,
      data: {
        appversion: '2023'
      }
    });
    
    console.log('Status:', apiResponse.status);
    console.log('Response keys:', Object.keys(apiResponse.data));
    
    if (apiResponse.data.data) {
      const data = apiResponse.data.data;
      console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'N/A');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('\n✅ SUCCESS! Found', data.length, 'user profiles');
        
        console.log('\n📋 First record fields:');
        console.log(Object.keys(data[0]));
        
        console.log('\n📄 First record data:');
        console.log(JSON.stringify(data[0], null, 2));
        
        // Show sample data
        const getValue = (field) => {
          if (!field) return '';
          if (typeof field === 'string') return field;
          return field.v || field.r || '';
        };
        
        console.log('\n📊 First 5 user profiles:');
        data.slice(0, 5).forEach((profile, i) => {
          const accountId = getValue(profile.AccountID) || getValue(profile.ID) || getValue(profile.UserID);
          const name = getValue(profile.Name) || getValue(profile.Username) || getValue(profile.FullName);
          const companyId = getValue(profile.CompanyID) || getValue(profile.NhaXeID);
          const companyName = getValue(profile.CompanyName) || getValue(profile.TenNhaXe);
          
          console.log(`\n  ${i + 1}. User Profile:`);
          console.log(`     AccountID: ${accountId}`);
          console.log(`     Name: ${name}`);
          console.log(`     CompanyID: ${companyId}`);
          console.log(`     CompanyName: ${companyName}`);
        });
        
        // Look for AccountID 111735
        console.log('\n🔍 Searching for AccountID 111735...');
        const found = data.find(profile => {
          const id = getValue(profile.AccountID) || getValue(profile.ID) || getValue(profile.UserID);
          return id === '111735' || id === 111735;
        });
        
        if (found) {
          console.log('✅ Found profile for AccountID 111735:');
          console.log(JSON.stringify(found, null, 2));
        } else {
          console.log('⚠️ AccountID 111735 not found in results');
        }
        
      } else {
        console.log('⚠️ No user profile data returned (empty array)');
      }
    } else {
      console.log('⚠️ No data field in response');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testHRMSUserProfile();
