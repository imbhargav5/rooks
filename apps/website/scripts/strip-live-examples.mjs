#!/usr/bin/env node
// Strips <LiveExample .../> blocks from specific hook docs where Sandpack's
// embedded iframe fundamentally cannot host the demo (multi-file workers,
// cross-origin-gated permissions policies, etc.).
//
// Run from repo root: node apps/website/scripts/strip-live-examples.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { EXCLUDED_HOOKS } from './live-example-exclusions.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOOKS_DIR = path.resolve(__dirname, '../content/docs/hooks');

// Matches one <LiveExample ... code={`...`} ... /> block and the blank line above it.
const LIVE_EXAMPLE_RE = /\n\n<LiveExample\b[^>]*?code=\{`[\s\S]*?`\}[^>]*?\/>/g;

async function stripFile(file) {
    const src = await readFile(file, 'utf8');
    const out = src.replace(LIVE_EXAMPLE_RE, '');
    const removed = (src.match(LIVE_EXAMPLE_RE) ?? []).length;
    if (removed > 0) {
        await writeFile(file, out, 'utf8');
    }
    return removed;
}

async function main() {
    let total = 0;
    for (const rel of EXCLUDED_HOOKS) {
        const file = path.join(HOOKS_DIR, rel);
        const removed = await stripFile(file);
        console.log(`  [-${removed}] ${rel}`);
        total += removed;
    }
    console.log(`\nStripped ${total} <LiveExample> blocks from ${EXCLUDED_HOOKS.length} files.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
