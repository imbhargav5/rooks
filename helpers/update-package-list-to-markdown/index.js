const fs = require("fs");
const path = require("path");
const remark = require("remark");
// var heading = require('mdast-util-heading-range')
var zone = require("mdast-zone");
var fromMarkdown = require("mdast-util-from-markdown");
var frontmatter = require("remark-frontmatter");
var stringify = require("remark-stringify");
const pkgDir = require("pkg-dir");

function createZoneReplacePlugin(commentName, mdastToInject) {
  return function replacePluginSection() {
    return transform;

    function transform(tree) {
      zone(tree, commentName, mutate);
    }

    function mutate(start, nodes, end) {
      return [start, mdastToInject, end];
    }
  };
}

const updatePackageListToMarkdown = async () => {
  const PROJECT_ROOT = await pkgDir(__dirname);
  const hooksListJSON = path.join(PROJECT_ROOT, "./helpers/hooks-list.json");

  const { hooks: hooksList } = JSON.parse(
    fs.readFileSync(hooksListJSON, "utf-8")
  );
  const markdownTemplate = ({ name, description }) =>
    `[${name}](https://react-hooks.org/docs/${name}) - ${description}`;

  const pluginsListMdast = {
    type: "list",
    ordered: false,
    start: 1,
    spread: false,
    children: hooksList.map((package) => ({
      type: "listItem",
      spread: false,
      children: [fromMarkdown(markdownTemplate(package))],
    })),
  };

  const pluginsCountMdast = {
    type: "paragraph",
    children: [
      {
        type: "text",
        value: `✅ Collection of ${hooksList.length} hooks as standalone modules.`,
      },
    ],
  };

  function updateMarkdownFile(filePath) {
    let readmeContent = fs.readFileSync(
      path.join(PROJECT_ROOT, filePath),
      "utf8"
    );
    console.log(path.join(PROJECT_ROOT, filePath));
    readmeContent = remark()
      .use(frontmatter)
      .use(createZoneReplacePlugin("hookslist", pluginsListMdast))
      .use(createZoneReplacePlugin("hookscount", pluginsCountMdast))
      .processSync(readmeContent);
    fs.writeFileSync(filePath, String(readmeContent), "utf8");
  }
  updateMarkdownFile("./README.md");
  updateMarkdownFile("./docs/list-of-hooks.md");
};

module.exports = updatePackageListToMarkdown;

if (require.main === module) {
  updatePackageListToMarkdown();
}
