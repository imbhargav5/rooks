const cp = require("child_process");
cp.execSync(`cd ${__dirname}; npm ci`);
const core = require("@actions/core");
const stable = require('semver-stable');

const tag = core.getInput("tag", { required: true });

core.setOutput("result", stable.is(tag) ? "1" : "0");