// import esbuild from "rollup-plugin-esbuild";
// import terser from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import typescript2 from "rollup-plugin-typescript2";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import pkg from "./package.json";

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies || {}),
];

const distDir = "./dist/future";

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
      dir: `${distDir}/esm`,
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
];
