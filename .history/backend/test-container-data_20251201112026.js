/**
 * Quick test để xem raw API data
 */

const { ContainerApiService } = require('./src/services/containerApiService.js');

async function test() {
  console.log('🧪 Testing Container API Service...\n');
  
  const service = new ContainerApiService();
  
  try {
    const containers = await service.getListReUseNow();
    
    if (!containers || containers.length === 0) {
      console.log('❌ No containers returned');
      return;
    }
    
    console.log(`✅ Got ${containers.length} containers\n`);
    
    // Show first 3 containers with depot info
    console.log('📦 Sample containers:\n');
    containers.slice(0, 3).forEach((c, i) => {
      console.log(`${i + 1}. Container ID: ${c.containerId}`);
      console.log(`   Depot ID: "${c.depotId}" (type: ${typeof c.depotId})`);
      console.log(`   Depot Name: ${c.depotName}`);
      console.log(`   Size: ${c.size}, Type: ${c.type}`);
      console.log('');
    });
    
    // Show depot distribution
    const depotMap = {};
    containers.forEach(c => {
      const did = String(c.depotId);
      if (!depotMap[did]) {
        depotMap[did] = { count: 0, name: c.depotName };
      }
      depotMap[did].count++;
    });
    
    console.log('📊 Containers per Depot:\n');
    Object.entries(depotMap)
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([id, info]) => {
        console.log(`   Depot ${id} (${info.name}): ${info.count} containers`);
      });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
