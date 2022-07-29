/* eslint-disable no-inner-declarations */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import pkgDir from "pkg-dir";
import { remark } from "remark";
import frontmatter from "remark-frontmatter";
import { zone } from "mdast-zone";
import { fromMarkdown } from "mdast-util-from-markdown";
import esMain from "es-main";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

const updatePackageListToMarkdown = async () => {
  function createZoneReplacePlugin(commentName, mdastToInject) {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const plugin = () => {
      function mutate(start, _nodes, end) {
        return [start, mdastToInject, end];
      }

      function transform(tree) {
        zone(tree, commentName, mutate);
      }

      return transform;
    };

    return plugin;
  }

  const PROJECT_ROOT = await pkgDir(__dirname);
  if (PROJECT_ROOT) {
    const hooksListJSON = join(PROJECT_ROOT, "./helpers/hooks-list.json");

    const { hooks: hooksList } = JSON.parse(
      readFileSync(hooksListJSON, "utf8")
    );
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const markdownTemplate = ({ name, description }) =>
      `[${name}](https://react-hooks.org/docs/${name}) - ${description}`;

    const pluginsListMdast = {
      children: hooksList.map((pkg) => ({
        children: [fromMarkdown(markdownTemplate(pkg))],
        spread: false,
        type: "listItem",
      })),
      ordered: false,
      spread: false,
      start: 1,
      type: "list",
    };

    const pluginsCountMdast = {
      children: [
        {
          type: "text",
          value: `✅ Collection of ${hooksList.length} hooks as standalone modules.`,
        },
      ],
      type: "paragraph",
    };

    const updateMarkdownFile = (filePath) => {
      const readmeContentString =
        readFileSync(join(PROJECT_ROOT, filePath), "utf8") ?? "";
      const readmeVFile = remark()
        .use(frontmatter)
        .use(createZoneReplacePlugin("hookslist", pluginsListMdast))
        .use(createZoneReplacePlugin("hookscount", pluginsCountMdast))
        .processSync(readmeContentString);
      writeFileSync(filePath, String(readmeVFile), "utf8");
    };

    updateMarkdownFile("./README.md");
    updateMarkdownFile("./docs/list-of-hooks.md");
  } else {
    console.warn("Could not find project root");
  }
};

export default updatePackageListToMarkdown;

if (esMain(import.meta)) {
  updatePackageListToMarkdown();
}
