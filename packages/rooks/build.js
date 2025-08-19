#!/usr/bin/env node

import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { replaceTscAliasPaths } from "tsc-alias";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// External packages that should not be bundled
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

async function build() {
  try {
    // Create dist directory if it doesn't exist
    if (!fs.existsSync("dist")) {
      fs.mkdirSync("dist");
    }

    // ESM Build only
    await esbuild.build({
      entryPoints: ["src/index.ts", "src/experimental.ts"],
      outdir: "dist/esm",
      bundle: true,
      splitting: true,
      format: "esm",
      platform: "neutral",
      external,
      sourcemap: false,
      minify: false,
      outExtension: { ".js": ".js" },
    });

    // Generate TypeScript declarations using tsc
    console.log("Generating TypeScript declarations...");
    execSync(
      "npx tsc --project tsconfig.build.json --declaration --emitDeclarationOnly --outDir dist/esm",
      { stdio: "inherit" }
    );

    // The dtsPlugin is configured to output to 'dist/types', but the declaration files
    // are actually output to esbuild's outdir ('dist/esm'). This step processes them there.
    await replaceTscAliasPaths({
      configFile: path.resolve("./tsconfig.build.json"),
      outDir: path.resolve("./dist/esm"),
    });

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
