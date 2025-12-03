const axios = require('axios');

async function testRealDepotData() {
  console.log('='.repeat(60));
  console.log('🔍 Testing Real Depot Data from API');
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
    console.log('\n📡 Fetching depots from API...');
    const depotResponse = await axios.post(`${apiUrl}/api/data/process/iContainerHub_Depot`, {
      reqid: "iContainerHub_Depot",
      token: token,
      reqtime: reqtime,
      data: { appversion: '2023' }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('\n📦 RAW API Response Structure:');
    console.log('Keys:', Object.keys(depotResponse.data));
    console.log('Result:', depotResponse.data.result);
    console.log('Data type:', typeof depotResponse.data.data);
    console.log('Data is array:', Array.isArray(depotResponse.data.data));
    console.log('Data length:', depotResponse.data.data?.length);
    
    const depots = depotResponse.data.data || [];
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 FIRST 3 DEPOTS - RAW DATA');
    console.log('='.repeat(60));
    
    depots.slice(0, 3).forEach((depot, index) => {
      console.log(`\n${index + 1}. DEPOT RAW DATA:`);
      console.log(JSON.stringify(depot, null, 2));
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TRANSFORMED DATA (như backend sẽ trả về)');
    console.log('='.repeat(60));
    
    const getValue = (field) => {
      if (!field) return '';
      return field.v || field.r || '';
    };
    
    const transformedDepots = depots.slice(0, 5).map(depot => {
      // ID field là string trực tiếp, không có cấu trúc {v, r}
      const depotId = depot.ID;
        
      return {
        id: depotId,
        name: getValue(depot.TenDepot) || getValue(depot.TenVietTat) || 'Unknown Depot',
        location: getValue(depot.TenVietTat),
        address: getValue(depot.DiaChi),
        capacity: parseInt(getValue(depot.Maxstock)) || 0,
        status: getValue(depot.Active) === 'True' ? 'active' : 'inactive',
        province: getValue(depot.ThanhPho)
      };
    });
    
    console.log('\nFirst 5 transformed depots:');
    console.log(JSON.stringify(transformedDepots, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 CHECKING SPECIFIC DEPOT - ID 15 (TestDepot)');
    console.log('='.repeat(60));
    
    const depot15 = depots.find(d => d.ID === '15' || d.ID === 15);
    if (depot15) {
      console.log('\n✅ Depot ID 15 found:');
      console.log('  Name:', getValue(depot15.TenDepot));
      console.log('  Short Name:', getValue(depot15.TenVietTat));
      console.log('  ID:', depot15.ID);
      console.log('  Active:', getValue(depot15.Active));
      console.log('  Maxstock:', getValue(depot15.Maxstock));
      console.log('  Address:', getValue(depot15.DiaChi));
    } else {
      console.log('\n❌ Depot ID 15 NOT FOUND');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total depots from API: ${depots.length}`);
    console.log(`Active depots: ${depots.filter(d => getValue(d.Active) === 'True').length}`);
    console.log(`Inactive depots: ${depots.filter(d => getValue(d.Active) !== 'True').length}`);
    console.log(`Depots with ID: ${depots.filter(d => d.ID !== undefined && d.ID !== null && d.ID !== '').length}`);
    console.log(`Depots without ID: ${depots.filter(d => !d.ID || d.ID === '').length}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testRealDepotData().catch(console.error);
