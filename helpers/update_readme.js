var shelljs = require("shelljs");
var writeFileSync = require("fs").writeFileSync;
var path = require("path");

const base = `
# ⚓ rooks

Collection of regularly used custom hooks as utils for React

[![Image from Gyazo](https://i.gyazo.com/47865075bb61ca32551b344f059e4624.png)](https://gyazo.com/47865075bb61ca32551b344f059e4624)

## [Website](https://react-hooks.org)

## Packages

`;
const destReadme = path.join(__dirname, "../README.md");
writeFileSync(destReadme, base, "utf-8");
const readmesGlob = path.join(__dirname, "../packages/*/README.md");
shelljs.cat(readmesGlob).toEnd(destReadme);
