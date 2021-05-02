// jest.config.ts
import type { Config } from '@jest/types';

// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/__tests__/**/*.(spec|test).(ts|tsx)'],
    verbose: true,
  };
};
