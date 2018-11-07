const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const isDirectory = source => lstatSync(source).isDirectory();
const isHookDirectoryName = directoryName => directoryName !== "website";
const getDirectories = source =>
  readdirSync(source).filter(isHookDirectoryName);

function getHookPaths() {
  return getDirectories(join("__dirname", "../../"))
    .map(name => join(source, name))
    .filter(isDirectory);
}

function getHookNames() {
  return getDirectories(join("__dirname", "../../"));
}

module.exports = {
  getHookPaths,
  getHookNames
};
