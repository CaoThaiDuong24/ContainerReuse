const { ContainerApiService } = require('./services/containerApiService.js');

async function testContainerApi() {
  console.log('='.repeat(60));
  console.log('🧪 Testing GetListReUse_Now API');
  console.log('='.repeat(60));
  
  const containerApiService = new ContainerApiService();
  
  try {
    const result = await containerApiService.getListReUseNow();
    
    console.log('\n📦 API Response:');
    console.log('='.repeat(60));
    
    if (!result) {
      console.log('❌ No data returned from API');
      return;
    }
    
    console.log('✅ Data received!');
    console.log('\n📊 Response structure:');
    console.log('Type:', typeof result);
    console.log('Is Array:', Array.isArray(result));
    console.log('Keys:', Object.keys(result));
    
    // Check different possible data structures
    if (Array.isArray(result)) {
      console.log('\n✅ Direct array');
      console.log('Length:', result.length);
      if (result.length > 0) {
        console.log('\n🔍 First item:');
        console.log(JSON.stringify(result[0], null, 2));
      }
    } else if (result.data) {
      console.log('\n✅ Has .data property');
      console.log('Type of data:', typeof result.data);
      console.log('Is data array:', Array.isArray(result.data));
      
      if (Array.isArray(result.data)) {
        console.log('Data length:', result.data.length);
        if (result.data.length > 0) {
          console.log('\n🔍 First item:');
          console.log(JSON.stringify(result.data[0], null, 2));
        }
      } else {
        console.log('Data content:', result.data);
      }
    } else {
      console.log('\n📝 Full response:');
      console.log(JSON.stringify(result, null, 2));
    }
    
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
