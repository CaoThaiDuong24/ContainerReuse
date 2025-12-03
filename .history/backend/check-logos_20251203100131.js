const axios = require('axios');

async function checkDepotLogos() {
  try {
    const response = await axios.get('http://localhost:5000/api/iContainerHub_Depot');
    const depots = response.data.data;
    
    console.log('=== DEPOT LOGOS ===\n');
    
    const withLogo = [];
    const withoutLogo = [];
    
    depots.forEach(depot => {
      if (depot.logo && depot.logo.length > 0 && !depot.logo.includes('unsplash')) {
        withLogo.push(depot);
      } else {
        withoutLogo.push(depot);
      }
    });
    
    console.log(`Depots with logo from API: ${withLogo.length}`);
    withLogo.forEach(d => {
      console.log(`  ✓ ${d.name}`);
      console.log(`    ${d.logo.substring(0, 80)}`);
    });
    
    console.log(`\nDepots without logo: ${withoutLogo.length}`);
    withoutLogo.forEach(d => {
      console.log(`  ✗ ${d.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDepotLogos();
