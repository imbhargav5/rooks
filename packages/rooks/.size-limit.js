module.exports = [
  {
    name: "ESM Webpack (useDebounce)",
    webpack: true,
    path: ["dist/esm/index.js"],
    import: "{ useDebounce }",
    limit: "2KB",
  },
  {
    name: "CJS Webpack (useDebounce)",
    path: ["dist/cjs/index.js"],
    webpack: true,
    import: "{ useDebounce }",
    limit: "15KB",
  },
  {
    name: "UMD bundle size",
    path: ["dist/umd/rooks.umd.js"],
    webpack: true,
    limit: "10KB",
  },
];
