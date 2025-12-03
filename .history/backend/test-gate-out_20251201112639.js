const axios = require('axios');

async function testGateOut() {
  try {
    const apiUrl = 'http://apiedepottest.gsotgroup.vn';
    
    // Test 1: Try with exact data from user's requirement
    console.log('\n=== TEST 1: With exact sample data ===');
    console.log('🔑 Getting token for Create_GateOut_Reuse...');
    
    let tokenRes = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: 'Create_GateOut_Reuse',
      data: {
        appversion: '2023'
      }
    });
    
    console.log('✅ Token:', tokenRes.data.token);
    console.log('✅ Reqtime:', tokenRes.data.reqtime);
    
    let gateOutData = {
      HangTauID: 11,
      ContTypeSizeID: 14,
      SoChungTuNhapBai: 'SGN0002222',
      DonViVanTaiID: 39503,
      SoXe: '93H-0000',
      NguoiTao: 111735,
      CongTyInHoaDon_PhiHaTang: 90750,
      CongTyInHoaDon: 90750,
      DepotID: 15,
      SoLuongCont: 1,
      HangHoa: -1
    };
    
    console.log('\n📡 Request payload:');
    const payload = {
      reqid: 'Create_GateOut_Reuse',
      token: tokenRes.data.token,
      reqtime: tokenRes.data.reqtime,
      data: gateOutData
    };
    console.log(JSON.stringify(payload, null, 2));
    
    try {
      const res = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, payload);
      console.log('\n✅ Success! Response:');
      console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('\n❌ Test 1 Failed:', err.response?.data || err.message);
    }
    
    // Test 2: Try getting list first to see real container data
    console.log('\n\n=== TEST 2: Get real container data first ===');
    tokenRes = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: 'GetListReUse_Now',
      data: { appversion: '2023' }
    });
    
    const listRes = await axios.post(`${apiUrl}/api/data/process/GetListReUse_Now`, {
      reqid: 'GetListReUse_Now',
      token: tokenRes.data.token,
      reqtime: tokenRes.data.reqtime,
      data: { appversion: '2023' }
    });
    
    const containers = listRes.data.data;
    console.log(`✅ Found ${containers.length} containers`);
    
    if (containers.length > 0) {
      const firstContainer = containers[0];
      console.log('\n📦 First container data:');
      console.log(JSON.stringify(firstContainer, null, 2));
      
      console.log('\n📋 Extracted fields for gate out:');
      console.log('HangTauID:', firstContainer.HangTauID);
      console.log('ContTypeSizeID:', firstContainer.ContTypeSizeID);
      console.log('DepotID:', firstContainer.DepotID);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testGateOut();
