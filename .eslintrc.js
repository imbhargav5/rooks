const tsconfigs = ["./tsconfig.json"];

const ruleOverrides = {
  "@typescript-eslint/explicit-module-boundary-types": 0,
  "@typescript-eslint/no-confusing-void-expression": 0,
  "@typescript-eslint/no-empty-function": 0,
  "@typescript-eslint/no-redeclare": 0,
  "@typescript-eslint/unbound-method": 0,
  "arrow-body-style": 0,
  "canonical/import-specifier-newline": 0,
  "comma-dangle": [0],
  "constructor-super": [2],
  "filenames/match-regex": 0,
  "func-style": 0,
  "import/extensions": 0,
  "import/no-extraneous-dependencies": 0,
  "import/no-namespace": 0,
  "import/no-unassigned-import": 0,
  "import/no-unresolved": 0,
  "jest/prefer-expect-assertions": 1,
  "max-nested-callbacks": 0,
  "no-class-assign": [2],
  "no-cond-assign": [2],
  "no-confusing-arrow": [2],
  "no-console": [0],
  "no-const-assign": [2],
  "no-constant-condition": [2],
  "no-continue": [1],
  "no-dupe-args": [2],
  "no-dupe-keys": [1],
  "no-extra-semi": [0],
  "no-lonely-if": [1],
  "no-mixed-spaces-and-tabs": [0],
  "no-redeclare": [0],
  "no-undef": [2],
  "no-unreachable": [1],
  "no-useless-constructor": [1],
  "prefer-const": [1],
  "prefer-spread": [1],
  radix: 0,
  "react/display-name": [0],
  "react/react-in-jsx-scope": [0],
  semi: [0],
  "unicorn/no-reduce": 0,
};

// module.exports = {
//   "env": {
//     "browser": true,
//     "node": true,
//     "es6": true,
//     "jest": true
//   },
//   "extends": [
//     "canonical",
//     "canonical/react",
//     "canonical/typescript",
//     "prettier"
//   ],
//   "parserOptions": {
//     "project": [
//       "./tsconfig.json"
//     ]
//   },
//   "parser": "@typescript-eslint/parser",
//   "rules": ruleOverrides,
//   "settings":{
//     "react": {
//       "version": "detect"
//     }
//   }
// }

module.exports = {
  overrides: [
    {
      env: {
        browser: true,
      },
      excludedFiles: "*.test.ts",
      extends: [
        "canonical",
        "canonical/react",
        "canonical/typescript",
        "prettier",
      ],
      files: "*.ts",
      parserOptions: {
        project: tsconfigs,
      },
      rules: ruleOverrides,
    },
    {
      env: {
        browser: true,
      },
      extends: [
        "canonical",
        "canonical/react",
        "canonical/jsx-a11y",
        "canonical/typescript",
        "prettier",
      ],
      files: "*.tsx",
      parserOptions: {
        project: tsconfigs,
      },
      rules: ruleOverrides,
    },
    {
      env: {
        "jest/globals": true,
        node: true,
      },
      extends: [
        "canonical",
        "canonical/typescript",
        "canonical/jest",
        "prettier",
      ],
      files: "*.spec.{ts,tsx}",
      parserOptions: {
        project: tsconfigs,
      },
      rules: ruleOverrides,
    },
    {
      extends: ["canonical", "canonical/node", "prettier"],
      files: "*.js",
      rules: ruleOverrides,
    },
    {
      extends: ["canonical/json"],
      files: "*.json",
      rules: {
        "jsonc/no-comments": 0,
      },
    },
    {
      extends: ["canonical/yaml"],
      files: "*.yaml",
      rules: {
        "yml/no-empty-mapping-value": 0,
        "yml/require-string-key": 0,
      },
    },
  ],
  root: true,
};
