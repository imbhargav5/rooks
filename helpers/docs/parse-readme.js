var fromMarkdown = require("mdast-util-from-markdown");
var compact = require("mdast-util-compact");
var toMarkdown = require("mdast-util-to-markdown");
const normalizeHeadings = require('mdast-normalize-headings')

function parseReadme(readmeContent) {
  try {
    var tree = fromMarkdown(readmeContent);
    tree = compact(tree);
    tree = normalizeHeadings(tree)
    const md = toMarkdown(tree);
    return md;
  } catch (err) {
    console.log("ERROR in readme parse", err);
    return readmeContent;
  }
}

module.exports = parseReadme;
