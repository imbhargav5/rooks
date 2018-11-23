const fetch = require("isomorphic-fetch");

function writeToHooksFolderInWebsiteSrc(publishedPackageNames) {}

fetch("https://react-hooks.org/api/hooks")
  .then(r => r.json())
  .then(response => {
    const promises = response.map(package => {
      return fetch(
        `https://raw.githubusercontent.com/react-hooks-org/rooks/master/packages/${
          package.name
        }/package.json`
      ).then(r => r.json());
    });
    Promise.all(promises).then(packages => {
      const publishedPackages = packages.filter(
        p => p.publishConfig && p.publishConfig.access === "public"
      );
      const publishedPackageNames = publishedPackages.map(p => p.name);
    });
  });
