const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");
const publishedHooks = require("./published-hooks");

const isDirectory = source => lstatSync(source).isDirectory();
const isHookDirectoryName = directoryName =>
  publishedHooks.includes(directoryName);
const getDirectories = source =>
  readdirSync(source).filter(isHookDirectoryName);

function getHookPaths() {
  return getDirectories(join("__dirname", "../../../"))
    .map(name => join(source, name))
    .filter(isDirectory);
}

function getHookNames() {
  return getDirectories(join("__dirname", "../../../"));
}

module.exports = {
  getHookPaths,
  getHookNames
};
