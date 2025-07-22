#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Running Comprehensive Sanity Checks');
console.log('='.repeat(50));

interface Check {
  name: string;
  script: string;
  description: string;
}

const checks: Check[] = [
  {
    name: 'ES Version Compliance',
    script: 'pnpm check:dist',
    description: 'Validate that built files comply with target ES version'
  },
  {
    name: 'TypeScript Definitions',
    script: 'npx tsx scripts/sanity-check-types.ts',
    description: 'Validate generated TypeScript definition files'
  },
  {
    name: 'Import Resolution',
    script: 'npx tsx scripts/sanity-check-imports.ts', 
    description: 'Test that CJS and ESM imports work correctly'
  },
  {
    name: 'ESLint Validation',
    script: 'npx tsx scripts/sanity-check-eslint.ts',
    description: 'Run ESLint on generated JavaScript files'
  }
];

let passedChecks = 0;
let failedChecks = 0;

async function runCheck(check: Check): Promise<boolean> {
  console.log(`\n📋 ${check.name}`);
  console.log(`   ${check.description}`);
  console.log('-'.repeat(30));
  
  try {
    execSync(check.script, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log(`✅ ${check.name} passed`);
    return true;
    
  } catch (error) {
    console.error(`❌ ${check.name} failed`);
    return false;
  }
}

async function runAllChecks(): Promise<void> {
  // Check if dist directory exists
  if (!fs.existsSync('dist')) {
    console.error('❌ Error: dist directory not found. Run `pnpm build` first.');
    process.exit(1);
  }
  
  console.log('Starting sanity checks...\n');
  
  for (const check of checks) {
    const passed = await runCheck(check);
    if (passed) {
      passedChecks++;
    } else {
      failedChecks++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Sanity Check Results:');
  console.log(`   ✅ Passed: ${passedChecks}`);
  console.log(`   ❌ Failed: ${failedChecks}`);
  console.log(`   📋 Total:  ${checks.length}`);
  
  if (failedChecks > 0) {
    console.log('\n❌ Some sanity checks failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All sanity checks passed!');
  }
}

runAllChecks().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
