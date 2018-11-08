const { getHookNames } = require("./utils/getAllHooks");
const withMDX = require("@zeit/next-mdx");
const withCSS = require("@zeit/next-css");

// next.config.js
module.exports = withCSS({
  ...withMDX({}),
  exportPathMap: async function(defaultPathMap) {
    const dirs = await getHookNames();
    const hookPages = dirs.reduce(
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
