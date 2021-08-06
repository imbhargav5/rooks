import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import remark from "remark";
// var heading = require('mdast-util-heading-range')
import zone from "mdast-zone";
import fromMarkdown from "mdast-util-from-markdown";
import frontmatter from "remark-frontmatter";
import stringify from "remark-stringify";
import pkgDir from "pkg-dir";

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
  const PROJECT_ROOT: string | any = await pkgDir(__dirname);
  const hooksListJSON = join(PROJECT_ROOT, "./helpers/hooks-list.json");

  const { hooks: hooksList } = JSON.parse(readFileSync(hooksListJSON, "utf-8"));
  const markdownTemplate = ({ name, description }) =>
    `[${name}](https://react-hooks.org/docs/${name}) - ${description}`;

  const pluginsListMdast = {
    type: "list",
    ordered: false,
    start: 1,
    spread: false,
    children: hooksList.map((pkg: { name: any; description: any }) => ({
      type: "listItem",
      spread: false,
      children: [fromMarkdown(markdownTemplate(pkg))],
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
    let readmeContent: string | any = readFileSync(
      join(PROJECT_ROOT, filePath),
      "utf8"
    );
    console.log(join(PROJECT_ROOT, filePath));
    readmeContent = remark()
      .use(frontmatter)
      .use(createZoneReplacePlugin("hookslist", pluginsListMdast))
      .use(createZoneReplacePlugin("hookscount", pluginsCountMdast))
      .processSync(readmeContent);
    writeFileSync(filePath, String(readmeContent), "utf8");
  }
  updateMarkdownFile("./README.md");
  updateMarkdownFile("./docs/list-of-hooks.md");
};

export default updatePackageListToMarkdown;

if (require.main === module) {
  updatePackageListToMarkdown();
}
