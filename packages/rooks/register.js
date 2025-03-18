// This is a helper file to enable TypeScript module loading with ts-node
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "CommonJS",
    target: "es2017",
    moduleResolution: "node",
  },
});

module.exports = require("./rollup.config.ts");
