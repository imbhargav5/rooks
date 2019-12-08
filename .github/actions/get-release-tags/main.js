const cp = require("child_process");
cp.execSync(`cd ${__dirname}; npm ci`);

const core = require("@actions/core");

const exec = cmd =>
  cp
    .execSync(cmd)
    .toString()
    .trim();

const currentTag = exec(
  `git describe --abbrev=0 --tags ${process.env.GITHUB_SHA}`
);
const lastTag = exec(`git describe --abbrev=0 --tags ${currentTag}^`);
// set outputs
core.setOutput("old", lastTag);
core.setOutput("new", currentTag);
