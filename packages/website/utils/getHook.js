const { lstatSync, readFileSync } = require("fs");
const { join, resolve } = require("path");
const getReadmeFilename = require("./getReadmeFileName");

function getReadme(hookName) {
  const hookDirName = join("__dirname", "../../", hookName);
  const readMeFileName = getReadmeFilename(hookDirName);
  const readMePath = join(hookDirName, readMeFileName);
  return readFileSync(readMePath, "utf-8");
}

module.exports = {
  getReadme
};
