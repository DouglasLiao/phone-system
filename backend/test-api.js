const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && method === 'POST') {
      data = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data && method === 'POST') {
      req.write(data);
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 TESTANDO BACKEND API\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Health Check...');
    const health = await testEndpoint('/health');
    console.log(`✅ Status: ${health.status}`);
    console.log(`📊 Response:`, JSON.stringify(health.data, null, 2));
    console.log('');

    // Test 2: Subscription Plans
    console.log('2️⃣ Subscription Plans...');
    const plans = await testEndpoint('/api/subscription-plans');
    console.log(`✅ Status: ${plans.status}`);
    console.log(`📋 Plans:`, JSON.stringify(plans.data, null, 2));
    console.log('');

    // Test 3: Get Phone Lines (empty)
    console.log('3️⃣ Get Phone Lines (empty)...');
    const phoneLines = await testEndpoint('/api/phone-lines');
    console.log(`✅ Status: ${phoneLines.status}`);
    console.log(`📱 Phone Lines:`, JSON.stringify(phoneLines.data, null, 2));
    console.log('');

    // Test 4: Create Phone Line
    console.log('4️⃣ Create Phone Line...');
    const newPhoneLine = await testEndpoint('/api/phone-lines', 'POST', {
      areaCode: 41,
      subscriptionPlanId: 1,
      idempotencyKey: 'test-key-123'
    });
    console.log(`✅ Status: ${newPhoneLine.status}`);
    console.log(`📱 Created:`, JSON.stringify(newPhoneLine.data, null, 2));
    console.log('');

    // Test 5: Get Phone Lines (with data)
    console.log('5️⃣ Get Phone Lines (with data)...');
    const phoneLinesAfter = await testEndpoint('/api/phone-lines');
    console.log(`✅ Status: ${phoneLinesAfter.status}`);
    console.log(`📱 Count: ${phoneLinesAfter.data.count}`);
    console.log('');

    // Test 6: Filter by Area Code
    console.log('6️⃣ Filter by Area Code (41)...');
    const filteredLines = await testEndpoint('/api/phone-lines?areaCode=41');
    console.log(`✅ Status: ${filteredLines.status}`);
    console.log(`📱 Filtered Count: ${filteredLines.data.count}`);
    console.log('');

    // Test 7: Idempotency Test
    console.log('7️⃣ Idempotency Test (same key)...');
    const duplicateRequest = await testEndpoint('/api/phone-lines', 'POST', {
      areaCode: 41,
      subscriptionPlanId: 2,
      idempotencyKey: 'test-key-123'
    });
    console.log(`✅ Status: ${duplicateRequest.status}`);
    console.log(`📱 Should return same line:`, duplicateRequest.data.data.id);
    console.log('');

    // Test 8: Invalid Request
    console.log('8️⃣ Invalid Request (bad area code)...');
    const invalidRequest = await testEndpoint('/api/phone-lines', 'POST', {
      areaCode: 999,
      subscriptionPlanId: 1
    });
    console.log(`✅ Status: ${invalidRequest.status}`);
    console.log(`❌ Error:`, JSON.stringify(invalidRequest.data, null, 2));

    console.log('\n🎉 TODOS OS TESTES CONCLUÍDOS!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

runTests();