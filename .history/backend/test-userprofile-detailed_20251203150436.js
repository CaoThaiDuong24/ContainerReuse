const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';

async function testUserProfileAPI() {
  console.log('🔍 Testing HRMS_UserProfile API in detail...\n');
  
  try {
    // Test 1: Standard call
    console.log('='.repeat(60));
    console.log('Test 1: Standard HRMS_UserProfile call');
    console.log('='.repeat(60));
    
    const token1 = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: 'HRMS_UserProfile',
      data: { appversion: '2023' }
    });
    
    const result1 = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
      reqid: 'HRMS_UserProfile',
      token: token1.data.token,
      reqtime: token1.data.reqtime,
      data: { appversion: '2023' }
    });
    
    console.log('Response keys:', Object.keys(result1.data));
    console.log('Data length:', Array.isArray(result1.data.data) ? result1.data.data.length : 'N/A');
    
    if (result1.data.data && result1.data.data.length > 0) {
      console.log('\n📋 Sample record:');
      console.log(JSON.stringify(result1.data.data[0], null, 2));
    } else {
      console.log('⚠️ No data returned\n');
    }

    // Test 2: Try with accuserkey from login
    console.log('\n' + '='.repeat(60));
    console.log('Test 2: Get user info by logging in first');
    console.log('='.repeat(60));
    
    // Login to get accuserkey
    const loginResponse = await axios.post(`${API_URL}/api/Users/Login`, {
      user: 'tduc.nnc',
      password: 'tduc.nnc'
    });
    
    console.log('✅ Login successful');
    console.log('Username:', loginResponse.data.username);
    console.log('Accuserkey:', loginResponse.data.accuserkey);
    console.log('Token (first 30):', loginResponse.data.token.substring(0, 30) + '...');
    
    // Now try to get user profile with this token
    const token2 = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: 'HRMS_UserProfile',
      data: { appversion: '2023' }
    });
    
    const result2 = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
      reqid: 'HRMS_UserProfile',
      token: token2.data.token,
      reqtime: token2.data.reqtime,
      data: { 
        appversion: '2023',
        accuserkey: loginResponse.data.accuserkey
      }
    });
    
    console.log('\nResponse with accuserkey:');
    console.log('Data length:', Array.isArray(result2.data.data) ? result2.data.data.length : 'N/A');
    
    if (result2.data.data && result2.data.data.length > 0) {
      console.log('\n📋 User profile data:');
      console.log(JSON.stringify(result2.data.data[0], null, 2));
    } else {
      console.log('⚠️ Still no data with accuserkey\n');
    }

    // Test 3: Try different API endpoints that might have user/company mapping
    console.log('\n' + '='.repeat(60));
    console.log('Test 3: Search for alternative user info APIs');
    console.log('='.repeat(60));
    
    const possibleAPIs = [
      'HRMS_User',
      'HRMS_Profile', 
      'User_Profile',
      'GetUserInfo',
      'UserCompany',
      'User_Company'
    ];
    
    for (const apiName of possibleAPIs) {
      try {
        const token = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
          reqid: apiName,
          data: { appversion: '2023' }
        });
        
        const result = await axios.post(`${API_URL}/api/data/process/${apiName}`, {
          reqid: apiName,
          token: token.data.token,
          reqtime: token.data.reqtime,
          data: { appversion: '2023' }
        });
        
        console.log(`✅ ${apiName}: Found! Data length:`, Array.isArray(result.data.data) ? result.data.data.length : 'N/A');
        
        if (result.data.data && Array.isArray(result.data.data) && result.data.data.length > 0) {
          console.log(`   Sample fields:`, Object.keys(result.data.data[0]));
        }
      } catch (err) {
        if (err.response) {
          console.log(`❌ ${apiName}: ${err.response.data.error || err.response.statusText}`);
        } else {
          console.log(`❌ ${apiName}: ${err.message}`);
        }
      }
    }

    // Test 4: Check driver API for company info
    console.log('\n' + '='.repeat(60));
    console.log('Test 4: Get company from driver data (using accuserkey)');
    console.log('='.repeat(60));
    
    const token3 = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: 'GetList_TaiXe_Thuoc_NhaXe',
      data: { appversion: '2023' }
    });
    
    const driverResult = await axios.post(`${API_URL}/api/data/process/GetList_TaiXe_Thuoc_NhaXe`, {
      reqid: 'GetList_TaiXe_Thuoc_NhaXe',
      token: token3.data.token,
      reqtime: token3.data.reqtime,
      data: { appversion: '2023' }
    });
    
    console.log('Total drivers:', Array.isArray(driverResult.data.data) ? driverResult.data.data.length : 'N/A');
    
    if (driverResult.data.data && driverResult.data.data.length > 0) {
      // Look for driver with matching accuserkey or username
      const userDriver = driverResult.data.data.find(d => 
        d.ID_driver?.v === loginResponse.data.accuserkey ||
        d.ID_driver?.r === loginResponse.data.accuserkey ||
        d.TenHT?.v?.toLowerCase().includes('tduc') ||
        d.TenHT?.r?.toLowerCase().includes('tduc')
      );
      
      if (userDriver) {
        console.log('\n✅ Found matching driver record:');
        console.log('Driver ID:', userDriver.ID_driver?.v || userDriver.ID_driver?.r);
        console.log('Driver Name:', userDriver.TenHT?.v || userDriver.TenHT?.r);
        console.log('Company ID (NhaXeID):', userDriver.NhaXeID?.v || userDriver.NhaXeID?.r);
        console.log('\n📋 Full driver record:');
        console.log(JSON.stringify(userDriver, null, 2));
      } else {
        console.log('⚠️ No driver found matching accuserkey or username');
        console.log('\n📋 Sample driver record structure:');
        console.log(JSON.stringify(driverResult.data.data[0], null, 2));
      }
      
      // Extract unique companies
      const companies = new Map();
      driverResult.data.data.forEach(d => {
        const nhaXeID = d.NhaXeID?.v || d.NhaXeID?.r;
        if (nhaXeID && !companies.has(nhaXeID)) {
          companies.set(nhaXeID, {
            id: nhaXeID,
            driverCount: 0
          });
        }
        if (nhaXeID) {
          companies.get(nhaXeID).driverCount++;
        }
      });
      
      console.log(`\n📊 Found ${companies.size} unique companies in driver data`);
      const topCompanies = Array.from(companies.entries())
        .sort((a, b) => b[1].driverCount - a[1].driverCount)
        .slice(0, 10);
      
      console.log('\nTop 10 companies by driver count:');
      topCompanies.forEach(([id, info], i) => {
        console.log(`${i + 1}. Company ID: ${id}, Drivers: ${info.driverCount}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
    }
  }
}

testUserProfileAPI();
