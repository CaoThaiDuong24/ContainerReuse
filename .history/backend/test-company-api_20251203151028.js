const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testCompanyAPI() {
  console.log('🧪 Testing Company API...\n');
  
  try {
    // Test 1: Get all companies
    console.log('='.repeat(60));
    console.log('Test 1: GET /api/companies - Get all companies');
    console.log('='.repeat(60));
    
    const allCompanies = await axios.get(`${BACKEND_URL}/api/companies`);
    console.log('✅ Status:', allCompanies.status);
    console.log('📊 Total companies:', allCompanies.data.count);
    
    if (allCompanies.data.data && allCompanies.data.data.length > 0) {
      console.log('\n📋 Sample companies (first 5):');
      allCompanies.data.data.slice(0, 5).forEach((company, i) => {
        console.log(`  ${i + 1}. ID: ${company.id}, Name: ${company.name}`);
      });
    }

    // Test 2: Get specific company by ID
    if (allCompanies.data.data && allCompanies.data.data.length > 0) {
      const companyId = allCompanies.data.data[0].id;
      
      console.log('\n' + '='.repeat(60));
      console.log(`Test 2: GET /api/companies/${companyId} - Get company by ID`);
      console.log('='.repeat(60));
      
      const company = await axios.get(`${BACKEND_URL}/api/companies/${companyId}`);
      console.log('✅ Status:', company.status);
      console.log('📋 Company data:');
      console.log(JSON.stringify(company.data.data, null, 2));
    }

    // Test 3: Login first to get accuserkey
    console.log('\n' + '='.repeat(60));
    console.log('Test 3: Login to get accuserkey');
    console.log('='.repeat(60));
    
    // Try common test accounts
    const testAccounts = [
      { username: 'admin', password: 'admin123' },
      { username: 'test', password: 'test123' },
      { username: 'user', password: 'user123' }
    ];

    let loginData = null;
    
    for (const account of testAccounts) {
      try {
        console.log(`\nTrying login with: ${account.username}`);
        const login = await axios.post(`${BACKEND_URL}/api/auth/login`, account);
        
        if (login.data && login.data.accuserkey) {
          console.log('✅ Login successful!');
          console.log('Username:', login.data.username);
          console.log('Accuserkey:', login.data.accuserkey);
          loginData = login.data;
          break;
        }
      } catch (err) {
        console.log(`❌ Login failed: ${err.response?.data?.error || err.message}`);
      }
    }

    // Test 4: Get company by user ID
    if (loginData && loginData.accuserkey) {
      console.log('\n' + '='.repeat(60));
      console.log(`Test 4: GET /api/companies/by-user/${loginData.accuserkey}`);
      console.log('='.repeat(60));
      
      try {
        const userCompany = await axios.get(
          `${BACKEND_URL}/api/companies/by-user/${loginData.accuserkey}`
        );
        
        console.log('✅ Status:', userCompany.status);
        console.log('📋 User company data:');
        console.log(JSON.stringify(userCompany.data.data, null, 2));
      } catch (err) {
        console.log('❌ Error:', err.response?.data?.message || err.message);
        console.log('Response:', err.response?.data);
      }
    } else {
      console.log('\n⚠️ Skipping Test 4: No valid login credentials');
      console.log('💡 To test by-user endpoint, use a valid accuserkey from login');
    }

    // Test 5: Cache stats
    console.log('\n' + '='.repeat(60));
    console.log('Test 5: GET /api/companies/cache-stats');
    console.log('='.repeat(60));
    
    const cacheStats = await axios.get(`${BACKEND_URL}/api/companies/cache-stats`);
    console.log('✅ Status:', cacheStats.status);
    console.log('📊 Cache statistics:');
    console.log(JSON.stringify(cacheStats.data.data, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Check if backend is running first
async function checkBackend() {
  try {
    await axios.get(`${BACKEND_URL}/api/companies`);
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if backend is running...\n');
  
  const isRunning = await checkBackend();
  
  if (!isRunning) {
    console.error('❌ Backend is not running on', BACKEND_URL);
    console.log('\n💡 Please start the backend first:');
    console.log('   cd backend');
    console.log('   npm start\n');
    process.exit(1);
  }
  
  console.log('✅ Backend is running!\n');
  await testCompanyAPI();
}

main();
