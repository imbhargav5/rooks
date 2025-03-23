// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read tsconfig.json file and parse it to get paths
const tsConfigPath = join(__dirname, 'tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf8'));

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/__tests__/**/*.(spec|test).(ts|tsx)'],
  verbose: true,
  transform: {
    '^.+\\.[jt]sx?$': '@swc/jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(some-module-that-needs-transforming)/)',
  ],
  moduleNameMapper: {
    // Map paths from tsconfig
    '@/(.*)$': '<rootDir>/src/$1',
  },
  rootDir: '.',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
  modulePaths: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  maxWorkers: '50%',
};

export default config;
