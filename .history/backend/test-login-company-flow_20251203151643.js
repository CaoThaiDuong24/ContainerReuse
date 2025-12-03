const axios = require('axios');

async function testLoginAndGetCompany() {
  console.log('🧪 Testing Login -> Get Company Flow...\n');
  
  const EXTERNAL_API = 'http://apiedepottest.gsotgroup.vn';
  const BACKEND_API = 'http://localhost:5000';
  
  try {
    // Step 1: Login to get accuserkey
    console.log('='.repeat(60));
    console.log('Step 1: Login to get accuserkey');
    console.log('='.repeat(60));
    
    // Try with a test username (you can change this)
    const credentials = {
      user: 'testuser',
      password: 'testpass'
    };
    
    console.log(`Trying to login with user: ${credentials.user}...`);
    
    let loginResponse;
    try {
      loginResponse = await axios.post(`${EXTERNAL_API}/api/Users/Login`, credentials);
      
      console.log('✅ Login successful!');
      console.log('Username:', loginResponse.data.username);
      console.log('Token (first 30):', loginResponse.data.token?.substring(0, 30) + '...');
      console.log('Accuserkey:', loginResponse.data.accuserkey);
      
    } catch (err) {
      console.log('❌ Login failed:', err.response?.data?.message || err.message);
      console.log('\n💡 Please provide valid credentials to test.');
      console.log('   You can edit this file and change credentials.user and credentials.password\n');
      return;
    }
    
    const accuserkey = loginResponse.data.accuserkey;
    
    // Step 2: Get company info using backend API
    console.log('\n' + '='.repeat(60));
    console.log(`Step 2: Get company for user ${accuserkey}`);
    console.log('='.repeat(60));
    
    try {
      const companyResponse = await axios.get(
        `${BACKEND_API}/api/companies/by-user/${accuserkey}`
      );
      
      console.log('✅ Status:', companyResponse.status);
      console.log('\n📋 Company Information:');
      console.log(JSON.stringify(companyResponse.data, null, 2));
      
      const company = companyResponse.data.data;
      if (company) {
        console.log('\n🏢 Company Details:');
        console.log('  ID:', company.id);
        console.log('  Code:', company.code);
        console.log('  Name:', company.name);
        console.log('  Type:', company.type);
        console.log('  Data Source:', company.rawApiData?.source);
      }
      
      console.log('\n✅ SUCCESS! Company API is working correctly!');
      
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log('❌ Backend not running!');
        console.log('\n💡 Start backend with:');
        console.log('   cd backend');
        console.log('   npm run dev\n');
      } else if (err.response) {
        console.log('❌ Error:', err.response.status);
        console.log('Response:', err.response.data);
        
        if (err.response.status === 404) {
          console.log('\n💡 This means:');
          console.log('   - HRMS_UserProfile API returned no data for this user');
          console.log('   - User was not found in Driver API');
          console.log('   - The accuserkey may not be associated with any company');
        }
      } else {
        console.log('❌ Error:', err.message);
      }
    }

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }
}

testLoginAndGetCompany();
