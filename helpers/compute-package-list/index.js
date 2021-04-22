const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const replaceString = require('replace-string');
const makeDir = require('make-dir');
const ora = require('ora');
const execa = require('execa');
const remark = require('remark');
// var heading = require('mdast-util-heading-range')
var zone = require('mdast-zone');
var fromMarkdown = require('mdast-util-from-markdown');
var frontmatter = require('remark-frontmatter');

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

(async () => {
  const spinner = ora('Computing packages').start();
  const { stdout } = await execa.command(
    `wsrun -p '@rooks/' -s --report node ../../helpers/compute-package-list/get-package-info.js`
  );
  spinner.succeed('Computing packages successful');

  const pkgList = stdout.split('\n').map((package) => {
    let [name, description, tags] = package.split('|||').map((x) => x.trim());
    tags = tags.split(',');
    const hookName = name.split('@rooks/')[1];
    const docsPath = `https://react-hooks.org/docs/${hookName}`;
    return {
      name,
      description,
      tags,
      hookName,
      docsPath,
    };
  });
  const markdownTemplate = ({ hookName, description, docsPath }) =>
    `[${hookName}](${docsPath}) - ${description}`;

  const pluginsListMdast = {
    type: 'list',
    ordered: false,
    start: 1,
    spread: false,
    children: pkgList.map((package) => ({
      type: 'listItem',
      spread: false,
      children: [fromMarkdown(markdownTemplate(package))],
    })),
  };

  const pluginsCountMdast = {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        value: `✅ Collection of ${pkgList.length} hooks as standalone modules.`,
      },
    ],
  };

  function updateMarkdownFile(filePath) {
    let readmeContent = fs.readFileSync(filePath, 'utf8');
    readmeContent = remark()
      .use(frontmatter)
      .use(createZoneReplacePlugin('hookslist', pluginsListMdast))
      .use(createZoneReplacePlugin('hookscount', pluginsCountMdast))
      .processSync(readmeContent);
    fs.writeFileSync(filePath, readmeContent, 'utf8');
  }
  updateMarkdownFile('./README.md');
  updateMarkdownFile('./packages/docusaurus/docs/list-of-hooks.md');
  updateMarkdownFile('./packages/rooks/README.md');
})();
