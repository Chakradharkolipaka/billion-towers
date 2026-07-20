#!/usr/bin/env node

/**
 * Test script to verify server header size limits
 * Run: node test-header-limits.js
 */

const http = require('http');

console.log('\n=== HTTP Header Size Limit Test ===\n');

// Check current process arguments
if (process.execArgv.length > 0) {
  console.log('✅ Node started with flags:', process.execArgv.join(' '));
} else {
  console.log('⚠️  No special Node flags detected');
}

// Check http.maxHeaderSize
console.log('\nCurrent http.maxHeaderSize:', http.maxHeaderSize || 'default (16KB)');

// Recommended settings
const recommended = 327680; // 320KB
const current = http.maxHeaderSize || 16384;

if (current >= recommended) {
  console.log(`✅ Header size limit is sufficient: ${current} bytes (${(current/1024).toFixed(0)}KB)`);
} else {
  console.log(`❌ Header size limit too small: ${current} bytes (${(current/1024).toFixed(0)}KB)`);
  console.log(`   Recommended: ${recommended} bytes (${(recommended/1024).toFixed(0)}KB)`);
  console.log('\n   Fix: Restart server with:');
  console.log('   npm run backend');
  console.log('   OR');
  console.log('   node --max-http-header-size=327680 server/server.js');
}

// Test if server is running
console.log('\n--- Testing Backend Connection ---\n');

const testServer = () => {
  const req = http.request({
    hostname: 'localhost',
    port: 3099,
    path: '/api/health',
    method: 'GET',
    timeout: 2000
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Backend is running on http://localhost:3099');
        try {
          const health = JSON.parse(data);
          console.log(`✅ Database: ${health.database}`);
          console.log(`✅ Message: ${health.message}`);
        } catch (e) {
          console.log('⚠️  Health check returned non-JSON response');
        }
      } else {
        console.log(`⚠️  Backend responded with status ${res.statusCode}`);
      }
    });
  });

  req.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log('❌ Backend is NOT running');
      console.log('   Start with: npm run backend');
    } else {
      console.log('❌ Connection error:', err.message);
    }
  });

  req.on('timeout', () => {
    console.log('⚠️  Request timed out');
    req.destroy();
  });

  req.end();
};

testServer();

console.log('\n--- Quick Fixes for 431 Errors ---\n');
console.log('1. Clear browser cookies (F12 → Application → Clear site data)');
console.log('2. Restart backend: npm run backend');
console.log('3. Hard refresh browser: Ctrl+Shift+R (Cmd+Shift+R on Mac)');
console.log('4. Try incognito mode to test without extensions');
console.log('\nSee CLEAR_COOKIES.md for detailed instructions.\n');
