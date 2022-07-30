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
import lodash from "lodash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const emojiByCategory = {
  state: "❇️",
  effects: "🔥",
  navigator: "🚃",
  misc: "✨",
  form: "📝",
  events: "🚀",
  ui: "⚛️",
};

const updatePackageListToMarkdown = async () => {
  function createZoneReplacePlugin(commentName, mdastToInject) {
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
    const hooksListJSON = join(PROJECT_ROOT, "./data/hooks-list.json");

    const { hooks: hooksList } = JSON.parse(
      readFileSync(hooksListJSON, "utf8")
    );
    const hooksByCategory = hooksList.reduce((acc, hook) => {
      const { category } = hook;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(hook);
      return acc;
    }, {});

    const hookEntryMarkdownTemplate = ({ name, description }) =>
      `[${name}](https://react-hooks.org/docs/${name}) - ${description}`;

    const hooksByCategoryKeys = Object.keys(hooksByCategory);
    const hooksListByCategoryMDAST = {
      type: "root",
      children: [],
    };
    for (const category of hooksByCategoryKeys) {
      const hooks = hooksByCategory[category];
      const hooksListMDAST = {
        children: (hooks ?? []).map(pkg => ({
          children: [fromMarkdown(hookEntryMarkdownTemplate(pkg))],
          spread: false,
          type: "listItem",
        })),
        ordered: false,
        spread: false,
        start: 1,
        type: "list",
      };

      const headingMDAST = {
        type: "strong",
        children: [
          {
            type: "text",
            value:
              category === "ui"
                ? `<h3 align="center">${emojiByCategory["ui"] ?? "✅"} UI</h3>`
                : `<h3 align="center">${emojiByCategory[category] ??
                    "✅"} ${lodash.startCase(category)}</h3>`,
          },
        ],
      };

      hooksListByCategoryMDAST.children.push(headingMDAST);
      hooksListByCategoryMDAST.children.push(hooksListMDAST);
    }

    const pluginsCountMdast = {
      children: [
        {
          type: "text",
          value: `✅ Collection of ${hooksList.length} hooks as standalone modules.`,
        },
      ],
      type: "paragraph",
    };

    const updateMarkdownFile = filePath => {
      const readmeContentString =
        readFileSync(join(PROJECT_ROOT, filePath), "utf8") ?? "";
      const readmeVFile = remark()
        .use(frontmatter)
        .use(createZoneReplacePlugin("hookslist", hooksListByCategoryMDAST))
        .use(createZoneReplacePlugin("hookscount", pluginsCountMdast))
        .processSync(readmeContentString);
      writeFileSync(filePath, String(readmeVFile), "utf8");
    };

    updateMarkdownFile("./README.md");
    updateMarkdownFile("./apps/website/src/pages/list-of-hooks.md");
  } else {
    console.warn("Could not find project root");
  }
};

export default updatePackageListToMarkdown;

if (esMain(import.meta)) {
  updatePackageListToMarkdown();
}
