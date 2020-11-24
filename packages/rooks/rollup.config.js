import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import typescript2 from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import sourceMaps from "rollup-plugin-sourcemaps";
import pkg from "./package.json";

// rollup-plugin-ignore stopped working, so we'll just remove the import lines 😐
const propTypeIgnore = { "import PropTypes from 'prop-types';": "'';" };

const esm = {
  format: "esm",
  sourcemap: true
};

const getESM = override => ({ ...esm, ...override });

const commonPlugins = [
  nodeResolve(),
  typescript2(),
  sourceMaps(),
  json(),
  babel({
    exclude: ["node_modules/**", "../../node_modules/**"],
    plugins: ["@babel/plugin-external-helpers"]
  }),
  commonjs({
    ignoreGlobal: true,
  }),
  replace({
    __VERSION__: JSON.stringify(pkg.version)
  })
];

const prodPlugins = [
  terser()
];

const globals = { react: "React", "react-dom": "ReactDOM" };

const configBase = {
  input: "./src/index.ts",

  // \0 is rollup convention for generated in memory modules
  external: Object.keys(globals),
  plugins: commonPlugins
};

const ciConfig = {
  ...configBase,
  output: [getESM({ file: "lib/rooks.esm.js", sourcemap: false })],
};
const standaloneConfig = {
  ...configBase,
  output: [{
    file: "lib/rooks.js",
    format: "umd",
    globals,    
    name: "rooks",
    sourcemap: true
  }, {
    file: "lib/rooks.min.js",
    format: "umd",
    globals,    
    name: "rooks",
    sourcemap: true,
    plugins: prodPlugins
  }, getESM({ file: "lib/rooks.esm.js" })],
};

let config
if (process.env.NODE_ENV === "CI") {
  config = ciConfig;
}else{
  config = standaloneConfig
}

export default config;
