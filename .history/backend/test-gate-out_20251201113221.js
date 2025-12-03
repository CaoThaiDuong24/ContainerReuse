const axios = require('axios');

async function testGateOut() {
  try {
    const apiUrl = 'http://apiedepottest.gsotgroup.vn';
    
    // Test different approaches
    console.log('\n=== TEST 1: Try without specific reqid in token ===');
    try {
      let tokenRes = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
        reqid: 'Create_GateOut_Reuse',
        data: {
          appversion: '2023'
        }
      });
      
      console.log('Token response:', tokenRes.data);
      
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
      
      // Try different request structures
      console.log('\n📡 Trying format 1: Standard with token...');
      try {
        const res1 = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, {
          reqid: 'Create_GateOut_Reuse',
          token: tokenRes.data.token,
          reqtime: tokenRes.data.reqtime,
          data: gateOutData
        });
        console.log('✅ Format 1 Success:', JSON.stringify(res1.data, null, 2));
        return;
      } catch (e1) {
        console.log('❌ Format 1 Failed:', e1.response?.data?.error || e1.message);
      }
      
      console.log('\n📡 Trying format 2: Direct data without token...');
      try {
        const res2 = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, gateOutData);
        console.log('✅ Format 2 Success:', JSON.stringify(res2.data, null, 2));
        return;
      } catch (e2) {
        console.log('❌ Format 2 Failed:', e2.response?.data?.error || e2.message);
      }
      
      console.log('\n📡 Trying format 3: Data wrapped in data field...');
      try {
        const res3 = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, {
          data: gateOutData
        });
        console.log('✅ Format 3 Success:', JSON.stringify(res3.data, null, 2));
        return;
      } catch (e3) {
        console.log('❌ Format 3 Failed:', e3.response?.data?.error || e3.message);
      }
      
      console.log('\n📡 Trying format 4: With appversion in data...');
      try {
        const res4 = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, {
          reqid: 'Create_GateOut_Reuse',
          token: tokenRes.data.token,
          reqtime: tokenRes.data.reqtime,
          data: {
            ...gateOutData,
            appversion: '2023'
          }
        });
        console.log('✅ Format 4 Success:', JSON.stringify(res4.data, null, 2));
        return;
      } catch (e4) {
        console.log('❌ Format 4 Failed:', e4.response?.data?.error || e4.message);
      }
      
    } catch (err) {
      console.error('Test 1 failed:', err.message);
    }
    
    // Test 2: Check if there's documentation
    console.log('\n\n=== TEST 2: Get container list to verify field names ===');
    const tokenRes2 = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: 'GetListReUse_Now',
      data: { appversion: '2023' }
    });
    
    const listRes = await axios.post(`${apiUrl}/api/data/process/GetListReUse_Now`, {
      reqid: 'GetListReUse_Now',
      token: tokenRes2.data.token,
      reqtime: tokenRes2.data.reqtime,
      data: { appversion: '2023' }
    });
    
    if (listRes.data.data && listRes.data.data.length > 0) {
      const cont = listRes.data.data[0];
      console.log('\n📦 Sample container for reference:');
      console.log('HangTauID:', cont.HangTauID);
      console.log('ContTypeSizeID:', cont.ContTypeSizeID);
      console.log('DepotID:', cont.DepotID);
      console.log('Container ID:', cont.ContID);
      
      // Try with real container data
      console.log('\n📡 Trying with real container data...');
      const tokenRes3 = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
        reqid: 'Create_GateOut_Reuse',
        data: { appversion: '2023' }
      });
      
      const realGateOutData = {
        HangTauID: parseInt(cont.HangTauID?.v || cont.HangTauID?.r),
        ContTypeSizeID: parseInt(cont.ContTypeSizeID?.v || cont.ContTypeSizeID?.r),
        SoChungTuNhapBai: 'SGN0002222',
        DonViVanTaiID: 39503,
        SoXe: '93H-0000',
        NguoiTao: 111735,
        CongTyInHoaDon_PhiHaTang: 90750,
        CongTyInHoaDon: 90750,
        DepotID: parseInt(cont.DepotID?.v || cont.DepotID?.r),
        SoLuongCont: 1,
        HangHoa: -1
      };
      
      console.log('Data:', JSON.stringify(realGateOutData, null, 2));
      
      try {
        const res = await axios.post(`${apiUrl}/api/data/process/Create_GateOut_Reuse`, {
          reqid: 'Create_GateOut_Reuse',
          token: tokenRes3.data.token,
          reqtime: tokenRes3.data.reqtime,
          data: realGateOutData
        });
        console.log('✅ Success with real data:', JSON.stringify(res.data, null, 2));
      } catch (e) {
        console.log('❌ Failed with real data:', e.response?.data || e.message);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testGateOut();
