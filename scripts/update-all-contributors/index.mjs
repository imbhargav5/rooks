// This script will check for missing contributors in `.all-contributorsrc`,
// and using all-contributors cli's add command to add all of them as `code` type.
// If we want to add other types on a contributor, we can manually update
// it using `yarn contributors:add <username> <contribution-type>`
import { execSync } from "child_process";

function getMissingContributorsList() {
  let stdout = execSync("yarn contributors:check").toString();
  let string = stdout;
  if (string.includes("Missing contributors in .all-contributorsrc:")) {
    string = string.split("Missing contributors in .all-contributorsrc:")[1];
    console.log(string);
  }
  if (string.includes("Unknown contributors")) {
    string = string.split("Unknown contributors")[0];
  }
  return string.trim().split(", ");
}

function addContributorsAsCoder(list) {
  // remove all bots first
  //list = list.filter((item) => !item.endsWith("[bot]"));
  console.log("missing contributors: ", list);
  for (const people of list) {
    console.log("adding: ", people);
    try {
      execSync(`yarn run contributors:add ${people} code`);
    } catch (err) {
      console.log("error adding user", people, err);
    }
  }
}

try {
  const list = getMissingContributorsList();
  addContributorsAsCoder(list);
} catch (err) {
  console.log(err);
}
