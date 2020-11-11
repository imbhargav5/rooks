var fromMarkdown = require("mdast-util-from-markdown");
var compact = require("mdast-util-compact");
var toMarkdown = require("mdast-util-to-markdown");
const normalizeHeadings = require('mdast-normalize-headings')
var strip = require('remark-strip-badges')
var remark = require('remark')
const behead = require('remark-behead')
const transformHeadings = require('./transform-headings')
const removeTopHeading = require('./remove-top-heading')

function parseReadme(readmeContent) {
  try {
    var tree = fromMarkdown(readmeContent);
    tree = compact(tree);
    tree = normalizeHeadings(tree)
    let md = toMarkdown(tree);
    md = remark()
    .use(strip)
    .use(removeTopHeading)
    //.use(behead, { before: "Installation", depth: 1 })
    //.use(transformHeadings, {before: "Installation"})
    .processSync(md)
    return md;
  } catch (err) {
    console.log("ERROR in readme parse", err);
    return readmeContent;
  }
}

module.exports = parseReadme;
