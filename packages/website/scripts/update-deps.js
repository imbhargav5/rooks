const fetch = require("isomorphic-fetch");
const write = require("write");
const del = require("del");
const path = require("path");
const bluebird = require("bluebird");
const install = bluebird.promisify(require("npm-install-package"));
const capitalize = require("lodash.capitalize");

function deleteExistingHooks() {
  const srcHooksPath = path.resolve(__dirname, "../hooks");
  return del([srcHooksPath + "/*.js"]);
}

function deleteExistingReadmes() {
  const srcReadmesPath = path.resolve(__dirname, "../_readmes");
  return del([srcReadmesPath + "/*.js"]);
}

function getHookPath(hookName) {
  return path.resolve(__dirname, "../hooks/" + hookName + ".js");
}
function getReadmePath(hookName) {
  return path.resolve(__dirname, "../_readmes/" + hookName + ".md");
}

function getTemplate(pkgName) {
  return "import p from '" + pkgName + "';\nexport default p;";
}

function getHookMapTemplate(hookNames) {
  const importStrs = hookNames.map(hookName => {
    const hookKey = getHookKeyFromHookName(hookName);
    return [
      "import " + hookKey + " from '@rooks/use-" + hookName + "';",
      hookKey
    ];
  });
  const importStr = importStrs.map(i => i[0]).join("\n") + "\n";
  const hookKeys = importStrs.map(i => i[1]);
  const literalStrings = hookKeys.map(
    (hookKey, index) => '"' + hookKey + '":' + hookKey
  );
  return (
    importStr + "\nexport default {\n" + literalStrings.join(",\n") + "\n};"
  );
}
function getHookKeyFromHookName(hookName) {
  return `use${hookName
    .split("-")
    .map(capitalize)
    .join("")}`;
}

function getReadmeMapTemplate(hookNames) {
  let readmeNames = [];
  const importStrs = hookNames.map(hookName => {
    const hookKey = getHookKeyFromHookName(hookName);
    const readmeName = `${hookKey}Readme`;
    readmeNames.push(readmeName);
    return `import ${readmeName} from "../_readmes/${hookName}.md"`;
  });
  const strs = hookNames.map((hookName, index) => {
    return '"' + hookName + '":' + readmeNames[index];
  });
  return (
    importStrs.join("\n") + "\nexport default {\n" + strs.join(",\n") + "\n};"
  );
}

function updateHookMap(publishedPackageNames) {
  let hookNames = [];
  let hooks = publishedPackageNames.map(pkgName => {
    const contents = getTemplate(pkgName);
    const hookName = pkgName.split("use-")[1];
    hookNames.push(hookName);
  });
  return write(
    path.resolve(__dirname, "../utils/getHookMap.js"),
    getHookMapTemplate(hookNames)
  );
}

function writeToReadmeFolderInWebsiteSrc(readmes, publishedPackageNames) {
  let hookNames = [];
  readmes.map((readme, index) => {
    let hookName = publishedPackageNames[index];
    hookName = hookName.split("use-")[1];
    hookNames.push(hookName);
    return write(getReadmePath(hookName), readme);
  });
  return Promise.all(readmes).then(() => {
    return write(
      path.resolve(__dirname, "../utils/getReadmeMap.js"),
      getReadmeMapTemplate(hookNames)
    );
  });
}

fetch("https://react-hooks.org/api/hooks")
  .then(r => r.json())
  .then(response => {
    const packageJsonPromises = response.map(package => {
      return fetch(
        `https://raw.githubusercontent.com/imbhargav5/rooks/master/packages/${
          package.name
        }/package.json`
      ).then(r => r.json());
    });

    Promise.all(packageJsonPromises).then(packages => {
      const publishedPackages = packages.filter(
        p => p.publishConfig && p.publishConfig.access === "public"
      );
      const publishedPackageNames = publishedPackages.map(p => p.name);
      const readmePromises = response.map(package => {
        return fetch(
          `https://raw.githubusercontent.com/imbhargav5/rooks/master/packages/${
            package.name
          }/README.md`
        ).then(r => r.text());
      });
      deleteExistingReadmes()
        .then(() => Promise.all(readmePromises))
        .then(readmes => {
          return writeToReadmeFolderInWebsiteSrc(
            readmes,
            publishedPackageNames
          );
        });
      deleteExistingHooks()
        .then(() => {
          return updateHookMap(publishedPackageNames);
        })
        .then(() => {
          const installPkgs = publishedPackageNames.map(m => `${m}@latest`);
          process.chdir(path.join(__dirname, ".."));
          return install(installPkgs, { save: true });
        });
    });
  });
