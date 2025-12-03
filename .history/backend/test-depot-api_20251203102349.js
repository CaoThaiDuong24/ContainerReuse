const axios = require('axios');

// Cấu hình API
const apiUrl = 'http://apiedepottest.gsotgroup.vn';
let token = null;
let reqtime = null;

// Lấy token
async function getToken() {
  try {
    console.log('🔑 Getting token...\n');
    
    const response = await axios.post(`${apiUrl}/api/data/util/gettokenNonAid`, {
      reqid: "iContainerHub_Depot",
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.token && response.data.reqtime) {
      token = response.data.token;
      reqtime = response.data.reqtime;
      console.log('✅ Token retrieved successfully');
      console.log('🔐 Token (first 30 chars):', token.substring(0, 30) + '...');
      console.log('⏰ Reqtime:', reqtime);
      console.log('\n' + '='.repeat(80) + '\n');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Failed to get token:', error.message);
    return false;
  }
}

// Lấy dữ liệu depot
async function getDepotData() {
  try {
    console.log('📡 Calling depot API...\n');
    
    const response = await axios.post(`${apiUrl}/api/data/process/iContainerHub_Depot`, {
      reqid: "iContainerHub_Depot",
      token: token,
      reqtime: reqtime,
      data: {
        appversion: '2023'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      console.log('✅ Depot data retrieved successfully\n');
      console.log('=' + '='.repeat(79) + '\n');
      console.log('📊 RAW API RESPONSE STRUCTURE:\n');
      console.log('Response keys:', Object.keys(response.data));
      console.log('\n' + '='.repeat(80) + '\n');
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log(`📍 Total depots: ${response.data.data.length}\n`);
        console.log('=' + '='.repeat(79) + '\n');
        
        // Hiển thị depot đầu tiên với đầy đủ thông tin
        if (response.data.data.length > 0) {
          console.log('📦 FIRST DEPOT - FULL DATA STRUCTURE:\n');
          const firstDepot = response.data.data[0];
          console.log(JSON.stringify(firstDepot, null, 2));
          console.log('\n' + '='.repeat(80) + '\n');
          
          // Liệt kê tất cả các fields
          console.log('📋 ALL FIELDS IN DEPOT OBJECT:\n');
          Object.keys(firstDepot).forEach(key => {
            const value = firstDepot[key];
            let displayValue = value;
            
            // Nếu là object {v: "", r: ""}, hiển thị cả 2 giá trị
            if (value && typeof value === 'object' && (value.v !== undefined || value.r !== undefined)) {
              displayValue = `{ v: "${value.v || ''}", r: "${value.r || ''}" }`;
            } else if (typeof value === 'object') {
              displayValue = JSON.stringify(value);
            }
            
            console.log(`  ${key}: ${displayValue}`);
          });
          console.log('\n' + '='.repeat(80) + '\n');
        }
        
        // Hiển thị tóm tắt 3 depot đầu tiên
        console.log('📝 SUMMARY OF FIRST 3 DEPOTS:\n');
        response.data.data.slice(0, 3).forEach((depot, index) => {
          const getValue = (field) => {
            if (!field) return '';
            return field.v || field.r || '';
          };
          
          console.log(`Depot ${index + 1}:`);
          console.log(`  ID: ${depot.ID}`);
          console.log(`  Name: ${getValue(depot.TenDepot)}`);
          console.log(`  Short Name: ${getValue(depot.TenVietTat)}`);
          console.log(`  Address: ${getValue(depot.DiaChi)}`);
          console.log(`  City Code: ${getValue(depot.ThanhPho)}`);
          console.log(`  Coordinates: ${getValue(depot.ToaDo)}`);
          console.log(`  Max Stock: ${getValue(depot.Maxstock)}`);
          console.log(`  Active: ${getValue(depot.Active)}`);
          console.log(`  Logo Path: ${getValue(depot.logo_inform_whm)}`);
          console.log('');
        });
        
        console.log('='.repeat(80) + '\n');
        
        // Thống kê các trường có trong depot
        console.log('📊 FIELD STATISTICS:\n');
        const fieldStats = {};
        response.data.data.forEach(depot => {
          Object.keys(depot).forEach(key => {
            if (!fieldStats[key]) {
              fieldStats[key] = { count: 0, hasValue: 0 };
            }
            fieldStats[key].count++;
            
            const value = depot[key];
            let hasValue = false;
            if (value && typeof value === 'object' && (value.v || value.r)) {
              hasValue = true;
            } else if (value) {
              hasValue = true;
            }
            if (hasValue) fieldStats[key].hasValue++;
          });
        });
        
        console.log('Field Name'.padEnd(30) + 'Total'.padEnd(10) + 'Has Value'.padEnd(15) + '%');
        console.log('-'.repeat(80));
        Object.entries(fieldStats)
          .sort((a, b) => b[1].hasValue - a[1].hasValue)
          .forEach(([key, stats]) => {
            const percent = ((stats.hasValue / stats.count) * 100).toFixed(1);
            console.log(
              key.padEnd(30) + 
              stats.count.toString().padEnd(10) + 
              stats.hasValue.toString().padEnd(15) + 
              percent + '%'
            );
          });
      }
      
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get depot data:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

// Main
async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 TESTING DEPOT API - DETAILED ANALYSIS');
  console.log('='.repeat(80) + '\n');
  
  const tokenSuccess = await getToken();
  if (!tokenSuccess) {
    console.error('Failed to get token. Exiting...');
    process.exit(1);
  }
  
  await getDepotData();
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ ANALYSIS COMPLETE');
  console.log('='.repeat(80) + '\n');
}

main();
