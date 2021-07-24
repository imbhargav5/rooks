const fs = require("fs");
const path = require("path");
const sortBy = require("lodash.sortby");
const listOfHooksJsonPath = path.join(__dirname, "../hooks-list.json");

module.exports = function ({ name, description }) {
  const listOfHooksJson = fs.readFileSync(listOfHooksJsonPath, "utf-8");
  const obj = JSON.parse(listOfHooksJson);
  obj.hooks.push({ name, description });
  obj.hooks = sortBy(obj.hooks, "name");
  fs.writeFileSync(listOfHooksJsonPath, JSON.stringify(obj, null, 2), "utf-8");
};
