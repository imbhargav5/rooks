const { getHookNames } = require("./utils/getAllHooks");
const withMDX = require("@zeit/next-mdx")({
  extension: /.mdx?$/
});
const withCSS = require("@zeit/next-css");
const webpack = require("webpack");

// next.config.js
module.exports = withCSS({
  ...withMDX({
    webpack: (config = {}) => {
      if (!Array.isArray(config.plugins)) {
        config.plugins = [];
      }
      config.plugins.push(
        new webpack.IgnorePlugin(
          /fs|tls|net|child_process|term.js|pty.js|readline|dgram|dns|repl|\.\.\/API\/schema/
        )
      );
      return config;
    }
  }),
  exportPathMap: async function(defaultPathMap) {
    const dirs = await getHookNames();
    const hookPages = dirs
      .filter(d => !d.startsWith("rooks"))
      .reduce(
        (acc, hook) =>
          Object.assign({}, acc, {
            [`/hook/use-${hook}`]: {
              page: "/hook",
              query: { hookName: hook }
            }
          }),
        {}
      );
    return {
      "/": { page: "/" },
      ...hookPages
    };
  }
});
