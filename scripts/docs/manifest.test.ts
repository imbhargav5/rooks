import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildDocumentationManifest,
  extractPublicApi,
  getHookReferenceIndex,
  resolveEntrypointFiles,
} from "./manifest";

function write(rootDir: string, relativePath: string, content: string): void {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function withApiFixture(run: (rootDir: string) => void): void {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "rooks-api-fixture-"));
  try {
    write(rootDir, "pnpm-workspace.yaml", 'packages:\n  - "packages/*"\n');
    write(
      rootDir,
      "packages/rooks/package.json",
      JSON.stringify({
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
    write(
      rootDir,
      "packages/rooks/src/hooks/useDirect.ts",
      "export function useDirect(): number { return 1; }\nexport interface DirectOptions { enabled: boolean }\n"
    );
    write(
      rootDir,
      "packages/rooks/src/star-base.ts",
      "export function useStar(): string { return 'star'; }\nexport interface StarOptions { delay: number }\nexport const notHook = 1;\n"
    );
    write(
      rootDir,
      "packages/rooks/src/star.ts",
      'export * from "./star-base";\n'
    );
    write(
      rootDir,
      "packages/rooks/src/index.ts",
      [
        'export { useDirect, useDirect as useDirectAlias } from "./hooks/useDirect";',
        'export type { DirectOptions } from "./hooks/useDirect";',
        'export * from "./star";',
        "",
      ].join("\n")
    );
    write(rootDir, "packages/rooks/src/experimental.ts", "export {};\n");
    write(rootDir, "packages/rooks/src/temporal.ts", "export {};\n");
    run(rootDir);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
}

test("extracts canonical hooks, aliases, types, and all entrypoints", () => {
  const manifest = buildDocumentationManifest();
  assert.equal(manifest.publicHooks.length, 147);
  assert.deepEqual(
    manifest.aliases.map((item) => [item.name, item.canonicalName]),
    [
      ["useObjectState", "useMapState"],
      ["useOnLongHoverRef", "useOnLongHover"],
      ["useOnLongPressRef", "useOnLongPress"],
    ]
  );
  assert.equal(manifest.publicTypes.length, 58);
  assert.equal(
    manifest.publicTypes.find((item) => item.name === "UseRequestOptions")
      ?.entrypoint,
    "rooks/experimental"
  );
  assert.equal(manifest.byName.get("useObjectState")?.name, "useMapState");
  assert.match(
    manifest.byName.get("useCounter")?.signature ?? "",
    /^useCounter\(/
  );
  assert.deepEqual(
    new Set(manifest.publicHooks.map((hook) => hook.entrypoint)),
    new Set(["rooks", "rooks/experimental", "rooks/temporal"])
  );
  assert.ok(
    !manifest.publicHooks.some((hook) => hook.name === "Easing"),
    "non-hook public values stay out of the hook manifest"
  );
});

test("validates and resolves source barrels from the package export map", () => {
  assert.deepEqual(resolveEntrypointFiles(process.cwd()), {
    rooks: "packages/rooks/src/index.ts",
    "rooks/experimental": "packages/rooks/src/experimental.ts",
    "rooks/temporal": "packages/rooks/src/temporal.ts",
  });
});

test("follows export-star chains, direct re-exports, aliases, and type-only exports", () =>
  withApiFixture((rootDir) => {
    const api = extractPublicApi(rootDir).exports;
    const byName = new Map(api.map((item) => [item.name, item]));

    assert.deepEqual(
      [...byName.keys()].sort(),
      [
        "DirectOptions",
        "StarOptions",
        "notHook",
        "useDirect",
        "useDirectAlias",
        "useStar",
      ].sort()
    );
    assert.equal(byName.get("useDirect")?.kind, "value");
    assert.equal(byName.get("useDirectAlias")?.canonicalName, "useDirect");
    assert.equal(byName.get("DirectOptions")?.kind, "type");
    assert.equal(byName.get("StarOptions")?.kind, "type");
    assert.equal(byName.get("notHook")?.kind, "value");
    assert.equal(
      byName.get("useStar")?.sourceModule,
      "packages/rooks/src/star-base.ts"
    );
  }));

test("builds a serializable category reference index", () => {
  const index = getHookReferenceIndex();
  assert.ok(index.some((group) => group.category === "temporal"));
  assert.doesNotThrow(() => JSON.stringify(index));
});
