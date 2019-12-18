const cp = require("child_process");
cp.execSync(`cd ${__dirname}; npm ci`);

const core = require("@actions/core");

const exec = cmd =>
  cp
    .execSync(cmd)
    .toString()
    .trim();

exec(`git fetch origin master`);

const latesetTag = exec(
  `git describe --abbrev=0 --tags ${process.env.GITHUB_SHA}`
);
core.setOutput("latest", latesetTag);
