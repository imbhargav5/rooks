import path from "path";
var currentPath = process.cwd();
const filePath = path.join(currentPath, "./package.json");
const pkg = require(filePath);
import fs from "fs";

if (!pkg.license) {
  pkg.license = "MIT";
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2), "utf-8");
}
