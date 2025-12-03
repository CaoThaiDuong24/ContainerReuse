const axios = require('axios');

/**
 * Test script to check what data iContainerHub_LoaiCont API returns
 */

const API_URL = 'http://apiedepottest.gsotgroup.vn';
const REQID = 'iContainerHub_LoaiCont';

async function getToken() {
  try {
    console.log('🔑 Getting token...');
    const response = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: REQID,
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.token && response.data.reqtime) {
      console.log('✅ Token retrieved successfully');
      return {
        token: response.data.token,
        reqtime: response.data.reqtime
      };
    } else {
      console.error('❌ Invalid token response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to get token:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

async function testContainerTypeAPI() {
  try {
    console.log('\n========================================');
    console.log('Testing iContainerHub_LoaiCont API');
    console.log('========================================\n');

    // Get token
    const tokenData = await getToken();
    if (!tokenData) {
      console.error('❌ Cannot proceed without token');
      return;
    }

    // Call API
    console.log('\n📡 Calling iContainerHub_LoaiCont API...');
    console.log(`URL: ${API_URL}/api/data/process/${REQID}`);
    
    const response = await axios.post(`${API_URL}/api/data/process/${REQID}`, {
      reqid: REQID,
      token: tokenData.token,
      reqtime: tokenData.reqtime,
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('\n✅ API Response received');
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    if (response.data) {
      console.log('\n========================================');
      console.log('FULL API RESPONSE:');
      console.log('========================================');
      console.log(JSON.stringify(response.data, null, 2));
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log('\n========================================');
        console.log('DATA ANALYSIS:');
        console.log('========================================');
        console.log('📊 Total container types:', response.data.data.length);
        
        if (response.data.data.length > 0) {
          console.log('\n📋 FIRST ITEM (Sample):');
          console.log(JSON.stringify(response.data.data[0], null, 2));
          
          console.log('\n📋 FIELD NAMES FROM FIRST ITEM:');
          const firstItem = response.data.data[0];
          Object.keys(firstItem).forEach(key => {
            const value = firstItem[key];
            const type = typeof value;
            const actualValue = (type === 'object' && value !== null) 
              ? `{ v: "${value.v}", r: "${value.r}" }` 
              : value;
            console.log(`  - ${key}: ${type} = ${JSON.stringify(actualValue)}`);
          });
          
          // Show first 5 items
          console.log('\n📋 FIRST 5 ITEMS:');
          response.data.data.slice(0, 5).forEach((item, index) => {
            console.log(`\n  ${index + 1}. Container Type:`);
            Object.keys(item).forEach(key => {
              const value = item[key];
              const displayValue = (typeof value === 'object' && value !== null) 
                ? (value.v || value.r || JSON.stringify(value))
                : value;
              console.log(`     ${key}: ${displayValue}`);
            });
          });
        }
      } else {
        console.log('\n⚠️ No data array found in response');
      }
    } else {
      console.log('\n⚠️ No data in response');
    }

  } catch (error) {
    console.error('\n❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testContainerTypeAPI().then(() => {
  console.log('\n========================================');
  console.log('Test completed');
  console.log('========================================\n');
});
