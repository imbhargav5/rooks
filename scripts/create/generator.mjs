import fs from "node:fs";
import path from "node:path";
import manifestModule from "../docs/manifest.ts";

const { ENTRYPOINTS, resolveEntrypointFiles } = manifestModule;

export { ENTRYPOINTS };

export const CATEGORIES = [
  "animation",
  "browser",
  "dev",
  "events",
  "experimental",
  "form",
  "keyboard",
  "lifecycle",
  "mouse",
  "performance",
  "state",
  "state-history",
  "temporal",
  "ui",
  "utilities",
  "viewport",
];

function expectedCategory(entrypoint) {
  if (entrypoint === "rooks/experimental") return "experimental";
  if (entrypoint === "rooks/temporal") return "temporal";
  return undefined;
}

export function validateHookOptions({
  name,
  description,
  category,
  entrypoint,
}) {
  const errors = [];
  if (!/^use[A-Z][A-Za-z0-9]*$/.test(name ?? "")) {
    errors.push(
      "--name must be a camelCase hook name beginning with use (for example, useIdle)"
    );
  }
  if (!description?.trim()) errors.push("--description is required");
  if (!CATEGORIES.includes(category)) {
    errors.push(`--category must be one of: ${CATEGORIES.join(", ")}`);
  }
  if (!ENTRYPOINTS.includes(entrypoint)) {
    errors.push(`--entrypoint must be one of: ${ENTRYPOINTS.join(", ")}`);
  }
  const requiredCategory = expectedCategory(entrypoint);
  if (requiredCategory && category !== requiredCategory) {
    errors.push(
      `${entrypoint} hooks must use the ${requiredCategory} category`
    );
  }
  if (
    entrypoint === "rooks" &&
    ["experimental", "temporal"].includes(category)
  ) {
    errors.push(`rooks hooks cannot use the ${category} category`);
  }
  return errors;
}

function sourceTemplate({ name, description }) {
  return `/**
 * ${name}
 * @description ${description}
 * @see {@link https://rooks.vercel.app/docs/hooks/${name}}
 */
function ${name}(): void {
  // Add the hook implementation here.
}

export { ${name} };
`;
}

function testTemplate({ name }) {
  return `import { ${name} } from "../hooks/${name}";

describe("${name}", () => {
  it("is exported as a hook", () => {
    expect.hasAssertions();
    expect(${name}).toBeTypeOf("function");
  });
});
`;
}

function docsTemplate({ name, description, entrypoint }) {
  const status =
    entrypoint === "rooks/experimental" ? "experimental" : "stable";
  return `---
title: ${name}
description: "${description.replaceAll('"', '\\"')}"
entrypoint: ${entrypoint}
status: ${status}
aliases: []
related: []
---

## About

${description}

## Example

\`\`\`tsx
import { ${name} } from "${entrypoint}";

export default function Example() {
  ${name}();
  return <p>${name} is active.</p>;
}
\`\`\`

## Parameters

This hook currently accepts no parameters.

## Return value

This hook currently returns \`void\`.

## Behavior and lifecycle

The generated implementation has no side effects. Replace this paragraph with implementation-specific render timing, cleanup, concurrency, and error semantics while implementing the hook.

## Compatibility and accessibility

The generated implementation uses no browser-only APIs and can render on the server. Update this section if the implementation adds browser, hydration, permission, or accessibility requirements.

## Related

Add related public hooks and guides to the frontmatter and this section.
`;
}

export function getHookOutputPaths(rootDir, { name, category, entrypoint }) {
  const entrypointFiles = resolveEntrypointFiles(rootDir);
  return {
    source: path.join(rootDir, `packages/rooks/src/hooks/${name}.ts`),
    test: path.join(rootDir, `packages/rooks/src/__tests__/${name}.spec.ts`),
    docs: path.join(
      rootDir,
      `apps/website/content/docs/hooks/(${category})/${name}.mdx`
    ),
    barrel: path.join(rootDir, entrypointFiles[entrypoint]),
  };
}

export function generateHook(options, { rootDir = process.cwd() } = {}) {
  const normalized = {
    ...options,
    description: options.description?.trim(),
  };
  const errors = validateHookOptions(normalized);
  if (errors.length > 0) throw new Error(errors.join("\n"));

  const output = getHookOutputPaths(rootDir, normalized);
  const collisions = [output.source, output.test, output.docs].filter(
    (filePath) => fs.existsSync(filePath)
  );
  if (!fs.existsSync(output.barrel)) {
    collisions.push(`${output.barrel} (barrel does not exist)`);
  }
  const exportLine = `export { ${normalized.name} } from "./hooks/${normalized.name}";`;
  const barrelSource = fs.existsSync(output.barrel)
    ? fs.readFileSync(output.barrel, "utf8")
    : "";
  const exportPattern = new RegExp(
    `export\\s*\\{[^}]*\\b${normalized.name}\\b[^}]*\\}\\s*from|from\\s*["']\\./hooks/${normalized.name}["']`
  );
  if (exportPattern.test(barrelSource))
    collisions.push(`${output.barrel} (export exists)`);
  if (collisions.length > 0) {
    throw new Error(
      `Refusing to overwrite existing hook output:\n${collisions.join("\n")}`
    );
  }

  for (const filePath of [output.source, output.test, output.docs]) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(output.source, sourceTemplate(normalized), { flag: "wx" });
  fs.writeFileSync(output.test, testTemplate(normalized), { flag: "wx" });
  fs.writeFileSync(output.docs, docsTemplate(normalized), { flag: "wx" });
  fs.writeFileSync(output.barrel, `${barrelSource.trimEnd()}\n${exportLine}\n`);

  return {
    files: [output.source, output.test, output.docs, output.barrel],
    nextSteps: [
      `pnpm --filter rooks exec vitest run src/__tests__/${normalized.name}.spec.ts`,
      "pnpm --filter rooks typecheck",
      "pnpm docs:check",
      "pnpm changeset",
    ],
  };
}

export function printGenerationResult(result, rootDir = process.cwd()) {
  for (const filePath of result.files.slice(0, 3)) {
    console.log(`Created ${path.relative(rootDir, filePath)}`);
  }
  console.log("Updated the selected public entrypoint barrel.");
  console.log("\nNext steps:");
  for (const command of result.nextSteps) console.log(`  ${command}`);
  console.log(
    "\nA changeset is not created automatically; choose the semver impact after review."
  );
}
