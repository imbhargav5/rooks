import { camelCase } from "camel-case";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
var currentPath = process.cwd();
const pkg = require(join(currentPath, "./package.json"));
import truncate from "lodash.truncate";
import { replaceString } from "../create";

if (!Array.isArray(pkg.keywords)) {
  pkg.keywords = [];
}
const svgContent = readFileSync("../../template/title-card.svg", "utf-8");

const { name, description } = pkg;
const hookExportedName = camelCase(name.split("@rooks/")[1]);
const trimmedDescription = truncate(description, {
  length: 130,
});
const descriptionWords: string[] = trimmedDescription.split(/\s+/);
const descriptionSplitUp = descriptionWords.reduce(
  (acc, descriptionWord) => {
    let { currentAccIndex, values } = acc;
    const descriptionArray = [...values];
    let currentItem = descriptionArray[currentAccIndex] || "";
    if (currentItem.length + descriptionWord.length > 50) {
      currentAccIndex = currentAccIndex + 1;
      currentItem = "";
      descriptionArray[currentAccIndex] = currentItem;
    }
    currentItem = `${currentItem} ${descriptionWord}`;
    descriptionArray[currentAccIndex] = currentItem;
    return {
      currentAccIndex,
      values: [...descriptionArray],
    };
  },
  {
    values: ["", "", ""],
    currentAccIndex: 0,
  }
);

const { values: descriptionArray } = descriptionSplitUp;

let result = svgContent;
//console.log(descriptionArray)
result = replaceString(result, "%name%", hookExportedName);
result = replaceString(result, "%description0%", descriptionArray[0]);
result = replaceString(result, "%description1%", descriptionArray[1]);
result = replaceString(result, "%description2%", descriptionArray[2]);
writeFileSync(join(currentPath, "./title-card.svg"), result, "utf8");
