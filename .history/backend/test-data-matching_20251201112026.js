/**
 * Test script để kiểm tra depot ID matching giữa depot và container data
 */

const http = require('http');

function fetchData(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('🔍 Fetching depot data...');
    const depotResponse = await fetchData('/api/iContainerHub_Depot');
    const depots = depotResponse.data || [];
    
    console.log('🔍 Fetching container data...');
    const containerResponse = await fetchData('/api/containers/reuse-now');
    const containers = containerResponse.data || [];
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total depots: ${depots.length}`);
    console.log(`   Total containers: ${containers.length}`);
    
    console.log(`\n🏢 Depot IDs:`);
    const depotIds = depots.map(d => d.id);
    console.log(`   ${depotIds.join(', ')}`);
    
    console.log(`\n📦 Container Depot IDs (unique):`);
    const containerDepotIds = [...new Set(containers.map(c => c.depotId))];
    console.log(`   ${containerDepotIds.join(', ')}`);
    
    console.log(`\n🔍 Matching Analysis:`);
    depots.forEach(depot => {
      const matchingContainers = containers.filter(c => String(c.depotId) === String(depot.id));
      console.log(`   Depot ${depot.id} (${depot.name}):`);
      console.log(`      - Expected containers: ${depot.containerCount}`);
      console.log(`      - Actual containers: ${matchingContainers.length}`);
      if (matchingContainers.length > 0) {
        console.log(`      - Sample container IDs: ${matchingContainers.slice(0, 3).map(c => c.containerId).join(', ')}`);
      }
      if (matchingContainers.length !== depot.containerCount) {
        console.log(`      ⚠️ MISMATCH DETECTED!`);
      }
    });
    
    console.log(`\n🚨 Orphan Containers (containers with unknown depot):`);
    const orphans = containers.filter(c => !depotIds.includes(String(c.depotId)));
    if (orphans.length > 0) {
      console.log(`   Found ${orphans.length} orphan containers`);
      orphans.slice(0, 5).forEach(c => {
        console.log(`   - Container ${c.containerId}: depotId="${c.depotId}" (${typeof c.depotId})`);
      });
    } else {
      console.log(`   No orphan containers found ✅`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
