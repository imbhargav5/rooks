#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Sanity Check: TypeScript Definition Files');
console.log('='.repeat(50));

// Check if dist directory exists
if (!fs.existsSync('dist')) {
  console.error('❌ Error: dist directory not found. Run `pnpm build` first.');
  process.exit(1);
}

// Check if type definition files exist
const typeFiles = [
  'dist/esm/index.d.ts',
  'dist/esm/experimental.d.ts'
];

const missingFiles = typeFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Error: Missing type definition files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

console.log('✅ All expected .d.ts files exist');

// Create a temporary TypeScript file to test imports
const testFile = 'temp-type-test.ts';
const testContent = `
// Test main exports
import { useCounter } from './dist/esm/index.js';

// Test experimental exports  
import { useSuspenseNavigatorUserAgentData } from './dist/esm/experimental.js';

// Test that types are properly exported
const hook1: typeof useCounter = useCounter;
const hook2: typeof useSuspenseNavigatorUserAgentData = useSuspenseNavigatorUserAgentData;

console.log('Types resolved successfully');
`;

try {
  // Write test file
  fs.writeFileSync(testFile, testContent);
  
  // Run TypeScript compiler on test file
  console.log('🔍 Testing type resolution...');
  execSync(`npx tsc --noEmit --skipLibCheck --moduleResolution node --esModuleInterop ${testFile}`, { 
    stdio: 'pipe' 
  });
  
  console.log('✅ TypeScript definitions are valid and imports resolve correctly');
  
} catch (error) {
  console.error('❌ TypeScript validation failed:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
} finally {
  // Clean up test file
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
}

// Additional validation: Check for common issues in .d.ts files
console.log('🔍 Checking for common type definition issues...');

typeFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for missing exports
  if (!content.includes('export')) {
    console.error(`❌ Error: ${file} has no exports`);
    process.exit(1);
  }
  
  // Check for syntax errors (basic check)
  if (content.includes('export {') && !content.includes('} from')) {
    // This is a re-export, check it's properly formatted
    const reExportRegex = /export\s*{\s*[^}]+\s*}\s*from\s*["'][^"']+["']/;
    if (!reExportRegex.test(content)) {
      console.warn(`⚠️  Warning: ${file} may have malformed re-exports`);
    }
  }
  
  console.log(`✅ ${file} passed basic validation`);
});

console.log('🎉 All TypeScript definition files are valid!');
