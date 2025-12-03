const axios = require('axios');

async function testDifferentTokens() {
  console.log('🧪 Testing Create_GateOut_Reuse with tokens from different reqids\n');
  
  const testData = {
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
  
  // Different reqids to try for getting token
  const reqidsToTry = [
    'Create_GateOut_Reuse',
    'GetListReUse_Now',
    'Get_GateOut_CMA_RELEASE',
    'iContainerHub_Depot',
    'GetDepot'
  ];
  
  for (const tokenReqid of reqidsToTry) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📝 Trying with token from reqid: ${tokenReqid}`);
      console.log(`${'='.repeat(60)}`);
      
      // Get token
      const tokenRes = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/util/gettokenNonAid', {
        reqid: tokenReqid,
        data: { appversion: '2023' }
      });
      
      const token = tokenRes.data.token;
      const reqtime = tokenRes.data.reqtime;
      console.log('✅ Token obtained:', token.substring(0, 20) + '...');
      console.log('⏰ Reqtime:', reqtime);
      
      // Try with params format
      try {
        console.log('\n📤 Calling Create_GateOut_Reuse with params...');
        const res = await axios.post(
          'http://apiedepottest.gsotgroup.vn/api/data/process/Create_GateOut_Reuse',
          {
            reqid: 'Create_GateOut_Reuse',
            token,
            reqtime,
            params: testData
          }
        );
        console.log('✅ SUCCESS WITH PARAMS!');
        console.log('Response:', JSON.stringify(res.data, null, 2));
        console.log(`\n🎉 WORKING TOKEN REQID FOUND: ${tokenReqid}`);
        console.log('🎉 WORKING FORMAT: params');
        return;
      } catch (e1) {
        console.log('❌ params failed:', e1.response?.data?.error || e1.message);
        
        // Try with data format
        try {
          console.log('📤 Calling Create_GateOut_Reuse with data...');
          const res = await axios.post(
            'http://apiedepottest.gsotgroup.vn/api/data/process/Create_GateOut_Reuse',
            {
              reqid: 'Create_GateOut_Reuse',
              token,
              reqtime,
              data: { ...testData, appversion: '2023' }
            }
          );
          console.log('✅ SUCCESS WITH DATA!');
          console.log('Response:', JSON.stringify(res.data, null, 2));
          console.log(`\n🎉 WORKING TOKEN REQID FOUND: ${tokenReqid}`);
          console.log('🎉 WORKING FORMAT: data');
          return;
        } catch (e2) {
          console.log('❌ data failed:', e2.response?.data?.error || e2.message);
        }
      }
    } catch (error) {
      console.log(`❌ Error getting token for ${tokenReqid}:`, error.message);
    }
  }
  
  console.log('\n\n❌ No working combination found!');
  console.log('💡 Possible reasons:');
  console.log('   - API requires special permissions/authentication');
  console.log('   - Account does not have access to Create_GateOut_Reuse');
  console.log('   - API endpoint may not be active or accessible');
}

testDifferentTokens().catch(console.error);
