const axios = require('axios');

const API_URL = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';

/**
 * Test HRMS_UserProfile API - Check what data it returns
 */
async function testHRMSUserProfile() {
  console.log('🔍 Kiểm tra API HRMS_UserProfile đang trả về thông tin gì...\n');
  console.log('=' .repeat(80));

  const testAccountID = '39503';

  try {
    // Step 1: Get token WITH AccountID
    console.log('\n📡 Step 1: Getting token for HRMS_UserProfile...');
    console.log(`   Including AccountID: ${testAccountID.substring(0, 30)}...`);
    
    const tokenResponse = await axios.post(`${API_URL}/api/data/util/gettokenNonAid`, {
      reqid: 'HRMS_UserProfile',
      data: {
        appversion: '2023',
        AccountID: testAccountID
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (!tokenResponse.data || !tokenResponse.data.token) {
      throw new Error('❌ Failed to get token');
    }

    console.log('✅ Token received successfully');
    console.log(`   Token length: ${tokenResponse.data.token.length} characters`);

    // Step 2: Call HRMS_UserProfile API with AccountID...
    console.log('\n📡 Step 2: Calling HRMS_UserProfile API with AccountID...');
    
    const apiResponse = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
      reqid: 'HRMS_UserProfile',
      token: tokenResponse.data.token,
      reqtime: tokenResponse.data.reqtime,
      data: {
        appversion: '2023',
        AccountID: testAccountID
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 RESPONSE FROM HRMS_UserProfile API (WITH AccountID):');
    console.log('='.repeat(80));

    const allResponseData = allDataResponse.data;
    
    // Display basic info
    console.log(`\n✅ Result: ${allResponseData.result}`);
    console.log(`📦 Data type: ${Array.isArray(allResponseData.data) ? 'Array' : typeof allResponseData.data}`);
    console.log(`📈 Total records: ${allResponseData.data?.length || 0}`);

    // Try WITHOUT AccountID to get all data
    console.log('\n' + '='.repeat(80));
    console.log('📡 Step 3: Trying WITHOUT AccountID (get all records)...');
    console.log('='.repeat(80));
    
    const allDataResponse = await axios.post(`${API_URL}/api/data/process/HRMS_UserProfile`, {
      reqid: 'HRMS_UserProfile',
      token: tokenResponse.data.token,
      reqtime: tokenResponse.data.reqtime,
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 RESPONSE FROM HRMS_UserProfile API (WITHOUT AccountID):');
    console.log('='.repeat(80));

    const allResponseData = allDataResponse.data;
    
    // Display basic info
    console.log(`\n✅ Result: ${responseData.result}`);
    console.log(`📦 Data type: ${Array.isArray(responseData.data) ? 'Array' : typeof responseData.data}`);
    console.log(`📈 Total records: ${responseData.data?.length || 0}`);

    if (responseData.data && responseData.data.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('📋 SAMPLE RECORD (First item):');
      console.log('='.repeat(80));
      
      const firstRecord = responseData.data[0];
      console.log(JSON.stringify(firstRecord, null, 2));

      // Analyze fields
      console.log('\n' + '='.repeat(80));
      console.log('🔍 AVAILABLE FIELDS IN DATA:');
      console.log('='.repeat(80));
      
      const fields = Object.keys(firstRecord);
      fields.forEach((field, index) => {
        const value = firstRecord[field];
        let displayValue = value;
        
        // Handle complex values
        if (value && typeof value === 'object') {
          if (value.v !== undefined) displayValue = value.v;
          else if (value.r !== undefined) displayValue = value.r;
        }
        
        console.log(`${(index + 1).toString().padStart(2)}. ${field.padEnd(25)} : ${JSON.stringify(displayValue)}`);
      });

      // Summary
      console.log('\n' + '='.repeat(80));
      console.log('📊 SUMMARY:');
      console.log('='.repeat(80));
      console.log(`Total records returned: ${responseData.data.length}`);
      console.log(`Total fields per record: ${fields.length}`);
      console.log(`Fields: ${fields.join(', ')}`);

      // Show more samples if available
      if (responseData.data.length > 1) {
        console.log('\n' + '='.repeat(80));
        console.log(`📋 SHOWING ${Math.min(5, responseData.data.length)} SAMPLE RECORDS:`);
        console.log('='.repeat(80));
        
        for (let i = 0; i < Math.min(5, responseData.data.length); i++) {
          const record = responseData.data[i];
          console.log(`\nRecord ${i + 1}:`);
          
          // Show key fields only
          const keyFields = ['ID', 'AccountID', 'UserID', 'Name', 'FullName', 'CompanyID', 'CompanyName', 'Email', 'Phone'];
          keyFields.forEach(field => {
            if (record[field] !== undefined) {
              let value = record[field];
              if (value && typeof value === 'object') {
                value = value.v || value.r || JSON.stringify(value);
              }
              console.log(`  ${field}: ${value}`);
            }
          });
        }
      }

    } else {
      console.log('\n⚠️  API returned EMPTY data array');
      console.log('\nFull Response:');
      console.log(JSON.stringify(responseData, null, 2));
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Test completed successfully');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the test
testHRMSUserProfile();
