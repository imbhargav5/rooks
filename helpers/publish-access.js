const readPkgUp = require("read-pkg-up");
const writePkg = require("write-pkg");

const result = readPkgUp.sync();
if (result && result.pkg) {
  result.pkg.publishConfig = {
    access: "public"
  };
  writePkg(result.pkg);
}
