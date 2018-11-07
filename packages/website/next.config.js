const { getHookNames } = require("./utils/getAllHooks");
// next.config.js
module.exports = {
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
};
