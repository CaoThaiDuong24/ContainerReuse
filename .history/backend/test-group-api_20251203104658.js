const axios = require('axios');

async function testGroupAPI() {
  console.log('\n========================================');
  console.log('Testing GetListReUse_Group_Now API');
  console.log('========================================\n');

  try {
    const response = await axios.get('http://localhost:5000/api/containers');
    
    console.log('✅ SUCCESS!');
    console.log(`Status: ${response.data.success}`);
    console.log(`Total Containers: ${response.data.count}`);
    console.log('\nFirst 3 containers:');
    response.data.data.slice(0, 3).forEach((container, index) => {
      console.log(`\n${index + 1}. ID: ${container.id}`);
      console.log(`   Container ID: ${container.containerId}`);
      console.log(`   Size: ${container.size}, Type: ${container.type}`);
      console.log(`   Depot: ${container.depotName} (ID: ${container.depotId})`);
      console.log(`   Owner: ${container.owner}`);
    });

    // Count by depot
    const depotCounts = {};
    response.data.data.forEach(c => {
      depotCounts[c.depotId] = (depotCounts[c.depotId] || 0) + 1;
    });
    
    console.log('\n📊 Distribution by Depot:');
    Object.entries(depotCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([depotId, count]) => {
        console.log(`   Depot ${depotId}: ${count} containers`);
      });

    console.log('\n========================================\n');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testGroupAPI();
