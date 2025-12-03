const axios = require('axios');

const apiUrl = 'http://apiedepottest.gsotgroup.vn';

async function checkHRMSUserProfileFields() {
  try {
    console.log('🔍 Kiểm tra thông tin API HRMS_UserProfile trả về\n');
    console.log('📋 Request: AccountID = 111735\n');
    
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

    if (!response.data.data || response.data.data.length === 0) {
      console.log('❌ API không trả về dữ liệu');
      return;
    }

    const user = response.data.data[0];
    
    const getValue = (field) => {
      if (field === undefined || field === null) return null;
      if (typeof field === 'string') return field || '(empty string)';
      if (typeof field === 'object') {
        return field.v !== undefined ? field.v : field.r !== undefined ? field.r : JSON.stringify(field);
      }
      return field;
    };
    
    console.log('✅ API Response - Chi tiết các fields:\n');
    console.log('=' .repeat(80));
    
    // Group fields by category
    const fieldGroups = {
      'Thông tin cơ bản': ['ID', 'AccountID', 'TenHT', 'Email', 'SoDT', 'MaNV'],
      'Thông tin công ty/đơn vị': ['DVVanTaiID_CMS', 'DonViVanTaiID', 'CompanyID', 'NhaXeID', 'AccountGroupID'],
      'Thông tin cá nhân': ['NgaySinh', 'SoCMND', 'GioiTinh', 'DiaChi'],
      'Thông tin hệ thống': ['Language', 'DepotAllow', 'DefaultLink', 'NgayDangKy'],
      'Khác': []
    };
    
    // Categorize all fields
    const allFields = Object.keys(user);
    const categorizedFields = new Set();
    
    Object.keys(fieldGroups).forEach(category => {
      if (category !== 'Khác') {
        fieldGroups[category].forEach(f => categorizedFields.add(f));
      }
    });
    
    allFields.forEach(field => {
      if (!categorizedFields.has(field)) {
        fieldGroups['Khác'].push(field);
      }
    });
    
    // Display by category
    Object.keys(fieldGroups).forEach(category => {
      const fields = fieldGroups[category];
      if (fields.length === 0) return;
      
      console.log(`\n📌 ${category}:`);
      console.log('-'.repeat(80));
      
      fields.forEach(fieldName => {
        const value = getValue(user[fieldName]);
        const exists = user[fieldName] !== undefined;
        const hasValue = value && value !== '(empty string)';
        
        const status = !exists ? '❌ Không có' : !hasValue ? '⚠️ Rỗng' : '✅';
        const displayValue = !exists ? 'Field không tồn tại' : value || '(empty)';
        
        console.log(`  ${status} ${fieldName.padEnd(25)} : ${displayValue}`);
      });
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 Tổng kết:');
    console.log(`  - Tổng số fields: ${allFields.length}`);
    console.log(`  - Fields có giá trị: ${allFields.filter(f => getValue(user[f]) && getValue(user[f]) !== '(empty string)').length}`);
    console.log(`  - Fields rỗng: ${allFields.filter(f => user[f] !== undefined && (!getValue(user[f]) || getValue(user[f]) === '(empty string)')).length}`);
    console.log(`  - Fields không tồn tại: ${fieldGroups['Thông tin công ty/đơn vị'].filter(f => user[f] === undefined).length} (trong nhóm công ty)`);
    
    console.log('\n🔍 Các field liên quan đến Đơn vị vận tải:');
    console.log('-'.repeat(80));
    const transportFields = ['DVVanTaiID_CMS', 'DonViVanTaiID', 'CompanyID', 'NhaXeID', 'AccountGroupID'];
    transportFields.forEach(field => {
      const exists = user[field] !== undefined;
      const value = getValue(user[field]);
      const hasValue = value && value !== '(empty string)';
      
      if (!exists) {
        console.log(`  ❌ ${field}: KHÔNG TỒN TẠI trong response`);
      } else if (!hasValue) {
        console.log(`  ⚠️ ${field}: Tồn tại nhưng RỖNG - Value: ${JSON.stringify(user[field])}`);
      } else {
        console.log(`  ✅ ${field}: ${value} ← CÓ THỂ DÙNG`);
      }
    });
    
    console.log('\n💡 Kết luận:');
    console.log('-'.repeat(80));
    const usableField = transportFields.find(f => user[f] !== undefined && getValue(user[f]) && getValue(user[f]) !== '(empty string)');
    if (usableField) {
      console.log(`  ✅ Có thể sử dụng field: ${usableField} = ${getValue(user[usableField])}`);
    } else {
      console.log(`  ❌ KHÔNG có field nào chứa thông tin đơn vị vận tải hợp lệ`);
      console.log(`  💡 Đề xuất: Cần cập nhật dữ liệu trong database hoặc sử dụng AccountGroupID`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

checkHRMSUserProfileFields();
