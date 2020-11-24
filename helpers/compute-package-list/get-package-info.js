const path = require('path');
var currentPath = process.cwd();
const pkg = require(path.join(currentPath, "./package.json"));
if(!Array.isArray(pkg.keywords)){
    pkg.keywords=[]
}
console.log(pkg.name,"|||",pkg.description,"|||",pkg.keywords.join(","));
