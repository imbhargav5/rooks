import preval from "babel-plugin-preval/macro";

const hookMap = preval`
    //1234
    const fs= require("fs");
    const path = require("path");
    const capitalize = require("lodash.capitalize");

    const hookMap = {}
    const fileNames = fs.readdirSync("./hooks").filter(i=>!i.includes("mouse")).map(fileName => path.parse(fileName).name);
    const hookKeys = fileNames.map(hookName => {
        const hookKey = \`use\${ hookName
        .split("-")
        .map(capitalize)
        .join("")}\`;
        return hookKey
    })
    hookKeys.forEach((hookKey, index) =>{
        let rook = require("@rooks/use-"+fileNames[index]);
        hookMap[hookKey] = rook.default || rook
    });
    module.exports = hookMap;
`;

export default hookMap;
