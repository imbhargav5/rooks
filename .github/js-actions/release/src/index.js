import { promises as fs } from "fs";
import PathUtils from "path";
import semver from "semver";
import * as core from "@actions/core";
import { exec } from "@actions/exec";
import { execSync } from "child_process";

const gitRev = execSync("git rev-parse HEAD").toString();

async function setPrereleaseVersion() {
  const packageFile = "./package.json";
  const lernaFile = "./lerna.json";
  console.log(await fs.readdir(process.cwd()));
  const pkg = JSON.parse((await fs.readFile(packageFile)).toString());
  const lernaJson = JSON.parse((await fs.readFile(lernaFile)).toString());

  if (lernaJson.version.includes("-dev.")) {
    console.log("Prerelease version already set");
    process.exit(1);
  }

  lernaJson.version = `${semver.inc(
    lernaJson.version,
    "patch"
  )}-dev.${gitRev.slice(0, 9)}`;

  await fs.writeFile(lernaFile, JSON.stringify(pkg, null, "    "));
  console.log("Prerelease version: " + lernaJson.version);
  return lernaJson.version;
}

async function isDir(path) {
  return fs.stat(path).then(
    s => s.isDirectory(),
    () => false
  );
}

async function isFile(path) {
  return fs.stat(path).then(
    s => s.isFile(),
    () => false
  );
}

async function run() {
  const dir = core.getInput("dir");
  if (dir) {
    process.chdir(dir);
  }

  const tag = core.getInput("tag") || "next";

  if (!/[a-z]+/.test(tag)) {
    core.setFailed(`Invalid tag format "${tag}". Only a-z characters.`);
    return;
  }

  // type is "stable" or "prerelease"
  const type = core.getInput("type");

  if (!["stable", "prerelease"].includes(type)) {
    core.setFailed("You must set the 'type' input to 'stable' or 'prerelease'");
    return;
  }

  const npmToken = core.getInput("token");

  if (!npmToken) {
    core.setFailed("'token' input not set");
    return;
  }

  await fs.writeFile(
    PathUtils.join(process.env.HOME || "~", ".npmrc"),
    `//registry.npmjs.org/:_authToken=${npmToken}`
  );

  await exec("npm whoami");

  /* check if the deps where installed in a previous step */
  const isInstalled = await isDir("node_modules");

  if (!isInstalled) {
    await exec("yarn install");
  }

  if (type === "prerelease") {
    const version = await setPrereleaseVersion();
    console.log(process.cwd());
    await exec(
      `lerna version ${version} --force-publish=* --no-commit-hooks --no-git-tag-version --yes --no-push`
    );
    //await exec(`lerna publish --dist-tag ${tag} --dry-run`);
  } else {
    //await exec("npm publish");
  }
}

run().catch(error => {
  console.log("Action failed", error);
  core.setFailed(error.message);
});
