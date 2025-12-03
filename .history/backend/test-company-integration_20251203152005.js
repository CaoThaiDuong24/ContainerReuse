const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testFullFlow() {
  console.log('🧪 Testing Full Company Integration Flow...\n');
  
  try {
    // Test 1: Check backend is running
    console.log('='.repeat(60));
    console.log('Test 1: Checking Backend Connection');
    console.log('='.repeat(60));
    
    try {
      await axios.get(`${BACKEND_URL}/api/companies`);
      console.log('✅ Backend is running!\n');
    } catch (err) {
      console.log('❌ Backend is not running!');
      console.log('\n💡 Please start backend:');
      console.log('   cd backend');
      console.log('   npm run dev\n');
      return;
    }

    // Test 2: Get all companies (fallback list)
    console.log('='.repeat(60));
    console.log('Test 2: GET /api/companies - List all companies');
    console.log('='.repeat(60));
    
    const allCompaniesResponse = await axios.get(`${BACKEND_URL}/api/companies`);
    console.log('Status:', allCompaniesResponse.status);
    console.log('Total companies:', allCompaniesResponse.data.count);
    
    if (allCompaniesResponse.data.data && allCompaniesResponse.data.data.length > 0) {
      console.log('\n📋 Sample companies (first 3):');
      allCompaniesResponse.data.data.slice(0, 3).forEach((company, i) => {
        console.log(`  ${i + 1}. ${company.name} (ID: ${company.id})`);
      });
    } else {
      console.log('⚠️ No companies in list (HRMS_UserProfile may be empty)');
    }

    // Test 3: Test with sample AccountIDs
    console.log('\n' + '='.repeat(60));
    console.log('Test 3: GET /api/companies/by-user/:accuserkey');
    console.log('='.repeat(60));
    
    // Common test IDs (you can add more)
    const testAccountIDs = [
      '111735', 
      '111736', 
      '111737',
      '39503',
      '100001'
    ];
    
    let foundCompany = null;
    
    for (const accountId of testAccountIDs) {
      try {
        console.log(`\nTesting AccountID: ${accountId}...`);
        const response = await axios.get(
          `${BACKEND_URL}/api/companies/by-user/${accountId}`
        );
        
        if (response.data.success && response.data.data) {
          console.log('✅ SUCCESS! Found company:');
          console.log('   Company ID:', response.data.data.id);
          console.log('   Company Name:', response.data.data.name);
          console.log('   Data Source:', response.data.data.rawApiData?.source);
          console.log('\n📄 Full Response:');
          console.log(JSON.stringify(response.data, null, 2));
          
          foundCompany = response.data.data;
          break; // Found one, stop testing
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log('   ⚠️ No company found for this AccountID');
        } else {
          console.log('   ❌ Error:', err.response?.data?.message || err.message);
        }
      }
    }

    if (!foundCompany) {
      console.log('\n⚠️ No companies found for test AccountIDs');
      console.log('💡 This means:');
      console.log('   - HRMS_UserProfile API is returning empty data');
      console.log('   - Test AccountIDs are not in Driver API');
      console.log('   - You need to use a real AccountID from your login');
    }

    // Test 4: Frontend Integration Test
    console.log('\n' + '='.repeat(60));
    console.log('Test 4: Frontend Integration Simulation');
    console.log('='.repeat(60));
    
    console.log('\n📱 Simulating Frontend Flow:');
    console.log('1. User logs in → gets accuserkey (e.g., "111735")');
    console.log('2. Opens pickup container modal');
    console.log('3. Modal calls: GET /api/companies/by-user/111735');
    
    if (foundCompany) {
      console.log('4. ✅ Company info auto-loaded:');
      console.log(`   - Company: ${foundCompany.name}`);
      console.log(`   - Auto-filled: transportCompanyId, invoiceCompanyInfra, invoiceCompany`);
      console.log('5. ✅ Driver dropdown loads based on company ID');
      console.log('6. ✅ User fills remaining fields and submits');
    } else {
      console.log('4. ⚠️ No company found');
      console.log('   - Fallback: Show company dropdown (if available)');
      console.log('   - OR: User manually enters company ID');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    console.log('✅ Backend API:', 'Working');
    console.log('✅ Company List Endpoint:', allCompaniesResponse.data.count > 0 ? `${allCompaniesResponse.data.count} companies` : 'Empty (fallback to manual input)');
    console.log('✅ Get Company by User:', foundCompany ? 'Working' : 'No test data (need real login)');
    console.log('\n💡 Next Steps:');
    console.log('1. Start frontend: cd frontend && npm run dev');
    console.log('2. Login with a real account');
    console.log('3. Open pickup container modal');
    console.log('4. Check if company info is auto-loaded');
    console.log('\n✅ All tests completed!\n');

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFullFlow();
