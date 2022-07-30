import fs from "fs";
import sortBy from "lodash.sortby";
import { join } from "path";
import pkgDir from "pkg-dir";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function addHookToListAndUpdate({
  name,
  description,
  category,
}) {
  const PROJECT_ROOT = await pkgDir(__dirname);
  if (PROJECT_ROOT) {
    const listOfHooksJsonPath = join(PROJECT_ROOT, "./data/hooks-list.json");
    const listOfHooksJson = fs.readFileSync(listOfHooksJsonPath, "utf-8");
    const obj = JSON.parse(listOfHooksJson);
    obj.hooks.push({ name, description, category });
    obj.hooks = sortBy(obj.hooks, "name");
    fs.writeFileSync(
      listOfHooksJsonPath,
      JSON.stringify(obj, null, 2),
      "utf-8"
    );
  }
}
