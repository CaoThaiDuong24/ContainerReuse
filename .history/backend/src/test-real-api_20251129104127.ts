import depotApiService from './services/depotApiService';

/**
 * Test script để kiểm tra kết nối với API thực
 */
async function testRealApi() {
  console.log('🧪 Testing Real Depot API Connection...\n');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Get Token
    console.log('\n1️⃣ Testing Token Retrieval...');
    const tokenSuccess = await depotApiService['getToken']();
    if (tokenSuccess) {
      console.log('✅ Token retrieved successfully');
    } else {
      console.log('❌ Failed to get token');
      console.log('⚠️ Make sure EXTERNAL_API_URL is set correctly in .env');
      return;
    }

    // Test 2: Get Raw Depot Data
    console.log('\n2️⃣ Testing Raw Depot Data Retrieval...');
    const rawData = await depotApiService['getDepotData']();
    if (rawData) {
      console.log('✅ Raw data retrieved successfully');
      console.log('📊 Data structure:', JSON.stringify(rawData, null, 2).substring(0, 500) + '...');
    } else {
      console.log('❌ Failed to get depot data');
      return;
    }

    // Test 3: Get Transformed Depot Data
    console.log('\n3️⃣ Testing Transformed Depot Data...');
    const depots = await depotApiService.fetchDepots();
    console.log(`✅ Retrieved ${depots.length} depots`);
    
    if (depots.length > 0) {
      console.log('\n📦 Sample Depot:');
      console.log(JSON.stringify(depots[0], null, 2));
    }

    // Test 4: Get Statistics
    console.log('\n4️⃣ Testing Statistics...');
    const stats = await depotApiService.getStatistics();
    console.log('✅ Statistics:');
    console.log(JSON.stringify(stats, null, 2));

    // Test 5: Get Provinces
    console.log('\n5️⃣ Testing Provinces...');
    const provinces = await depotApiService.getProvinces();
    console.log(`✅ Found ${provinces.length} provinces:`, provinces);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if EXTERNAL_API_URL is set correctly in .env');
    console.error('   2. Verify the API endpoint is accessible');
    console.error('   3. Check if token endpoint is working');
    console.error('   4. Review API response format');
  }
}

// Chạy test
console.log('Starting Real API Test...');
console.log('Make sure to set EXTERNAL_API_URL in .env file\n');

testRealApi().then(() => {
  console.log('\nTest completed.');
  process.exit(0);
}).catch((error) => {
  console.error('Test error:', error);
  process.exit(1);
});
