const axios = require('axios');

async function checkLogoPaths() {
  try {
    // Get token
    const tokenResponse = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/util/gettokenNonAid', {
      reqid: "iContainerHub_Depot",
      data: { appversion: '2023' }
    });
    
    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    
    console.log('✅ Got token\n');
    
    // Get depot data
    const depotResponse = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/process/iContainerHub_Depot', {
      reqid: "iContainerHub_Depot",
      token: token,
      reqtime: reqtime,
      data: { appversion: '2023' }
    });
    
    const depots = depotResponse.data.data;
    
    console.log('=== CHECKING LOGO PATHS FROM RAW API ===\n');
    
    // Check first 5 depots
    for (let i = 0; i < Math.min(5, depots.length); i++) {
      const depot = depots[i];
      const name = depot.TenDepot?.v || depot.TenVietTat?.v || 'Unknown';
      const logoField = depot.logo_inform_whm;
      
      console.log(`\nDepot ${i + 1}: ${name}`);
      console.log('  Raw logo field:', logoField);
      
      if (logoField) {
        const logoPath = logoField.v || logoField.r || logoField;
        console.log('  Extracted path:', logoPath);
        
        // Test different URL constructions
        const urls = [
          `http://apiedepottest.gsotgroup.vn${logoPath}`,
          `http://apiedepottest.gsotgroup.vn/${logoPath}`,
          logoPath.startsWith('http') ? logoPath : null
        ].filter(Boolean);
        
        console.log('  Testing URLs:');
        for (const url of urls) {
          try {
            const testResponse = await axios.head(url, { timeout: 5000 });
            console.log(`    ✅ ${url} - Status: ${testResponse.status}`);
          } catch (error) {
            console.log(`    ❌ ${url} - Status: ${error.response?.status || 'FAILED'}`);
          }
        }
      } else {
        console.log('  ⚠️  No logo field');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLogoPaths();
