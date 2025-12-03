const axios = require('axios');

const apiUrl = 'http://apiedepottest.gsotgroup.vn';

async function testDVVanTaiField() {
  try {
    console.log('🔍 Checking for DVVanTaiID_CMS field...\n');
    
    // Get token
    const tokenResponse = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: "HRMS_UserProfile",
      data: {
        appversion: '2023',
        AccountID: 111735
      }
    });

    const token = tokenResponse.data.token;
    const reqtime = tokenResponse.data.reqtime;
    
    // Call HRMS_UserProfile API
    const response = await axios.post(`${apiUrl}/api/data/process/HRMS_UserProfile`, {
      reqid: "HRMS_UserProfile",
      token: token,
      reqtime: reqtime,
      data: {
        appversion: '2023',
        AccountID: 111735
      }
    });

    const user = response.data.data[0];
    
    console.log('📊 Field Check Results:');
    console.log('=' .repeat(50));
    
    const getValue = (field) => {
      if (!field) return '❌ NOT EXISTS';
      if (typeof field === 'string') return field || '⚠️ EMPTY STRING';
      return field.v || field.r || '⚠️ EMPTY OBJECT';
    };
    
    console.log(`DVVanTaiID_CMS:  ${getValue(user.DVVanTaiID_CMS)}`);
    console.log(`DonViVanTaiID:   ${getValue(user.DonViVanTaiID)}`);
    console.log(`CompanyID:       ${getValue(user.CompanyID)}`);
    console.log(`NhaXeID:         ${getValue(user.NhaXeID)}`);
    console.log(`AccountGroupID:  ${getValue(user.AccountGroupID)}`);
    
    console.log('\n📋 All Available Fields:');
    console.log('=' .repeat(50));
    console.log(Object.keys(user).join(', '));
    
    // Check if DVVanTaiID_CMS exists
    if (user.DVVanTaiID_CMS !== undefined) {
      console.log('\n✅ DVVanTaiID_CMS field EXISTS in API response');
      console.log('   Value:', JSON.stringify(user.DVVanTaiID_CMS, null, 2));
    } else {
      console.log('\n❌ DVVanTaiID_CMS field DOES NOT EXIST in API response');
      console.log('   Backend should use fallback fields');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDVVanTaiField();
