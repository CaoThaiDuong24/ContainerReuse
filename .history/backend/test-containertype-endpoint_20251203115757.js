const axios = require('axios');

async function testContainerTypesAPI() {
  try {
    console.log('Testing /api/container-types/active endpoint...\n');
    
    const response = await axios.get('http://localhost:5000/api/container-types/active');
    
    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testContainerTypesAPI();
