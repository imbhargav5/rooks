const inquirer = require("inquirer");
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const replaceString = require("replace-string");
const makeDir = require("make-dir");
const ora = require("ora");
const execa = require("execa");
const truncate = require("lodash.truncate");
const getExistingListOfHooksAsJSON = require("./addHookToListAndUpdate");
const addHookToListAndUpdate = require("./addHookToListAndUpdate");

const PROJECT_ROOT = process.cwd();

const filesToRead = [
  "./template/index.spec.template",
  "./template/shared.template",
  "./template/README.md",
];
const filesToWrite = [
  ({ name }) => `./src/__tests__/${name}.spec.ts`,
  ({ name }) => `./src/hooks/${name}.ts`,
  ({ name }) => `./docs/${name}.md`,
];

function readFileAsString(relativeFilePath) {
  return fs.readFileSync(path.join(PROJECT_ROOT, relativeFilePath), "utf-8");
}

function injectValuesIntoTemplate(
  src,
  { name, packageName, directoryName, description }
) {
  const trimmedDescription = truncate(description, {
    length: 130,
  });
  const descriptionWords = trimmedDescription.split(/\s+/);
  const descriptionSplitUp = descriptionWords.reduce(
    (acc, descriptionWord) => {
      let { currentAccIndex, values } = acc;
      const descriptionArray = [...values];
      let currentItem = descriptionArray[currentAccIndex] || "";
      if (currentItem.length + descriptionWord.length > 50) {
        currentAccIndex = currentAccIndex + 1;
        currentItem = "";
        descriptionArray[currentAccIndex] = currentItem;
      }
      currentItem = `${currentItem} ${descriptionWord}`;
      descriptionArray[currentAccIndex] = currentItem;
      return {
        currentAccIndex,
        values: [...descriptionArray],
      };
    },
    {
      values: ["", "", ""],
      currentAccIndex: 0,
    }
  );

  const { values: descriptionArray } = descriptionSplitUp;

  let result = src;
  result = replaceString(result, "%name%", name);
  result = replaceString(result, "%directoryName%", directoryName);
  result = replaceString(result, "%packageName%", packageName);
  result = replaceString(result, "%description%", description);
  result = replaceString(result, "%description0%", descriptionArray[0]);
  result = replaceString(result, "%description1%", descriptionArray[1]);
  result = replaceString(result, "%description2%", descriptionArray[2]);
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
    },
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
    },
  },
  {
    type: "input",
    name: "description",
    message: "Description of the hook.",
    default: "",
  },
];

inquirer.prompt(questions).then((answers) => {
  const { name, packageName, description } = answers;
  const directoryName = packageName.substring(4);
  const transformedSources = filesToRead.map((filePath) => {
    const src = readFileAsString(filePath);
    return injectValuesIntoTemplate(src, {
      name,
      packageName,
      directoryName,
      description,
    });
  });

  filesToWrite.map((relativeFilePathFromRootOfModule, index) => {
    const srcToWrite = transformedSources[index];
    if (typeof relativeFilePathFromRootOfModule === "function") {
      relativeFilePathFromRootOfModule = relativeFilePathFromRootOfModule(
        answers
      );
    }
    const pathToWriteTo = path.join(
      PROJECT_ROOT,
      relativeFilePathFromRootOfModule
    );
    fsExtra.ensureFileSync(pathToWriteTo);
    fs.writeFileSync(pathToWriteTo, srcToWrite);
  });
  addHookToListAndUpdate({ name, description });
});
