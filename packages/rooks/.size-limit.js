// @ts-check

/**
 * Budgets for the ESM entry points and representative tree-shaken imports.
 *
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import: string, webpack: true}[]}
 */
export default [
  {
    name: "rooks",
    path: ["dist/esm/index.js"],
    import: "*",
    webpack: true,
    limit: "25 kB",
  },
  {
    name: "rooks/experimental",
    path: ["dist/esm/experimental.js"],
    import: "*",
    webpack: true,
    limit: "14 kB",
  },
  {
    name: "rooks/temporal",
    path: ["dist/esm/temporal.js"],
    import: "*",
    webpack: true,
    limit: "5 kB",
  },
  {
    name: "rooks: useToggle",
    path: ["dist/esm/index.js"],
    import: "{ useToggle }",
    webpack: true,
    limit: "2 kB",
  },
  {
    name: "rooks: useDebounce",
    path: ["dist/esm/index.js"],
    import: "{ useDebounce }",
    webpack: true,
    limit: "2 kB",
  },
  {
    name: "rooks: usePreferredColorScheme",
    path: ["dist/esm/index.js"],
    import: "{ usePreferredColorScheme }",
    webpack: true,
    limit: "2 kB",
  },
];
