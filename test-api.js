const http = require('http');

const baseUrl = 'http://localhost:3000';

// Test health endpoint
function testHealth() {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Health check:', JSON.parse(data));
        resolve();
      });
    }).on('error', reject);
  });
}

// Test get all users endpoint
function testGetUsers() {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}/api/users`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Get all users:', JSON.parse(data));
        resolve();
      });
    }).on('error', reject);
  });
}

// Test get user names endpoint
function testGetUserNames() {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}/api/users/names`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Get user names:', JSON.parse(data));
        resolve();
      });
    }).on('error', reject);
  });
}

// Run all tests
async function runTests() {
  try {
    console.log('🧪 Starting API tests...\n');
    
    await testHealth();
    await testGetUsers();
    await testGetUserNames();
    
    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if server is running
console.log('🚀 Testing Tiket API...');
console.log('Make sure the server is running with: npm run dev\n');

runTests();
