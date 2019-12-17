const packageName = process.env.LERNA_PACKAGE_NAME;
const newReadmeFileName = packageName.startsWith('@rooks') ? packageName.split('@rooks/')[1] : packageName;

const util = require('util');
const writeFileSync = require('fs').writeFileSync;
const readFile = util.promisify(require('fs').readFile);
const writeFile = util.promisify(require('fs').writeFile);
const exec = util.promisify(require('child_process').exec);

async function ls() {
    const fileContent = await readFile(`./README.md`, 'utf8');
    const updatedFileContent = `---
id: ${newReadmeFileName}
title: ${newReadmeFileName}
sidebar_label: ${newReadmeFileName}
---

${fileContent}
    `;
    await writeFile(`../docusaurus/docs/${newReadmeFileName}.md`, updatedFileContent, 'utf8');
}


ls();

async function addToSidebarJson() {
    if (newReadmeFileName === 'rooks') {
        return;
    }
    const currentSidebarJson = JSON.parse(await readFile(`../docusaurus/website/sidebars.json`, 'utf8'));
    console.log(currentSidebarJson)

    if (Object.keys(currentSidebarJson.docs['Independent Packages']).includes('newReadmeFileName')) {
        return;
    }
    const independentPackages = [...currentSidebarJson.docs["Independent Packages"], newReadmeFileName].sort();
    const newSidebarJson = {
        ...currentSidebarJson,
        docs: {
            ...currentSidebarJson.docs,
            ["Independent Packages"]: independentPackages
        }
    }
    writeFileSync(`../docusaurus/website/sidebars.json`, JSON.stringify(newSidebarJson, null, 2));
}

addToSidebarJson();