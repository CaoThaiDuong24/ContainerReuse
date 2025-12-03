const axios = require('axios');

async function testDepotLogo() {
  try {
    console.log('🔍 Testing depot API logo fields...\n');
    
    // Get token first
    const tokenResponse = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/util/gettokenNonAid', {
      reqid: "iContainerHub_Depot",
      data: { appversion: '2023' }
    });
    
    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    
    console.log('✅ Got token:', token.substring(0, 20) + '...\n');
    
    // Get depot data
    const depotResponse = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/process/iContainerHub_Depot', {
      reqid: "iContainerHub_Depot",
      token: token,
      reqtime: reqtime,
      data: { appversion: '2023' }
    });
    
    const depots = depotResponse.data.data;
    console.log(`📊 Total depots: ${depots.length}\n`);
    
    // Check first 3 depots for logo fields
    console.log('🔍 Checking logo fields in first 3 depots:\n');
    
    depots.slice(0, 3).forEach((depot, index) => {
      console.log(`\n--- Depot ${index + 1}: ${depot.TenDepot?.v || depot.TenVietTat?.v} ---`);
      console.log('ID:', depot.ID);
      
      // List all fields that might be logo-related
      const logoFields = [
        'logo_inform_whm',
        'Logo',
        'LOGO',
        'AnhDepot',
        'Hinh',
        'Image',
        'image',
        'Logo_Link'
      ];
      
      logoFields.forEach(field => {
        if (depot[field]) {
          const value = typeof depot[field] === 'object' ? depot[field].v || depot[field].r : depot[field];
          console.log(`  ${field}:`, value);
        }
      });
      
      // Show all fields for debugging
      console.log('\n  All fields:', Object.keys(depot).join(', '));
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testDepotLogo();
