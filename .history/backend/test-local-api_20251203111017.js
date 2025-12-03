const http = require('http');

function testAPI() {
  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/iContainerHub_HangTau',
    method: 'GET',
    timeout: 10000
  };

  console.log('🔍 Testing API:', `http://${options.hostname}:${options.port}${options.path}`);

  const req = http.request(options, (res) => {
    console.log('✅ Status Code:', res.statusCode);
    console.log('📊 Headers:', res.headers);

    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('\n📦 Response:');
        console.log('  Success:', json.success);
        console.log('  Count:', json.count);
        
        if (json.data && json.data.length > 0) {
          console.log('\n🔍 First 3 shipping lines:');
          json.data.slice(0, 3).forEach((line, index) => {
            console.log(`\n  [${index + 1}] ${line.name} (${line.code})`);
            console.log(`      ID: ${line.id}`);
            console.log(`      Full Name: ${line.fullName}`);
            console.log(`      Phone: ${line.phone}`);
            console.log(`      Logo: ${line.logo}`);
            console.log(`      Color: ${line.colorTemplate}`);
            console.log(`      Status: ${line.status}`);
          });
        }
      } catch (error) {
        console.error('❌ Error parsing JSON:', error.message);
        console.log('Raw data:', data.substring(0, 500));
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
    console.error('❌ Error code:', error.code);
  });

  req.on('timeout', () => {
    console.error('❌ Request timeout');
    req.abort();
  });

  req.end();
}

// Wait a bit for server to be ready
setTimeout(testAPI, 2000);
