import fs from "fs";
import path from "path";
import sortBy from "lodash.sortby";
import { IHookDesc } from "../types";
const listOfHooksJsonPath = path.join(__dirname, "../hooks-list.json");

export default function ({ name, description }: IHookDesc) {
  const listOfHooksJson = fs.readFileSync(listOfHooksJsonPath, "utf-8");
  const obj = JSON.parse(listOfHooksJson);
  obj.hooks.push({ name, description });
  obj.hooks = sortBy(obj.hooks, "name");
  fs.writeFileSync(listOfHooksJsonPath, JSON.stringify(obj, null, 2), "utf-8");
}
