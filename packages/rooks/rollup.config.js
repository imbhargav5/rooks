const dts = require("rollup-plugin-dts");
const typescript2 = require("rollup-plugin-typescript2");
const { typescriptPaths } = require("rollup-plugin-typescript-paths");
const fs = require("fs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const sourceMaps = require("rollup-plugin-sourcemaps");
const json = require("@rollup/plugin-json");
const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const { terser } = require("rollup-plugin-terser");

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies || {}),
];

const umdGlobals = { react: "React", "react-dom": "ReactDOM" };

const distDir = "./dist";

const tsPathPlugin = typescriptPaths({
  preserveExtensions: true,
  tsConfigPath: "./tsconfig.json",
});

const plugins = [
  tsPathPlugin,
  typescript2({
    tsconfig: "./tsconfig.build.json",
  }),
];

const umdPlugins = [
  nodeResolve(),
  typescript2({
    tsconfig: "./tsconfig.build.json",
  }),
  sourceMaps(),
  json(),
  babel({
    babelHelpers: "bundled",
    exclude: ["node_modules/**", "../../node_modules/**"],
    plugins: ["@babel/plugin-external-helpers"],
  }),
  commonjs({
    ignoreGlobal: true,
  }),
  replace({
    preventAssignment: true,
    __VERSION__: JSON.stringify(pkg.version),
  }),
];

const prodUmdPlugins = [terser()];

module.exports = () => [
  // ESM
  {
    input: ["./src/index.ts"],
    output: {
      dir: `${distDir}/esm`,
      format: "esm",
      sourcemap: false,
    },
    preserveModules: true,
    external,
    plugins,
  },
  // CJS
  {
    input: ["./src/index.ts"],
    output: {
      dir: `${distDir}/cjs`,
      format: "cjs",
      sourcemap: false,
    },
    preserveModules: true,
    external,
    plugins: [...plugins],
  },
  {
    input: "./src/index.ts",
    output: {
      file: `${distDir}/types/index.d.ts`,
    },
    external,
    plugins: [
      tsPathPlugin,
      dts({
        compilerOptions: {
          sourceMap: false,
        },
      }),
    ],
  },
  // UMD
  {
    input: "./src/index.ts",
    // \0 is rollup convention for generated in memory modules
    external: Object.keys(umdGlobals),
    plugins: umdPlugins,
    output: [
      {
        file: `${distDir}/umd/rooks.umd.js`,
        format: "umd",
        globals: umdGlobals,
        name: "rooks",
        plugins: prodUmdPlugins,
      },
    ],
  },
];
