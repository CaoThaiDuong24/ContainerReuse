const axios = require('axios');

// API Base URL
const API_URL = 'http://localhost:5000';

// Test depot API endpoints
async function testDepotAPI() {
  console.log('🧪 Testing Depot API Endpoints...\n');

  try {
    // Test 1: Get all depots
    console.log('1️⃣ Testing GET /api/iContainerHub_Depot (Get all depots)');
    console.log('Request: GET', `${API_URL}/api/iContainerHub_Depot`);
    const allDepotsResponse = await axios.get(`${API_URL}/api/iContainerHub_Depot`);
    console.log('✅ Response:', {
      success: allDepotsResponse.data.success,
      count: allDepotsResponse.data.count,
      sampleData: allDepotsResponse.data.data.slice(0, 2).map(d => ({
        id: d.id,
        name: d.name,
        province: d.province,
        containerCount: d.containerCount,
        capacity: d.capacity
      }))
    });
    console.log('\n');

    // Test 2: Get depot statistics
    console.log('2️⃣ Testing GET /api/iContainerHub_Depot/statistics');
    const statsResponse = await axios.get(`${API_URL}/api/iContainerHub_Depot/statistics`);
    console.log('✅ Response:', statsResponse.data);
    console.log('\n');

    // Test 3: Get all provinces
    console.log('3️⃣ Testing GET /api/iContainerHub_Depot/provinces');
    const provincesResponse = await axios.get(`${API_URL}/api/iContainerHub_Depot/provinces`);
    console.log('✅ Response:', provincesResponse.data);
    console.log('\n');

    // Test 4: Get depot by ID
    console.log('4️⃣ Testing GET /api/iContainerHub_Depot/:id (Get depot by ID)');
    const depotId = 'DEPOT001';
    console.log('Request: GET', `${API_URL}/api/iContainerHub_Depot/${depotId}`);
    const depotResponse = await axios.get(`${API_URL}/api/iContainerHub_Depot/${depotId}`);
    console.log('✅ Response:', depotResponse.data);
    console.log('\n');

    // Test 5: Filter by province
    console.log('5️⃣ Testing GET /api/iContainerHub_Depot?province=TP. Hồ Chí Minh');
    const filterResponse = await axios.get(`${API_URL}/api/iContainerHub_Depot`, {
      params: { province: 'TP. Hồ Chí Minh' }
    });
    console.log('✅ Response:', {
      success: filterResponse.data.success,
      count: filterResponse.data.count,
      depots: filterResponse.data.data.map(d => d.name)
    });
    console.log('\n');

    // Test 6: Search depot
    console.log('6️⃣ Testing GET /api/iContainerHub_Depot?search=LONG GIANG');
    const searchResponse = await axios.get(`${API_URL}/api/iContainerHub_Depot`, {
      params: { search: 'LONG GIANG' }
    });
    console.log('✅ Response:', {
      success: searchResponse.data.success,
      count: searchResponse.data.count,
      depots: searchResponse.data.data.map(d => d.name)
    });
    console.log('\n');

    // Test 7: Create new depot (POST)
    console.log('7️⃣ Testing POST /api/iContainerHub_Depot (Create depot)');
    const newDepot = {
      name: 'DEPOT TEST',
      location: 'Test Location',
      address: 'Test Address 123',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55',
      containerCount: 50,
      capacity: 100,
      status: 'active',
      province: 'TP. Hồ Chí Minh'
    };
    const createResponse = await axios.post(`${API_URL}/api/iContainerHub_Depot`, newDepot);
    console.log('✅ Response:', createResponse.data);
    const createdDepotId = createResponse.data.data.id;
    console.log('\n');

    // Test 8: Update depot (PUT)
    console.log('8️⃣ Testing PUT /api/iContainerHub_Depot/:id (Update depot)');
    const updateData = {
      containerCount: 75,
      capacity: 150
    };
    const updateResponse = await axios.put(`${API_URL}/api/iContainerHub_Depot/${createdDepotId}`, updateData);
    console.log('✅ Response:', updateResponse.data);
    console.log('\n');

    // Test 9: Delete depot (DELETE)
    console.log('9️⃣ Testing DELETE /api/iContainerHub_Depot/:id (Delete depot)');
    const deleteResponse = await axios.delete(`${API_URL}/api/iContainerHub_Depot/${createdDepotId}`);
    console.log('✅ Response:', deleteResponse.data);
    console.log('\n');

    console.log('🎉 ALL TESTS PASSED! API is working correctly.\n');
    console.log('📊 Summary:');
    console.log(`   - Total depots: ${allDepotsResponse.data.count}`);
    console.log(`   - Total provinces: ${provincesResponse.data.count}`);
    console.log(`   - Total containers: ${statsResponse.data.data.totalContainers}`);
    console.log(`   - Total capacity: ${statsResponse.data.data.totalCapacity}`);
    console.log(`   - Utilization rate: ${statsResponse.data.data.utilizationRate}%`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run tests
console.log('Starting Depot API tests...');
console.log('Make sure the backend server is running on http://localhost:5000\n');
testDepotAPI();
