// This script will check for missing contributors in `.all-contributorsrc`,
// and using all-contributors cli's add command to add all of them as `code` type.
// If we want to add other types on a contributor, we can manually update
// it using `yarn contributors:add <username> <contribution-type>`
import { execSync } from "child_process";

function getMissingContributosList() {
  let stdout = execSync("yarn contributors:check").toString();
  return stdout.split(".all-contributorsrc:")[1].trim().split(", ");
}

function addContributorsAsCoder(list: string[]) {
  // remove all bots first
  list = list.filter((item) => !item.endsWith("[bot]"));
  console.log("missing contributors: ", list);
  for (const people of list) {
    console.log("adding: ", people);
    execSync(`yarn contributors:add ${people} code`);
  }
}

try {
  const list = getMissingContributosList();
  addContributorsAsCoder(list);
} catch (err) {
  console.log(err);
}
