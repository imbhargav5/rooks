import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'forks',
    // Avoid mocking queueMicrotask which causes OOM with jsdom/fetch
    // See: https://github.com/vitest-dev/vitest/issues/7288
    fakeTimers: {
      toFake: [
        'Date',
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate',
      ],
    },
    include: ['src/__tests__/**/*.{spec,test}.{ts,tsx}'],
    setupFiles: ['./src/vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
    },
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
