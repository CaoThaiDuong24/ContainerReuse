/**
 * Test script for Create_GateOut_Reuse API
 * Run with: node backend/src/test-gate-out.js
 */

const { ContainerApiService } = require('./services/containerApiService.js');

async function testGateOutAPI() {
  console.log('🧪 Testing Create_GateOut_Reuse API');
  console.log('=====================================\n');
  
  const containerApiService = new ContainerApiService();
  
  // Test data matching the structure from the user's request
  const testData = {
    HangTauID: 11,
    ContTypeSizeID: 14,
    SoChungTuNhapBai: "SGN0002222",  // booking number
    DonViVanTaiID: 39503,
    SoXe: "93H-0000",
    NguoiTao: 111735,
    CongTyInHoaDon_PhiHaTang: 90750,
    CongTyInHoaDon: 90750,
    DepotID: 15,
    SoLuongCont: 1,
    HangHoa: -1
  };
  
  console.log('📦 Test Data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');
  
  try {
    console.log('🚀 Calling createGateOut...\n');
    const result = await containerApiService.createGateOut(testData);
    
    console.log('\n📊 Final Result:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ SUCCESS: Gate out created successfully!');
    } else {
      console.log('\n❌ FAILED: Gate out creation failed');
      console.log('Error:', result.error);
      if (result.errorCode) {
        console.log('Error Code:', result.errorCode);
      }
      if (result.apiResponse) {
        console.log('API Response:', JSON.stringify(result.apiResponse, null, 2));
      }
    }
  } catch (error) {
    console.error('\n❌ EXCEPTION:', error.message);
    console.error(error);
  }
  
  console.log('\n=====================================');
  console.log('🏁 Test completed');
}

// Run the test
testGateOutAPI();
