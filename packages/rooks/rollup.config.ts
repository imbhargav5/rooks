import dts from "rollup-plugin-dts";
import typescript2 from "rollup-plugin-typescript2";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import pkg from "./package.json";
import nodeResolve from "@rollup/plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

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

export default () => [
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
  // @todo UMD from rollup.config.ts
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
