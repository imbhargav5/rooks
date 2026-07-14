import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateDocumentation } from "./generate";
import { validateDocumentation } from "./validate";

function write(rootDir: string, relativePath: string, content: string): void {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function hookPage(overrides = ""): string {
  return `---
title: useFixture
description: "A fixture hook."
entrypoint: rooks
status: stable
aliases: []
related: []
---

## About

A fixture hook.

## Example

\`\`\`tsx
import { useFixture } from "rooks";

export function Example() {
  useFixture();
  return <p>Fixture active.</p>;
}
\`\`\`

## Parameters

No parameters.

## Return value

Returns \`void\`.

## Behavior and lifecycle

Runs during render.

## Compatibility and accessibility

No browser requirements.

## Related

No related hooks.
${overrides}`;
}

function fixtureRoot(): string {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "rooks-docs-fixture-"));
  write(
    rootDir,
    "pnpm-workspace.yaml",
    'packages:\n  - "apps/*"\n  - "packages/*"\n'
  );
  write(
    rootDir,
    "packages/rooks/package.json",
    JSON.stringify({
      name: "rooks",
      type: "module",
      exports: {
        ".": {
          types: "./dist/esm/index.d.ts",
          import: "./dist/esm/index.js",
          default: "./dist/esm/index.js",
        },
        "./experimental": {
          types: "./dist/esm/experimental.d.ts",
          import: "./dist/esm/experimental.js",
          default: "./dist/esm/experimental.js",
        },
        "./temporal": {
          types: "./dist/esm/temporal.d.ts",
          import: "./dist/esm/temporal.js",
          default: "./dist/esm/temporal.js",
        },
      },
    })
  );
  write(rootDir, "apps/website/redirects.json", "[]\n");
  write(
    rootDir,
    "packages/rooks/src/hooks/useFixture.ts",
    "export function useFixture(): void {}\nexport interface FixtureOptions { enabled: boolean }\n"
  );
  write(
    rootDir,
    "packages/rooks/src/index.ts",
    'export { useFixture } from "./hooks/useFixture";\nexport type { FixtureOptions } from "./hooks/useFixture";\n'
  );
  write(
    rootDir,
    "packages/rooks/src/experimental.ts",
    "// experimental exports\n"
  );
  write(rootDir, "packages/rooks/src/temporal.ts", "// temporal exports\n");
  write(
    rootDir,
    "apps/website/content/docs/hooks/(state)/useFixture.mdx",
    hookPage()
  );
  return rootDir;
}

function withFixture(run: (rootDir: string) => void): void {
  const rootDir = fixtureRoot();
  try {
    run(rootDir);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
}

function issues(rootDir: string, typecheckSnippets = false) {
  return validateDocumentation({ rootDir, typecheckSnippets });
}

test("reports a public hook without a page and names its symbol", () =>
  withFixture((rootDir) => {
    fs.rmSync(
      path.join(
        rootDir,
        "apps/website/content/docs/hooks/(state)/useFixture.mdx"
      )
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "api/missing-page" &&
          item.message.includes("useFixture")
      )
    );
  }));

test("reports a page for an internal symbol and names its file", () =>
  withFixture((rootDir) => {
    write(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useInternal.mdx",
      hookPage().replaceAll("useFixture", "useInternal")
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "api/orphan-page" &&
          item.file.includes("useInternal.mdx")
      )
    );
  }));

test("reports a hook imported from the wrong entrypoint", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace('from "rooks"', 'from "rooks/temporal"')
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "imports/symbol" && item.message.includes("useFixture")
      )
    );
  }));

test("reports an undocumented barrel alias", () =>
  withFixture((rootDir) => {
    fs.appendFileSync(
      path.join(rootDir, "packages/rooks/src/index.ts"),
      'export { useFixture as useFixtureAlias } from "./hooks/useFixture";\n'
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "frontmatter/aliases" &&
          item.message.includes("useFixtureAlias")
      )
    );
  }));

test("reports mismatched frontmatter with its file", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace("entrypoint: rooks", "entrypoint: rooks/temporal")
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "frontmatter/entrypoint" &&
          item.file.includes("useFixture.mdx")
      )
    );
  }));

test("reports a broken local route", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.appendFileSync(
      filePath,
      "\n[Missing guide](/docs/guides/does-not-exist)\n"
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "links/local" && item.message.includes("does-not-exist")
      )
    );
  }));

test("reports a public alias whose shared redirect is missing", () =>
  withFixture((rootDir) => {
    fs.appendFileSync(
      path.join(rootDir, "packages/rooks/src/index.ts"),
      'export { useFixture as useFixtureAlias } from "./hooks/useFixture";\n'
    );
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace("aliases: []", "aliases: [useFixtureAlias]")
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "redirects/alias" &&
          item.message.includes("useFixtureAlias")
      )
    );
  }));

test("reports a public alias whose shared redirect is not permanent", () =>
  withFixture((rootDir) => {
    fs.appendFileSync(
      path.join(rootDir, "packages/rooks/src/index.ts"),
      'export { useFixture as useFixtureAlias } from "./hooks/useFixture";\n'
    );
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace("aliases: []", "aliases: [useFixtureAlias]")
    );
    write(
      rootDir,
      "apps/website/redirects.json",
      `${JSON.stringify(
        [
          {
            source: "/docs/hooks/useFixtureAlias",
            destination: "/docs/hooks/useFixture",
            permanent: false,
          },
        ],
        null,
        2
      )}\n`
    );

    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "redirects/alias" &&
          item.message.includes("permanent redirect")
      )
    );
  }));

test("reports a broken repository-document link", () =>
  withFixture((rootDir) => {
    write(
      rootDir,
      "CONTRIBUTING.md",
      "See [the missing guide](./docs/does-not-exist.md).\n"
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "links/repository" &&
          item.file === "CONTRIBUTING.md" &&
          item.message.includes("does-not-exist.md")
      )
    );
  }));

test("reports a missing required section", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs.readFileSync(filePath, "utf8").replace("## Related", "### Related")
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "sections/missing" && item.message.includes("related")
      )
    );
  }));

test("reports generic lifecycle and compatibility placeholders", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace(
          "Runs during render.",
          "Document execution timing, cleanup, concurrency, and error behavior while implementing the hook."
        )
        .replace(
          "No browser requirements.",
          "Verify SSR, browser support, permissions, cleanup, errors, and accessibility for the environments your product supports."
        )
    );
    const result = issues(rootDir);
    assert.ok(
      result.some((item) => item.code === "content/placeholder-lifecycle")
    );
    assert.ok(
      result.some((item) => item.code === "content/placeholder-compatibility")
    );
  }));

test("reports the current generic React lifecycle placeholder", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace(
          "Runs during render.",
          "The hook follows React's render and effect lifecycle."
        )
    );
    const result = issues(rootDir);
    assert.ok(
      result.some((item) => item.code === "content/placeholder-lifecycle")
    );
  }));

test("reports parameter or return text that defers to the generated signature", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace(
          "No parameters.",
          "The generated TypeScript signature above is the source of truth for accepted parameters."
        )
    );
    const result = issues(rootDir);
    assert.ok(
      result.some((item) => item.code === "content/placeholder-signature")
    );
  }));

test("reports a relative local import in the primary example", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace(
          'import { useFixture } from "rooks";',
          'import { useFixture } from "rooks";\nimport "./styles.css";'
        )
    );
    const result = issues(rootDir);
    assert.ok(result.some((item) => item.code === "examples/local-import"));
  }));

test("reports a relative local import in a secondary executable fence", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.appendFileSync(filePath, '\n```ts\nimport "../fixture-helper";\n```\n');
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "examples/local-import" &&
          item.message.includes("executable examples")
      )
    );
  }));

test("reports a relative local import outside hook reference pages", () =>
  withFixture((rootDir) => {
    write(
      rootDir,
      "apps/website/content/docs/guides/fixture.mdx",
      '---\ntitle: Fixture guide\ndescription: Fixture.\n---\n\n```tsx\nimport "./styles.css";\nexport default function Example() { return <p>Fixture</p>; }\n```\n'
    );
    const result = issues(rootDir);
    assert.ok(
      result.some(
        (item) =>
          item.code === "examples/local-import" &&
          item.file === "guides/fixture.mdx"
      )
    );
  }));

test("reports a Markdown H1 in a hook body", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.appendFileSync(filePath, "\n# Duplicate hook title\n");
    const result = issues(rootDir);
    assert.ok(result.some((item) => item.code === "sections/duplicate-title"));
  }));

test("reports an invalid TypeScript example with its MDX location", () =>
  withFixture((rootDir) => {
    const filePath = path.join(
      rootDir,
      "apps/website/content/docs/hooks/(state)/useFixture.mdx"
    );
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf8")
        .replace(
          "useFixture();",
          "const invalid: string = 42;\n  useFixture();"
        )
    );
    const result = issues(rootDir, true);
    assert.ok(
      result.some(
        (item) =>
          item.code === "snippets/typescript" &&
          item.file.includes("useFixture.mdx") &&
          item.message.includes("number")
      )
    );
  }));

test("generated-file check reports a stale README", () =>
  withFixture((rootDir) => {
    write(
      rootDir,
      "packages/rooks/README.md",
      "Before\n<!--hookslist start-->\nstale\n<!--hookslist end-->\nAfter\n"
    );
    write(rootDir, ".all-contributorsrc", '{"contributors":[]}\n');
    write(
      rootDir,
      "apps/website/src/components/contributors-list-data.ts",
      "export const contributorsListData = {};\n"
    );
    assert.throws(
      () => generateDocumentation({ check: true, rootDir }),
      /packages\/rooks\/README\.md/
    );
  }));
