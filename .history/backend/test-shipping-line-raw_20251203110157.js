const axios = require('axios');

const API_URL = 'http://apiedepottest.gsotgroup.vn';
const USERNAME = 'icontainerhub';
const PASSWORD = '12345';

async function testRawShippingLineData() {
  try {
    console.log('🔑 Getting token...');
    
    // Get token
    const tokenResponse = await axios.post(`${API_URL}/api/login`, {
      username: USERNAME,
      password: PASSWORD
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token received:', token ? 'Yes' : 'No');
    
    // Get shipping line data
    console.log('\n📦 Fetching shipping line data...');
    const response = await axios.post(
      `${API_URL}/api/data/process/iContainerHub_HangTau`,
      {
        reqid: 'iContainerHub_HangTau',
        data: {}
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Data Keys:', Object.keys(response.data));
    
    if (response.data && response.data.data) {
      console.log('📊 Total Records:', response.data.data.length);
      
      // Show first 3 records in detail
      console.log('\n🔍 First 3 Records (RAW):');
      console.log(JSON.stringify(response.data.data.slice(0, 3), null, 2));
      
      // Analyze field structure
      if (response.data.data.length > 0) {
        console.log('\n🔍 Fields in first record:');
        const firstRecord = response.data.data[0];
        Object.keys(firstRecord).forEach(key => {
          const value = firstRecord[key];
          console.log(`  ${key}:`, typeof value === 'object' ? JSON.stringify(value) : value);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testRawShippingLineData();
