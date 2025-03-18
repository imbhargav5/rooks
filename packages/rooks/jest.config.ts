// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read tsconfig.json file and parse it to get paths
const tsConfigPath = join(__dirname, 'tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf8'));

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/__tests__/**/*.(spec|test).(ts|tsx)'],
  verbose: true,
  transform: {
    '^.+\\.[jt]sx?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    // Map paths from tsconfig
    '@/(.*)$': '<rootDir>/src/$1',
  },
  rootDir: '.',
  coverageProvider: 'v8',
  modulePaths: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
};

export default config;
