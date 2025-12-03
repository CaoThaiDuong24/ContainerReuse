const axios = require('axios');

async function testFormats() {
  console.log('🧪 Testing different payload formats for Create_GateOut_Reuse\n');
  
  // Get token first
  const tokenRes = await axios.post('http://apiedepottest.gsotgroup.vn/api/data/util/gettokenNonAid', {
    reqid: 'Create_GateOut_Reuse',
    data: { appversion: '2023' }
  });
  
  const token = tokenRes.data.token;
  const reqtime = tokenRes.data.reqtime;
  console.log('✅ Token:', token.substring(0, 20) + '...');
  console.log('⏰ Reqtime:', reqtime, '\n');
  
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
    HangHoa: -1,
    appversion: '2023'
  };
  
  const formats = [
    {
      name: '1. Format with params',
      payload: {
        reqid: 'Create_GateOut_Reuse',
        token,
        reqtime,
        params: testData
      }
    },
    {
      name: '2. Format with data',
      payload: {
        reqid: 'Create_GateOut_Reuse',
        token,
        reqtime,
        data: testData
      }
    },
    {
      name: '3. Format with direct fields',
      payload: {
        reqid: 'Create_GateOut_Reuse',
        token,
        reqtime,
        ...testData
      }
    },
    {
      name: '4. Format with params (no appversion in data)',
      payload: {
        reqid: 'Create_GateOut_Reuse',
        token,
        reqtime,
        params: {
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
        }
      }
    }
  ];
  
  for (const fmt of formats) {
    try {
      console.log(`📤 Testing: ${fmt.name}`);
      const res = await axios.post(
        'http://apiedepottest.gsotgroup.vn/api/data/process/Create_GateOut_Reuse',
        fmt.payload
      );
      console.log('✅ SUCCESS!');
      console.log('Response:', JSON.stringify(res.data, null, 2));
      console.log('\n🎉 WORKING FORMAT FOUND!\n');
      break;
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.message;
      console.log(`❌ Failed: ${errorMsg}\n`);
    }
  }
}

testFormats().catch(console.error);
