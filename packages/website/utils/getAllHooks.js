const fetch = require("isomorphic-fetch");

function getHooks() {
  return fetch("https://react-hooks.org/api/hooks").then(response =>
    response.json()
  );
}

function getHookNames() {
  return getHooks().then(data => data.map(hook => hook.name));
}

module.exports = {
  getHooks,
  getHookNames
};
