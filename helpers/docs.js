const packageName = process.env.LERNA_PACKAGE_NAME;
const newReadmeFileName = packageName.startsWith('@rooks') ? packageName.split('@rooks/')[1] : packageName;

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function ls() {
    const { stdout, stderr } = await exec(`cp ./README.md ../docusaurus/docs/${newReadmeFileName}.md`);
    stdout && console.log('stdout:', stdout);
    stderr && console.log('stderr:', stderr);
}
ls();