const meow = require("meow");
const readPkgUp = require("read-pkg-up");
const writePkg = require("write-pkg");

const cli = meow(
  `
    Usage
      $ cd directoryOfPkg
      $ directoryOfPkg > toggle-pkg-privacy --private
      $ directoryOfPkg > toggle-pkg-privacy --public
 
    Options
      --public, - Set pkg json public
      --private, -  Set pkg json private
 
    Examples
      $ directoryOfPkg > toggle-pkg-privacy --public
      $ directoryOfPkg > toggle-pkg-privacy --private
`,
  {
    flags: {
      public: {
        type: "boolean",
        alias: "p"
      },
      private: {
        type: "boolean",
        alias: "pr"
      }
    }
  }
);

if (cli.public && cli.private) {
  throw new Error("Use either private or public flags. Not both");
}

const result = readPkgUp.sync();
if (result && result.pkg) {
  console.log(result.pkg);
  if (cli.public) {
    result.pkg.private = false;
  }
  if (cli.private) {
    result.pkg.public = false;
  }
  const { readme, ...rest } = result.pkg;
  if (readme.includes("ERROR")) {
    writePkg(rest);
  } else {
    writePkg(result.pkg);
  }
}
