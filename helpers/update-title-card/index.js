const replaceString = require("replace-string");
const camelCase = require("camel-case")
const fs = require("fs")
const path = require('path');
var currentPath = process.cwd();
const pkg = require(path.join(currentPath, "./package.json"));
if(!Array.isArray(pkg.keywords)){
    pkg.keywords=[]
}
const svgContent = fs.readFileSync("../../template/title-card.svg","utf-8")

const {name, description} = pkg;
const hookExportedName = camelCase( name.split("@rooks/")[1], {delimiter: "-"})
const trimmedDescription = description.substring(0,130);
const descriptionWords = trimmedDescription.split(/\s+/);
const descriptionArray = ["","",""];  
let index = 0;

descriptionWords.forEach(descriptionWord => {
  let currentItem = descriptionArray[index] || "";
  if(currentItem.length + descriptionWord.length < 50){
    currentItem = `${currentItem} ${descriptionWord}`
  }else{
    index++;
    let currentItem = descriptionArray[index] || "";
    currentItem = `${currentItem} ${descriptionWord}`
  }
  descriptionArray[index] = currentItem
});

let result = svgContent;
result = replaceString(result,"%name%",hookExportedName)
result = replaceString(result, "%description0%", descriptionArray[0]);
result = replaceString(result, "%description1%", descriptionArray[1]);
result = replaceString(result, "%description2%", descriptionArray[2]);
fs.writeFileSync(path.join(currentPath,"./title-card.svg"), svgContent, "utf8");
