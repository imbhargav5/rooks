// jest.config.ts
import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
const tsconfig = require("./tsconfig.json");
// Or async function
export default (): Config.InitialOptions => {
  return {
    testEnvironment: "jsdom",
    testMatch: ["<rootDir>/__tests__/**/*.(spec|test).(ts|tsx)"],
    verbose: true,
    transform: {
      "^.+\\.[jt]sx?$": "esbuild-jest",
    },
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
    rootDir: "src",
    coverageProvider: "v8",
    modulePaths: ["<rootDir>"],
  };
};
