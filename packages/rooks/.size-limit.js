// @ts-check

// Regularly update this max size when new hooks are added (keep a threshold)
const fullBundleMaxSize = "12KB";

/**
 * Will ensure esm tree-shakeability and total size are within expectations.
 *
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  // Size of all imports from the esm bundle
  {
    name: "ESM Webpack (*)",
    webpack: true,
    path: ["dist/esm/index.js"],
    import: "*",
    limit: fullBundleMaxSize,
  },
  // Size of an individual import from the esm bundle
  // We can also do this eventually if we want
  // {
  //   name: "ESM Webpack ({ useDebounce })",
  //   webpack: true,
  //   path: ["dist/esm/index.js"],
  //   import: "{ useDebounce }",
  //   limit: "2KB",
  // },
  {
    name: "CJS Webpack (*)",
    path: ["dist/cjs/index.js"],
    webpack: true,
    import: "*", // CJS does not tree-shake in webpack5.
    limit: fullBundleMaxSize,
  },
  {
    name: "UMD bundle size (*)",
    path: ["dist/umd/rooks.umd.js"],
    webpack: false,
    limit: fullBundleMaxSize,
  },
];
