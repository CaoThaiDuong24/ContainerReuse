const axios = require('axios');

async function testTokenTypes() {
  const apiUrl = 'http://apiedepottest.gsotgroup.vn';
  
  console.log('=== Testing different token endpoints ===\n');
  
  // Test 1: gettokenNonAid
  console.log('1️⃣ Testing /api/data/util/gettokenNonAid');
  try {
    const res1 = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: 'Create_GateOut_Reuse',
      data: { appversion: '2023' }
    });
    console.log('✅ gettokenNonAid works:', res1.data);
  } catch (e) {
    console.log('❌ gettokenNonAid failed:', e.response?.data || e.message);
  }
  
  // Test 2: gettoken (with AID)
  console.log('\n2️⃣ Testing /api/data/util/gettoken');
  try {
    const res2 = await axios.post(`${apiUrl}/api/data/util/gettoken`, {
      reqid: 'Create_GateOut_Reuse',
      aid: 'testuser',  // Try with username/AID
      data: { appversion: '2023' }
    });
    console.log('✅ gettoken works:', res2.data);
  } catch (e) {
    console.log('❌ gettoken failed:', e.response?.data || e.message);
  }
  
  // Test 3: Try direct POST without token
  console.log('\n3️⃣ Testing direct POST to Create_GateOut_Reuse without token');
  try {
    const data = {
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
    
    const res3 = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, data);
    console.log('✅ Direct POST works:', res3.data);
  } catch (e) {
    console.log('❌ Direct POST failed:', e.response?.data || e.message);
  }
  
  // Test 4: Try with different reqid for token
  console.log('\n4️⃣ Testing with empty reqid for token');
  try {
    const res4 = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: '',
      data: { appversion: '2023' }
    });
    console.log('✅ Empty reqid token:', res4.data);
    
    // Try using this token
    const data = {
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
    
    const res5 = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, {
      reqid: 'Create_GateOut_Reuse',
      token: res4.data.token,
      reqtime: res4.data.reqtime,
      data: data
    });
    console.log('✅ Works with empty reqid token:', res5.data);
  } catch (e) {
    console.log('❌ Empty reqid approach failed:', e.response?.data || e.message);
  }
  
  // Test 5: List all available endpoints
  console.log('\n5️⃣ Testing if we can get endpoint list');
  try {
    const res6 = await axios.get(`${apiUrl}/api/data/util/help`);
    console.log('✅ Help endpoint:', res6.data);
  } catch (e) {
    console.log('❌ No help endpoint');
  }
}

testTokenTypes();
