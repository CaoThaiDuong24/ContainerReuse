const axios = require('axios');

async function testRawApiData() {
  try {
    const apiUrl = 'http://apiedepottest.gsotgroup.vn';
    
    // Step 1: Get token
    console.log('🔑 Getting token...');
    const tokenResponse = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: "GetListReUse_Now",
      data: { appversion: '2023' }
    });
    
    const { token, reqtime } = tokenResponse.data;
    console.log('✅ Token received\n');
    
    // Step 2: Get container data
    console.log('📡 Getting container data...');
    const dataResponse = await axios.post(`${apiUrl}/api/data/process/GetListReUse_Now`, {
      reqid: "GetListReUse_Now",
      token,
      reqtime,
      data: { appversion: '2023' }
    });
    
    const containers = dataResponse.data.data;
    console.log(`✅ Received ${containers.length} containers\n`);
    
    // Show first container with ALL fields
    console.log('📦 RAW DATA STRUCTURE (First Container):');
    console.log('='.repeat(80));
    console.log(JSON.stringify(containers[0], null, 2));
    console.log('='.repeat(80));
    
    // Extract all unique field names
    console.log('\n📋 ALL AVAILABLE FIELDS:');
    const allFields = new Set();
    containers.forEach(container => {
      Object.keys(container).forEach(key => allFields.add(key));
    });
    
    Array.from(allFields).sort().forEach(field => {
      const sampleValue = containers[0][field];
      console.log(`  - ${field}: ${JSON.stringify(sampleValue)}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRawApiData();
