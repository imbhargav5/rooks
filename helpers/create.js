const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const replaceString = require('replace-string');
const makeDir = require('make-dir');
const ora = require('ora');
const execa = require('execa');
const truncate = require('lodash.truncate');

const filesToRead = [
  '../template/index.template',
  '../template/shared.template',
  '../template/package.json',
  '../template/README.md',
  '../template/Examples.md',
  '../template/.babelrc',
  '../template/.eslintrc',
  '../template/.npmignore',
  '../template/index.d.ts.template',
  '../template/tsconfig.json',
  '../template/title-card.svg',
];
const filesToWrite = [
  'src/index.ts',
  ({ name }) => `../shared/${name}.ts`,
  'package.json',
  'README.md',
  'Examples.md',
  '.babelrc',
  '.eslintrc',
  '.npmignore',
  'index.d.ts',
  'tsconfig.json',
  'title-card.svg',
];

function installPackages() {
  const spinner = ora('Installing  packages').start();
  return execa
    .command('yarn install')
    .then(() => spinner.succeed('Installation successful'))
    .catch((err) => spinner.fail(err.message));
}

function readFileAsString(relativeFilePath) {
  return fs.readFileSync(path.join(__dirname, relativeFilePath), 'utf-8');
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
      let currentItem = descriptionArray[currentAccIndex] || '';
      if (currentItem.length + descriptionWord.length > 50) {
        currentAccIndex = currentAccIndex + 1;
        currentItem = '';
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
      values: ['', '', ''],
      currentAccIndex: 0,
    }
  );

  const { values: descriptionArray } = descriptionSplitUp;

  let result = src;
  result = replaceString(result, '%name%', name);
  result = replaceString(result, '%directoryName%', directoryName);
  result = replaceString(result, '%packageName%', packageName);
  result = replaceString(result, '%description%', description);
  result = replaceString(result, '%description0%', descriptionArray[0]);
  result = replaceString(result, '%description1%', descriptionArray[1]);
  result = replaceString(result, '%description2%', descriptionArray[2]);
  return result;
}

const questions = [
  {
    type: 'input',
    name: 'packageName',
    message:
      'Name of the package in hyphen separated words starting with use.For eg: use-regina-phalange',
    default: 'use-r',
    validate(input) {
      if (
        input.length > 4 &&
        input.startsWith('use-') &&
        input.toLowerCase() === input
      ) {
        return true;
      }
      return false;
    },
  },
  {
    type: 'input',
    name: 'name',
    message:
      "Name of the hook which will be used for it's javascript import etc. For eg: useReginaPhalange",
    default: 'useR',
    validate(input) {
      if (input.length > 3 && input.startsWith('use')) {
        return true;
      }
      return false;
    },
  },
  {
    type: 'input',
    name: 'description',
    message: 'Description of the hook.',
    default: '',
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
  const dirPath = path.join(__dirname, '../', `packages/${directoryName}`);
  // create package directory
  makeDir.sync(path.join(dirPath, '/src'));

  filesToWrite.map((relativeFilePathFromRootOfModule, index) => {
    const srcToWrite = transformedSources[index];
    if (typeof relativeFilePathFromRootOfModule === 'function') {
      relativeFilePathFromRootOfModule = relativeFilePathFromRootOfModule(
        answers
      );
    }
    fs.writeFileSync(
      path.join(
        __dirname,
        '../',
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
