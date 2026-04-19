#!/usr/bin/env node
// Augments every runnable jsx/tsx fenced code block in hook docs with a live
// <LiveExample> preview, keeping the original fenced block intact so readers
// still see syntax-highlighted source.
//
// Heuristic: only augments blocks whose body contains `export default` (i.e.
// full component examples). Snippet-only blocks are left alone.
//
// Idempotent: blocks that already have an adjacent <LiveExample> are skipped.
//
// Run from repo root: node apps/website/scripts/convert-hooks-to-live-examples.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { EXCLUDED_HOOKS } from './live-example-exclusions.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOOKS_DIR = path.resolve(__dirname, '../content/docs/hooks');
const EXCLUDED_SET = new Set(EXCLUDED_HOOKS);

function escapeForTemplateLiteral(code) {
    return code
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
}

// Matches a fenced block at the start of a line, followed optionally by
// whitespace and an existing <LiveExample ... /> so we can skip those.
const FENCE_RE = /^```(jsx|tsx)[^\n]*\n([\s\S]*?)\n```(\s*\n\s*<LiveExample\b[\s\S]*?\/>)?/gm;

async function augmentFile(file) {
    const src = await readFile(file, 'utf8');
    let added = 0;
    const out = src.replace(FENCE_RE, (match, lang, body, alreadyLive) => {
        if (alreadyLive) return match;
        if (!/export\s+default\b/.test(body)) return match;
        added += 1;
        const escaped = escapeForTemplateLiteral(body);
        const langAttr = lang === 'tsx' ? ' lang="tsx"' : '';
        const fence = match; // original fenced block, unchanged
        return `${fence}\n\n<LiveExample${langAttr} code={\`${escaped}\n\`} />`;
    });
    if (added > 0) {
        await writeFile(file, out, 'utf8');
    }
    return added;
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
        const rel = path.relative(HOOKS_DIR, file);
        if (EXCLUDED_SET.has(rel)) continue;
        const count = await augmentFile(file);
        if (count > 0) {
            totalFiles += 1;
            totalBlocks += count;
            console.log(`  [+${count}] ${path.relative(HOOKS_DIR, file)}`);
        }
    }
    console.log(
        `\nAdded ${totalBlocks} <LiveExample> previews across ${totalFiles} files.`,
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});


