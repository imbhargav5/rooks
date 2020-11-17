const glob = require('glob');
const path = require('path');
const fs = require('fs');
const ts = require('typescript');
const readlineSync = require('readline-sync');
const assert = require('assert').strict;

const PACKAGE_JSON = 'package.json';
const TS_CONFIG_JSON = 'tsconfig.json';

const defaultOptions = {
  cwd: process.cwd(),
  verbose: false,
  discardComments: false,
  help: false,
  check: false,
};

const getAllPackageJsons = async (workspaces) => {
  return Promise.all(
    workspaces.map(
      (workspace) =>
        new Promise((resolve, reject) => {
          glob(`${workspace}/${PACKAGE_JSON}`, (error, files) => {
            if (error) {
              reject(error);
            }
            resolve(files);
          });
        }),

      []
    )
  )
    .then((allPackages) =>
      allPackages.reduce(
        (flattendArray, files) => [...flattendArray, ...files],
        []
      )
    )
    .then((allPackages) =>
      allPackages.filter((packageName) => !packageName.includes('node_modules'))
    );
};

const getPackageNamesAndPackageDir = (packageFilePaths) =>
  packageFilePaths.reduce((map, packageFilePath) => {
    const fullPackageFilePath = path.join(process.cwd(), packageFilePath);
    const packageJson = require(fullPackageFilePath);
    const { name } = packageJson;
    map.set(name, { packageDir: path.dirname(fullPackageFilePath) });
    return map;
  }, new Map());

const getReferencesFromDependencies = (
  { packageDir },
  packageName,
  packagesMap,
  verbose
) => {
  const packageJsonFilePath = path.join(packageDir, PACKAGE_JSON);

  const {
    dependencies = {},
    peerDependencies = {},
    devDependencies = {},
  } = require(packageJsonFilePath);

  const mergedDependencies = {
    ...dependencies,
    ...peerDependencies,
    ...devDependencies,
  };
  if (verbose) console.log(`all deps from ${packageName}`, mergedDependencies);

  if (Object.keys(mergedDependencies).includes(packageName)) {
    throw new Error(
      `This package ${packageName} references itself, please check dependencies in package.json`
    );
  }

  return Object.keys(mergedDependencies)
    .reduce((referenceArray, dependency) => {
      if (packagesMap.has(dependency)) {
        const { packageDir: dependencyDir } = packagesMap.get(dependency);
        if (fs.existsSync(path.join(dependencyDir, TS_CONFIG_JSON))) {
          const relativePath = path.relative(packageDir, dependencyDir);

          return [
            ...referenceArray,
            {
              path: relativePath,
            },
          ];
        }
      }
      return referenceArray;
    }, [])
    .sort((refA, refB) => (refA.path > refB.path ? 1 : -1));
};

const updateTsConfig = (
  references,
  discardComments,
  check,
  { packageDir } = { packageDir: process.cwd() }
) => {
  const tsconfigFilePath = path.join(packageDir, TS_CONFIG_JSON);
  let pureJson = true;
  try {
    require(tsconfigFilePath);
  } catch {
    pureJson = false;
  }

  const { config, error } = ts.readConfigFile(
    tsconfigFilePath,
    ts.sys.readFile
  );

  if (!error) {
    if (check === false && pureJson === false && discardComments === false) {
      if (
        !readlineSync.keyInYN(
          `Found comments in the tsconfig. ${tsconfigFilePath}
Do you want to discard them and proceed?`
        )
      ) {
        process.exit(0);
      }
    }
    let isEqual = false;
    try {
      assert.deepEqual(config.references || [], references || []);
      isEqual = true;
    } catch {
      // ignore me
    }
    if (!isEqual) {
      if (check === false) {
        const newTsConfig = `${JSON.stringify(
          {
            ...config,
            references: references.length ? references : undefined,
          },
          null,
          2
        )}
  `;
        fs.writeFileSync(tsconfigFilePath, newTsConfig);
      }
      return 1;
    }
    return 0;
  } else {
    console.error(`could not read ${tsconfigFilePath}`, error);
  }
};

const execute = async ({ cwd, verbose, discardComments, check }) => {
  let changesCount = 0;
  // eslint-disable-next-line no-console
  console.log('updating tsconfigs');
  const packageJson = require(path.join(cwd, PACKAGE_JSON));

  let workspaces = packageJson.workspaces;
  if (!workspaces && fs.existsSync(path.join(cwd, 'lerna.json'))) {
    const lernaJson = require(path.join(cwd, 'lerna.json'));
    workspaces = lernaJson.packages;
  }

  if (!workspaces) {
    throw new Error(
      'could not detect yarn workspaces or lerna in this repository'
    );
  }

  if (!Array.isArray(workspaces)) {
    workspaces = workspaces.packages;
  }

  const packageFilePaths = await getAllPackageJsons(workspaces);
  if (verbose) {
    console.log('packageFilePaths', packageFilePaths);
  }
  const packagesMap = getPackageNamesAndPackageDir(packageFilePaths);

  if (verbose) {
    console.log('packagesMap', packagesMap);
  }

  const rootReferences = [];

  packagesMap.forEach((packageEntry, packageName) => {
    const tsconfigFilePath = path.join(packageEntry.packageDir, TS_CONFIG_JSON);
    if (fs.existsSync(tsconfigFilePath)) {
      rootReferences.push({
        path: path.relative(process.cwd(), packageEntry.packageDir),
      });
      const references = getReferencesFromDependencies(
        packageEntry,
        packageName,
        packagesMap,
        verbose
      );
      if (verbose) {
        console.log(`references of ${packageName}`, references);
      }
      changesCount += updateTsConfig(
        references,
        discardComments,
        check,
        packageEntry
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(`NO ${TS_CONFIG_JSON} for ${packageName}`);
    }
  });

  if (verbose) {
    console.log('rootReferences', rootReferences);
  }
  changesCount += updateTsConfig(rootReferences, discardComments, check);

  if (verbose) {
    console.log(`counted changes ${changesCount}`);
  }
  return changesCount;
};

module.exports = { execute, defaultOptions };
