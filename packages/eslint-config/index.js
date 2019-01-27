"use strict";

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  rules: {
    semi: [0],
    "no-constant-condition": [2],
    "no-undef": [2],
    "no-dupe-args": [2],
    "no-unreachable": [1],
    "no-cond-assign": [2],
    "no-dupe-keys": [1],
    "prefer-const": [1],
    "no-const-assign": [2],
    "no-duplicate-imports": [2],
    "no-useless-constructor": [1],
    "no-class-assign": [2],
    "no-confusing-arrow": [2],
    "constructor-super": [2],
    "prefer-spread": [1],
    "no-lonely-if": [1],
    "no-continue": [1],
    "no-redeclare": [0],
    "comma-dangle": [0],
    "no-extra-semi": [0],
    "no-console": [0],
    "no-mixed-spaces-and-tabs": [0],
    "react/react-in-jsx-scope": [0],
    "react/display-name": [0]
  },
  plugins: ["react"]
};
