const axios = require('axios');

async function checkDepotMapping() {
  console.log('='.repeat(60));
  console.log('🔍 Checking Depot ID Mapping');
  console.log('='.repeat(60));
  
  const apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
  
  try {
    // Get token
    console.log('\n🔑 Getting token...');
    const tokenResponse = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: "iContainerHub_Depot",
      data: { appversion: '2023' }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    console.log('✅ Token received');
    
    // Get depots
    console.log('\n📡 Fetching depots...');
    const depotResponse = await axios.post(`${apiUrl}/api/data/process/iContainerHub_Depot`, {
      reqid: "iContainerHub_Depot",
      token: token,
      reqtime: reqtime,
      data: { appversion: '2023' }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const depots = depotResponse.data.data || [];
    console.log(`✅ Found ${depots.length} depots\n`);
    
    console.log('='.repeat(60));
    console.log('📋 DEPOT LIST');
    console.log('='.repeat(60));
    
    depots.forEach((depot, index) => {
      console.log(`\n${index + 1}. ${depot.TenDepot?.v || depot.TenDepot?.r}`);
      console.log(`   ID: ${depot.ID || 'N/A'}`);
      console.log(`   Code: ${depot.MaDepot?.v || depot.MaDepot?.r || 'N/A'}`);
    });
    
    // Find depot with ID = 15 or name = TES
    console.log('\n' + '='.repeat(60));
    console.log('🔍 Looking for Depot ID 15 or TES');
    console.log('='.repeat(60));
    
    const depot15 = depots.find(d => d.ID === '15' || d.ID === 15);
    const depotTES = depots.find(d => 
      (d.TenDepot?.v || d.TenDepot?.r || '').includes('TES') ||
      (d.MaDepot?.v || d.MaDepot?.r || '').includes('TES')
    );
    
    if (depot15) {
      console.log('\n✅ Found Depot with ID 15:');
      console.log(JSON.stringify(depot15, null, 2));
    }
    
    if (depotTES) {
      console.log('\n✅ Found Depot with TES:');
      console.log(JSON.stringify(depotTES, null, 2));
    }
    
    if (!depot15 && !depotTES) {
      console.log('\n⚠️ Depot ID 15 or TES not found in depot list!');
      console.log('This means containers are in a depot not returned by iContainerHub_Depot API');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

checkDepotMapping().catch(console.error);
