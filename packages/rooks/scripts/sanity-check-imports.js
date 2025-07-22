#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Sanity Check: Import Resolution');
console.log('='.repeat(40));

// Check if dist directory exists
if (!fs.existsSync('dist')) {
  console.error('❌ Error: dist directory not found. Run `pnpm build` first.');
  process.exit(1);
}

// Test files to create
const tests = [
  {
    name: 'CJS Main Import',
    file: 'temp-cjs-main.js',
    content: `
const { useCounter } = require('./dist/cjs/index.js');
console.log('✅ CJS main import successful:', typeof useCounter);
`
  },
  {
    name: 'CJS Experimental Import',
    file: 'temp-cjs-experimental.js', 
    content: `
const { useSuspenseNavigatorUserAgentData } = require('./dist/cjs/experimental.js');
console.log('✅ CJS experimental import successful:', typeof useSuspenseNavigatorUserAgentData);
`
  },
  {
    name: 'ESM Main Import (Basic Check)',
    file: 'temp-esm-main.mjs',
    content: `
// Basic check that the ESM file can be parsed and has exports
import fs from 'fs';
const content = fs.readFileSync('./dist/esm/index.js', 'utf8');
if (content.includes('export') && content.includes('useCounter')) {
  console.log('✅ ESM main file has proper exports structure');
} else {
  throw new Error('ESM main file missing expected exports');
}
`
  },
  {
    name: 'ESM Experimental Import (Basic Check)',
    file: 'temp-esm-experimental.mjs',
    content: `
// Basic check that the ESM experimental file can be parsed and has exports  
import fs from 'fs';
const content = fs.readFileSync('./dist/esm/experimental.js', 'utf8');
if (content.includes('export') && content.includes('useSuspenseNavigatorUserAgentData')) {
  console.log('✅ ESM experimental file has proper exports structure');
} else {
  throw new Error('ESM experimental file missing expected exports');
}
`
  }
];

const createdFiles = [];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Testing ${test.name}...`);
    
    try {
      // Write test file
      fs.writeFileSync(test.file, test.content);
      createdFiles.push(test.file);
      
      // Run the test
      const child = spawn('node', [test.file], { 
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(stdout.trim());
          resolve();
        } else {
          console.error(`❌ ${test.name} failed:`);
          console.error(stderr || stdout);
          reject(new Error(`${test.name} failed with code ${code}`));
        }
      });
      
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message);
      reject(error);
    }
  });
}

async function runAllTests() {
  try {
    for (const test of tests) {
      await runTest(test);
    }
    console.log('🎉 All import resolution tests passed!');
  } catch (error) {
    console.error('❌ Import resolution tests failed');
    process.exit(1);
  } finally {
    // Clean up test files
    createdFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  }
}

runAllTests();
