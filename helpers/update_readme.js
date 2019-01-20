var shelljs = require("shelljs");
var writeFileSync = require("fs").writeFileSync;
var path = require("path");

const base = `
<br/>
<br/>
<p align="center">
  <img src="https://i.gyazo.com/67b004be5aa811e9ccd8375b9ce274e1.png" height="300" style="margin: 200px 0" />
</p>
<br/>
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)

<br/> 

Collection of regularly used custom hooks as utils for React

## [Website](https://react-hooks.org)

[![Image from Gyazo](https://i.gyazo.com/95e208eb09a97edee34eb65ef1be5367.png)](https://gyazo.com/95e208eb09a97edee34eb65ef1be5367)

## Packages

`;
const destReadme = path.join(__dirname, "../README.md");
writeFileSync(destReadme, base, "utf-8");
const readmesGlob = path.join(__dirname, "../packages/*/README.md");
shelljs.cat(readmesGlob).toEnd(destReadme);
