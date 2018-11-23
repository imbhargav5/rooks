// eslint-disable-next-line
const fs = require("fs");
const PATTERN = /^readme\.(?:markdown|mdown|mkdn|md|textile|rdoc|org|creole|mediawiki|wiki|rst|asciidoc|adoc|asc|pod|txt)/i;

module.exports = function readmeFilename(dir) {
  dir = dir || ".";

  const files = fs.readdirSync(dir);
  return (filename = files.find(file => PATTERN.test(file)) || null);
};
