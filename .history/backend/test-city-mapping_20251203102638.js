const axios = require('axios');

async function testDepotCity() {
  try {
    console.log('🔍 Testing Depot API - City Mapping\n');
    
    // Get token
    const tokenRes = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/util/gettokenNonAid', {
      reqid: "iContainerHub_Depot",
      data: { appversion: '2023' }
    });
    
    const token = tokenRes.data.token;
    const reqtime = tokenRes.data.reqtime;
    
    // Get depot data
    const depotRes = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/process/iContainerHub_Depot', {
      reqid: "iContainerHub_Depot",
      token: token,
      reqtime: reqtime,
      data: { appversion: '2023' }
    });
    
    const depots = depotRes.data.data;
    
    console.log('City Code Mapping:\n');
    console.log('Code'.padEnd(10) + 'Count'.padEnd(10) + 'Depot Names');
    console.log('-'.repeat(80));
    
    // Group by city code
    const cityGroups = {};
    depots.forEach(depot => {
      const code = depot.ThanhPho.v || depot.ThanhPho.r || '?';
      if (!cityGroups[code]) {
        cityGroups[code] = [];
      }
      const name = depot.TenVietTat.v || depot.TenVietTat.r || '?';
      cityGroups[code].push(name);
    });
    
    // Sort by code
    Object.keys(cityGroups).sort().forEach(code => {
      console.log(
        code.padEnd(10) + 
        cityGroups[code].length.toString().padEnd(10) + 
        cityGroups[code].join(', ')
      );
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 All Depots with City Info:\n');
    
    depots.forEach((depot, idx) => {
      const code = depot.ThanhPho.v || depot.ThanhPho.r;
      const name = depot.TenVietTat.v || depot.TenVietTat.r;
      const fullName = depot.TenDepot.v || depot.TenDepot.r;
      
      console.log(`${(idx + 1).toString().padStart(2)}. [Code: ${code}] ${name} - ${fullName}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDepotCity();
