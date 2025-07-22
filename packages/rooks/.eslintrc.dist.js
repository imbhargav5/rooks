module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    // Relaxed rules for generated files
    'no-unused-vars': 'off', // Generated files may have unused imports
    'no-undef': 'error', // But undefined variables should still be caught
    'no-console': 'off', // Allow console in generated files
    'prefer-const': 'warn',
    'no-var': 'error'
  },
  ignorePatterns: [
    '**/*.d.ts' // Skip TypeScript definition files
  ]
};
