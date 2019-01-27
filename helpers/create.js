const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const replaceString = require("replace-string");
const makeDir = require("make-dir");
const ora = require("ora");
const execa = require("execa");
const chalk = require("chalk");

const filesToRead = [
  "../template/index.template",
  "../template/index.spec.template",
  "../template/package.json",
  "../template/README.md",
  "../template/.babelrc",
  "../template/.npmignore",
  "../template/index.d.ts.template"
];
const filesToWrite = [
  "src/index.js",
  "test/index.spec.js",
  "package.json",
  "README.md",
  ".babelrc",
  ".npmignore",
  "index.d.ts"
];

function installPackages() {
  const spinner = ora("Installing  packages").start();
  return execa
    .shell("npm install")
    .then(() => spinner.succeed("Installation successful"))
    .catch(err => spinner.fail(err.message));
}

function readFileAsString(relativeFilePath) {
  return fs.readFileSync(path.join(__dirname, relativeFilePath), "utf-8");
}

function injectValuesIntoTemplate(
  src,
  { name, packageName, directoryName, description }
) {
  let result = src;
  result = replaceString(result, "%name%", name);
  result = replaceString(result, "%directoryName%", directoryName);
  result = replaceString(result, "%packageName%", packageName);
  result = replaceString(result, "%description%", description);
  return result;
}

const questions = [
  {
    type: "input",
    name: "packageName",
    message:
      "Name of the package in hyphen separated words starting with use.For eg: use-regina-phalange",
    default: "use-r",
    validate(input) {
      if (
        input.length > 4 &&
        input.startsWith("use-") &&
        input.toLowerCase() === input
      ) {
        return true;
      }
      return false;
    }
  },
  {
    type: "input",
    name: "name",
    message:
      "Name of the hook which will be used for it's javascript import etc. For eg: useReginaPhalange",
    default: "useR",
    validate(input) {
      if (input.length > 3 && input.startsWith("use")) {
        return true;
      }
      return false;
    }
  },
  {
    type: "input",
    name: "description",
    message: "Description of the hook.",
    default: ""
  }
];

inquirer.prompt(questions).then(answers => {
  const { name, packageName, description } = answers;
  const directoryName = packageName.substring(4);
  const transformedSources = filesToRead.map(filePath => {
    const src = readFileAsString(filePath);
    return injectValuesIntoTemplate(src, {
      name,
      packageName,
      directoryName,
      description
    });
  });
  const dirPath = path.join(__dirname, "../", `packages/${directoryName}`);
  // create package directory
  makeDir.sync(path.join(dirPath, "/src"));
  makeDir.sync(path.join(dirPath, "/test"));

  filesToWrite.map((relativeFilePathFromRootOfModule, index) => {
    const srcToWrite = transformedSources[index];
    fs.writeFileSync(
      path.join(
        __dirname,
        "../",
        `packages/${directoryName}`,
        relativeFilePathFromRootOfModule
      ),
      srcToWrite
    );
  });
  // go to the newly created project directory
  process.chdir(dirPath);
  installPackages();
  // run scripts
});
