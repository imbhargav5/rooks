#!/usr/bin/env node
// Converts runnable jsx/tsx fenced code blocks in hook docs into <LiveExample> MDX components.
//
// Heuristic: only converts blocks whose body contains `export default` (i.e. full
// component examples). Snippets without a default export stay as static code blocks.
//
// Run from repo root: node apps/website/scripts/convert-hooks-to-live-examples.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOOKS_DIR = path.resolve(__dirname, '../content/docs/hooks');

function escapeForTemplateLiteral(code) {
    return code
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
}

// Matches a fenced block at the start of a line. Capture: lang, body.
// Non-greedy body, closing fence on its own line.
const FENCE_RE = /^```(jsx|tsx)[^\n]*\n([\s\S]*?)\n```$/gm;

async function convertFile(file) {
    const src = await readFile(file, 'utf8');
    let converted = 0;
    const out = src.replace(FENCE_RE, (match, lang, body) => {
        if (!/export\s+default\b/.test(body)) return match;
        converted += 1;
        const escaped = escapeForTemplateLiteral(body);
        const langAttr = lang === 'tsx' ? ' lang="tsx"' : '';
        return `<LiveExample${langAttr} code={\`${escaped}\n\`} />`;
    });
    if (converted > 0) {
        await writeFile(file, out, 'utf8');
    }
    return converted;
}

async function collectMdx(dir) {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true });
    return entries
        .filter((e) => e.isFile() && e.name.endsWith('.mdx'))
        .map((e) => path.join(e.parentPath ?? e.path, e.name));
}

async function main() {
    const files = await collectMdx(HOOKS_DIR);
    let totalFiles = 0;
    let totalBlocks = 0;
    for (const file of files) {
        const count = await convertFile(file);
        if (count > 0) {
            totalFiles += 1;
            totalBlocks += count;
            console.log(`  [${count}] ${path.relative(HOOKS_DIR, file)}`);
        }
    }
    console.log(`\nConverted ${totalBlocks} blocks across ${totalFiles} files.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

