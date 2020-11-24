import path from "path";
import nodeResolve from "@rollup/plugin-node-resolve";
import capitalize from "lodash.capitalize";
//import typescript from "@rollup/plugin-typescript";
import typescript2 from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

function getHookKeyFromPkgName(pkgName) {
  return `use${pkgName
    .split("-")
    .slice(1)
    .map(capitalize)
    .join("")}`;
}

const pkg = require(path.resolve("./package.json"));

const esm = {
  format: "esm",
  sourcemap: true
};

const getESM = override => ({ ...esm, ...override });

const commonPlugins = [
  nodeResolve(),
  typescript2(),
];

const prodPlugins = [
  terser()
];

const configBase = {
  input: "./src/index.ts",

  // \0 is rollup convention for generated in memory modules
  external: id => {
    if (id.startsWith("@rooks") || id.startsWith("shared")) {
      return false;
    }
    return !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith("/");
  },
  plugins: commonPlugins
};

const globals = { react: "React", "react-dom": "ReactDOM" };


const ciConfig = {
  ...configBase,
  output: [getESM({ file: "lib/index.esm.js", sourcemap: false })],
};
const standaloneConfig = {
  ...configBase,
  output: [{
    file: "lib/index.js",
    format: "umd",
    globals,    
    name: getHookKeyFromPkgName(pkg.name),
    sourcemap: true
  }, {
    file: "lib/index.min.js",
    format: "umd",
    globals,    
    name: getHookKeyFromPkgName(pkg.name),
    sourcemap: true,
    plugins: prodPlugins
  }, getESM({ file: "lib/index.esm.js" })],
};
let config
if (process.env.NODE_ENV === "CI") {
  config = ciConfig;
}else{
  config = standaloneConfig
}

export default config;
