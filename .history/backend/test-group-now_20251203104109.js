// Test GetListReUse_Group_Now API
const { ContainerApiService } = require('./src/services/containerApiService.js');

async function testGroupNowAPI() {
  console.log('🧪 Testing GetListReUse_Group_Now API...\n');
  
  const service = new ContainerApiService();
  
  try {
    console.log('📡 Calling getListReUseGroupNow()...');
    const containers = await service.getListReUseGroupNow();
    
    if (containers && containers.length > 0) {
      console.log(`\n✅ Success! Retrieved ${containers.length} containers`);
      console.log('\n📦 First container:');
      console.log(JSON.stringify(containers[0], null, 2));
      
      console.log('\n📊 Summary:');
      const depotGroups = {};
      containers.forEach(c => {
        depotGroups[c.depotId] = (depotGroups[c.depotId] || 0) + 1;
      });
      console.log('Containers by depot:', depotGroups);
    } else {
      console.log('\n⚠️ No containers returned');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGroupNowAPI();
