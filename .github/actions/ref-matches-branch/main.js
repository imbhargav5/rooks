const cp = require("child_process");
cp.execSync(`cd ${__dirname}; npm ci`);

const core = require("@actions/core");

const exec = cmd => cp.execSync(cmd).toString().trim();

const name = core.getInput("name", { required: true });
exec(`git fetch origin`)
const current = exec(`git rev-parse HEAD`);
exec(`git checkout ${name}`);
const branch = exec(`git rev-parse ${name}`);

core.setOutput("result", current === branch ? "1" : "0");