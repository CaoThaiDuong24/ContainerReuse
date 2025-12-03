const axios = require('axios');

async function testGateOut() {
  try {
    const apiUrl = 'http://apiedepottest.gsotgroup.vn';
    
    console.log('🔑 Getting token for Create_GateOut_Reuse...');
    const tokenRes = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: 'Create_GateOut_Reuse',
      data: {
        appversion: '2023'
      }
    });
    
    console.log('✅ Token received:', tokenRes.data);
    
    const gateOutData = {
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
    
    console.log('\n📡 Creating gate out with data:');
    console.log(JSON.stringify(gateOutData, null, 2));
    
    const res = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, {
      reqid: 'Create_GateOut_Reuse',
      token: tokenRes.data.token,
      reqtime: tokenRes.data.reqtime,
      data: gateOutData
    });
    
    console.log('\n✅ Success! Response:');
    console.log(JSON.stringify(res.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testGateOut();
