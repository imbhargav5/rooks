const fetch = require("isomorphic-fetch");
const write = require("write");
const del = require("del");
const path = require("path");
const bluebird = require("bluebird");
const install = bluebird.promisify(require("npm-install-package"));

function deleteExistingHooks() {
  const srcHooksPath = path.resolve(__dirname, "../src/hooks");
  return del([srcHooksPath + "/*.js"]);
}

function deleteExistingReadmes() {
  const srcReadmesPath = path.resolve(__dirname, "../src/_readmes");
  return del([srcReadmesPath + "/*.js"]);
}

function getHookPath(hookName) {
  return path.resolve(__dirname, "../src/hooks/" + hookName + ".js");
}
function getReadmePath(hookName) {
  return path.resolve(__dirname, "../src/_readmes/" + hookName + ".js");
}

function getTemplate(pkgName) {
  return "import p from '" + pkgName + "';\nexport default p;";
}

function writeToHooksFolderInWebsiteSrc(publishedPackageNames) {
  return publishedPackageNames.map(pkgName => {
    const contents = getTemplate(pkgName);
    const hookName = pkgName.split("use-")[1];
    return write(getHookPath(hookName), contents);
  });
}

function writeToReadmeFolderInWebsiteSrc(readmes, hookNames) {
  return readmes.map(pkgName => {
    const contents = getTemplate(pkgName);
    const hookName = pkgName.split("use-")[1];
    return write(getHookPath(hookName), contents);
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
      const readmePromises = publishedPackageNames.map(package => {
        return fetch(
          `https://raw.githubusercontent.com/imbhargav5/rooks/master/packages/${
            package.name
          }/README.md`
        ).then(r => r.text());
      });
      deleteExistingReadmes()
        .then(() => readmePromises())
        .then(readmes => {
          return writeToReadmeFolderInWebsiteSrc(
            readmes,
            publishedPackageNames
          );
        });
      deleteExistingHooks()
        .then(() => {
          return writeToHooksFolderInWebsiteSrc(publishedPackageNames);
        })
        .then(() => {
          const installPkgs = publishedPackageNames.map(m => `${m}@latest`);
          process.chdir(path.join(__dirname, "../src"));
          return install(installPkgs, { save: true });
        });
    });
  });
