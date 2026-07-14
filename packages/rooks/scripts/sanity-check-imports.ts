#!/usr/bin/env tsx

import { spawn } from "child_process";
import fs from "fs";

console.log("🔍 Sanity Check: Import Resolution");
console.log("=".repeat(40));

// Check if dist directory exists
if (!fs.existsSync("dist")) {
  console.error("❌ Error: dist directory not found. Run `pnpm build` first.");
  process.exit(1);
}

// Test files to create
interface TestCase {
  name: string;
  file: string;
  content: string;
}

const tests: TestCase[] = [
  {
    name: "ESM Main Import",
    file: "temp-esm-main.mjs",
    content: `
import { useCounter } from './dist/esm/index.js';
if (typeof useCounter !== 'function') {
  throw new Error('ESM main entrypoint did not export useCounter');
}
console.log('✅ ESM main entrypoint imported useCounter');
`,
  },
  {
    name: "ESM Experimental Import",
    file: "temp-esm-experimental.mjs",
    content: `
import { useVirtualList } from './dist/esm/experimental.js';
if (typeof useVirtualList !== 'function') {
  throw new Error('ESM experimental entrypoint did not export useVirtualList');
}
console.log('✅ ESM experimental entrypoint imported useVirtualList');
`,
  },
  {
    name: "ESM Temporal Import",
    file: "temp-esm-temporal.mjs",
    content: `
import { useTemporalNow } from './dist/esm/temporal.js';
if (typeof useTemporalNow !== 'function') {
  throw new Error('ESM Temporal entrypoint did not export useTemporalNow');
}
console.log('✅ ESM Temporal entrypoint imported useTemporalNow');
`,
  },
];

const createdFiles: string[] = [];

async function runTest(test: TestCase): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Testing ${test.name}...`);

    try {
      // Write test file
      fs.writeFileSync(test.file, test.content);
      createdFiles.push(test.file);

      // Run the test
      const child = spawn("node", [test.file], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: process.cwd(),
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
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

async function runAllTests(): Promise<void> {
  try {
    for (const test of tests) {
      await runTest(test);
    }
    console.log("🎉 All import resolution tests passed!");
  } catch (error) {
    console.error("❌ Import resolution tests failed");
    process.exit(1);
  } finally {
    // Clean up test files
    createdFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  }
}

runAllTests();
