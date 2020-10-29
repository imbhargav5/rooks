const cp = require("child_process");
cp.execSync(`cd ${__dirname}; npm ci`);

const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("token", { required: true });
const tag = core.getInput("tag", { required: true });
const changelog = core.getInput("changelog", { required: true });
const isTagStableInput = core.getInput("is-tag-stable", { required: true });
const isTagStable = isTagStableInput === "1" || isTagStableInput === 1 ? true : false;
const isPrerelease = !isTagStable;
const shouldReleaseBeDraft = isTagStable;

const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY.split("/");

console.log("isTagStable value is ", isTagStable);
console.log("shouldReleaseBeDraft value is ", shouldReleaseBeDraft);
console.log("isPrerelease value is ", isPrerelease);

const octokit = new github.GitHub(token);

octokit.repos.createRelease({
    owner: repoOwner,
    repo: repoName,
    tag_name: tag,
    body: JSON.parse(changelog),
    draft: shouldReleaseBeDraft,
    prerelease: isPrerelease,
    name: tag,
});