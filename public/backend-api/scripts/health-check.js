#!/usr/bin/env node
/**
 * ==============================================
 * Health Check Script for Cron Jobs
 * ==============================================
 * 
 * Run via cron to monitor API status:
 * */5 * * * * cd /home/username/api && node scripts/health-check.js
 * 
 * Or use with email alerts:
 * */5 * * * * cd /home/username/api && node scripts/health-check.js || mail -s "API Alert" admin@domain.com
 */

const http = require('http');
const https = require('https');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/health';
const TIMEOUT = 10000; // 10 seconds

/**
 * Perform health check
 */
const checkHealth = () => {
  return new Promise((resolve, reject) => {
    const protocol = API_URL.startsWith('https') ? https : http;
    
    const req = protocol.get(API_URL, { timeout: TIMEOUT }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            if (json.status === 'ok') {
              resolve({ success: true, data: json });
            } else {
              reject(new Error(`API unhealthy: ${JSON.stringify(json)}`));
            }
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${data}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(new Error(`Connection failed: ${err.message}`));
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout after ${TIMEOUT}ms`));
    });
  });
};

/**
 * Main execution
 */
const main = async () => {
  const timestamp = new Date().toISOString();
  
  try {
    const result = await checkHealth();
    console.log(`[${timestamp}] ✅ API healthy:`, JSON.stringify(result.data));
    process.exit(0);
  } catch (error) {
    console.error(`[${timestamp}] ❌ API check failed:`, error.message);
    process.exit(1);
  }
};

main();
