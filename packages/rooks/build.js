#!/usr/bin/env node

import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { execa } from "execa";
import tscAlias from "tsc-alias";
import pkg from "./package.json" with { type: "json" };

const { replaceTscAliasPaths } = tscAlias;

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

    // ESM Build only (JS)
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

    // Generate type declarations via tsc
    await execa("tsc", [
      "--emitDeclarationOnly",
      "--declaration",
      "--declarationMap",
      "false",
      "--project",
      "./tsconfig.build.json",
      "--outDir",
      "./dist/esm",
    ], { stdio: "inherit" });

    // Fix path aliases in emitted .d.ts files
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
