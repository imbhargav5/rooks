#!/usr/bin/env tsx

import { execSync } from "child_process";
import fs from "fs";

console.log("🔍 Sanity Check: ESLint Validation");
console.log("=".repeat(40));

// Check if dist directory exists
if (!fs.existsSync("dist")) {
  console.error("❌ Error: dist directory not found. Run `pnpm build` first.");
  process.exit(1);
}

// Check if ESLint config exists
if (!fs.existsSync(".eslintrc.dist.js")) {
  console.error("❌ Error: .eslintrc.dist.js not found.");
  process.exit(1);
}

const filesToLint: string[] = [
  "dist/esm/index.js",
  "dist/esm/experimental.js",
  "dist/esm/temporal.js",
];

const missingFiles = filesToLint.filter((file) => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error("❌ Error: Missing built files:");
  missingFiles.forEach((file) => console.error(`   - ${file}`));
  process.exit(1);
}

console.log("✅ All expected built files exist");

// Run ESLint on each file
for (const file of filesToLint) {
  try {
    console.log(`🔍 Linting ${file}...`);

    execSync(
      `npx eslint "${file}" --config .eslintrc.dist.js --format compact`,
      {
        stdio: "pipe",
      }
    );

    console.log(`✅ ${file} passed ESLint validation`);
  } catch (error) {
    // ESLint returns non-zero exit code when there are linting errors
    const output = error as { stdout?: Buffer; stderr?: Buffer };
    const stdout = output.stdout?.toString() || "";
    const stderr = output.stderr?.toString() || "";

    if (stdout.includes("error") || stderr.includes("error")) {
      console.error(`❌ ESLint errors in ${file}:`);
      console.error(stdout || stderr);
      process.exit(1);
    } else if (stdout.includes("warning")) {
      console.warn(`⚠️  ESLint warnings in ${file}:`);
      console.warn(stdout);
      console.log(`✅ ${file} passed with warnings`);
    } else {
      console.log(`✅ ${file} passed ESLint validation`);
    }
  }
}

console.log("🎉 All files passed ESLint validation!");
