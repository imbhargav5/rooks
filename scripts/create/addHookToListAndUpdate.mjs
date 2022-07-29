import fs from "fs";
import path from "path";
import sortBy from "lodash.sortby";
import esMain from "es-main";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const listOfHooksJsonPath = path.join(__dirname, "../hooks-list.json");

export default function({ name, description }) {
  const listOfHooksJson = fs.readFileSync(listOfHooksJsonPath, "utf-8");
  const obj = JSON.parse(listOfHooksJson);
  obj.hooks.push({ name, description });
  obj.hooks = sortBy(obj.hooks, "name");
  fs.writeFileSync(listOfHooksJsonPath, JSON.stringify(obj, null, 2), "utf-8");
}
