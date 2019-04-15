import path from "path";
import nodeResolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import flow from "rollup-plugin-flow";
//import typescript from "rollup-plugin-typescript";
import typescript2 from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import sourceMaps from "rollup-plugin-sourcemaps";
import capitalize from "lodash.capitalize";

function getHookKeyFromPkgName(pkgName) {
  return `use${pkgName
    .split("-")
    .slice(1)
    .map(capitalize)
    .join("")}`;
}

const pkg = require(path.resolve("./package.json"));

// rollup-plugin-ignore stopped working, so we'll just remove the import lines 😐
const propTypeIgnore = { "import PropTypes from 'prop-types';": "'';" };

const cjs = {
  format: "cjs",
  sourcemap: true
};

const esm = {
  format: "esm",
  sourcemap: true
};

const getCJS = override => ({ ...cjs, ...override });
const getESM = override => ({ ...esm, ...override });

const commonPlugins = [
  // typescript({
  //   // moduleResolution: "node",
  //   // strictNullChecks: true, // enable strict null checks as a best practice
  //   // module: "ES2015", // specify module code generation
  //   // jsx: "react", // use typescript to transpile jsx to js
  //   // target: "ES2016", // specify ECMAScript target version
  //   include: ["../../**/src/*.ts", "../../node_modules/shared/*.ts"],
  //   types: ["shared"],
  //   exclude: ["node_modules"]
  // }),
  typescript2({
    useTsconfigDeclarationDir: true
  }),
  sourceMaps(),
  json(),
  nodeResolve(),
  // babel({
  //   exclude: "node_modules/**"
  // }),
  commonjs({
    ignoreGlobal: true,
    namedExports: {
      "react-is": ["isElement", "isValidElementType", "ForwardRef"]
    }
  })
];

const prodPlugins = [
  replace({
    ...propTypeIgnore,
    "process.env.NODE_ENV": JSON.stringify("production")
  }),
  terser({
    sourcemap: true
  })
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

const standaloneBaseConfig = {
  ...configBase,
  output: {
    file: "lib/index.js",
    format: "umd",
    globals,
    name: getHookKeyFromPkgName(pkg.name),
    sourcemap: true
  },
  external: Object.keys(globals),
  plugins: configBase.plugins.concat(
    replace({
      __SERVER__: JSON.stringify(false)
    })
  )
};

const standaloneConfig = {
  ...standaloneBaseConfig,
  plugins: standaloneBaseConfig.plugins.concat(
    replace({
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  )
};

const standaloneProdConfig = {
  ...standaloneBaseConfig,
  output: {
    ...standaloneBaseConfig.output,
    file: "lib/index.min.js"
  },
  plugins: standaloneBaseConfig.plugins.concat(prodPlugins)
};

const serverConfig = {
  ...configBase,
  output: [
    getESM({ file: "lib/index.esm.js" }),
    //getESM({ file: "lib/index.mjs" }),
    getCJS({ file: "lib/index.cjs.js" })
  ],
  plugins: configBase.plugins.concat(
    replace({
      __SERVER__: JSON.stringify(true)
    })
  )
};

const browserConfig = {
  ...configBase,
  output: [
    getESM({ file: "lib/index.browser.esm.js" }),
    //getESM({ file: "lib/index.browser.mjs" }),
    getCJS({ file: "lib/index.browser.cjs.js" })
  ],
  plugins: configBase.plugins.concat(
    replace({
      __SERVER__: JSON.stringify(false)
    })
  )
};
let config = [
  standaloneConfig,
  standaloneProdConfig,
  serverConfig,
  browserConfig
  //dtsConfig
  // nativeConfig,
  // primitivesConfig,
  // macroConfig,
];
if (process.env.NODE_ENV === "CI") {
  config = [standaloneConfig];
}

export default config;
