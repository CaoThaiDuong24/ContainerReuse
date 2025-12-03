const axios = require('axios');

async function testLocalAPI() {
  try {
    console.log('🔍 Testing Local Backend API - Depot City Names\n');
    
    const response = await axios.get('http://localhost:5000/api/iContainerHub_Depot');
    
    const depots = response.data.data;
    
    console.log('✅ Received', depots.length, 'depots\n');
    console.log('ID'.padEnd(8) + 'Name'.padEnd(30) + 'Province'.padEnd(25) + 'Status');
    console.log('-'.repeat(90));
    
    depots.forEach(depot => {
      console.log(
        depot.id.toString().padEnd(8) +
        (depot.location || depot.name).substring(0, 28).padEnd(30) +
        (depot.province || '').padEnd(25) +
        depot.status
      );
    });
    
    console.log('\n📊 Summary by Province:\n');
    const byProvince = {};
    depots.forEach(d => {
      const prov = d.province || 'Unknown';
      byProvince[prov] = (byProvince[prov] || 0) + 1;
    });
    
    Object.entries(byProvince)
      .sort((a, b) => b[1] - a[1])
      .forEach(([province, count]) => {
        console.log(`  ${province}: ${count} depot(s)`);
      });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testLocalAPI();
