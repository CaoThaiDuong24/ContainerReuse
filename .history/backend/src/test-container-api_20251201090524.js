const { ContainerApiService } = require('./services/containerApiService.js');

async function testContainerApi() {
  console.log('='.repeat(60));
  console.log('🧪 Testing GetListReUse_Now API - Check Depots');
  console.log('='.repeat(60));
  
  const containerApiService = new ContainerApiService();
  
  try {
    const result = await containerApiService.getListReUseNow();
    
    if (!result || !Array.isArray(result)) {
      console.log('❌ No data returned from API');
      return;
    }
    
    console.log(`\n✅ Received ${result.length} containers\n`);
    console.log('='.repeat(60));
    console.log('📦 CONTAINER LIST WITH DEPOT INFO');
    console.log('='.repeat(60));
    
    result.forEach((container, index) => {
      console.log(`\n${index + 1}. Container: ${container.containerId}`);
      console.log(`   Depot ID: ${container.depotId}`);
      console.log(`   Depot Name: ${container.depotName}`);
      console.log(`   Owner: ${container.owner}`);
      console.log(`   Size: ${container.size}`);
      console.log(`   Type: ${container.type}`);
      console.log(`   Status: ${container.status}`);
      if (container.estimatedOutDate) {
        console.log(`   Est. Out Date: ${container.estimatedOutDate}`);
      }
    });
    
    // Group by depot
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY BY DEPOT');
    console.log('='.repeat(60));
    
    const depotGroups = result.reduce((acc, container) => {
      const depotKey = `${container.depotId} - ${container.depotName}`;
      if (!acc[depotKey]) {
        acc[depotKey] = [];
      }
      acc[depotKey].push(container);
      return acc;
    }, {});
    
    Object.entries(depotGroups).forEach(([depot, containers]) => {
      console.log(`\n🏢 ${depot}`);
      console.log(`   Containers: ${containers.length}`);
      console.log(`   IDs: ${containers.map(c => c.containerId).join(', ')}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testContainerApi().catch(console.error);
