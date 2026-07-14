import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  generateHook,
  getHookOutputPaths,
  validateHookOptions,
} from "./generator.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const tsxCli = path.join(repositoryRoot, "node_modules/tsx/dist/cli.mjs");

function write(rootDir, relativePath, content) {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function fixtureRoot({ temporalBarrel = "temporal.ts" } = {}) {
  const rootDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "rooks-hook-generator-")
  );
  const sourceNames = {
    rooks: "index.ts",
    "rooks/experimental": "experimental.ts",
    "rooks/temporal": temporalBarrel,
  };
  const target = (sourceName) => {
    const outputName = sourceName.replace(/\.ts$/, "");
    return {
      types: `./dist/esm/${outputName}.d.ts`,
      import: `./dist/esm/${outputName}.js`,
      default: `./dist/esm/${outputName}.js`,
    };
  };
  write(rootDir, "pnpm-workspace.yaml", 'packages:\n  - "packages/*"\n');
  write(
    rootDir,
    "packages/rooks/package.json",
    JSON.stringify({
      exports: {
        ".": target(sourceNames.rooks),
        "./experimental": target(sourceNames["rooks/experimental"]),
        "./temporal": target(sourceNames["rooks/temporal"]),
      },
    })
  );
  for (const barrel of Object.values(sourceNames)) {
    write(rootDir, `packages/rooks/src/${barrel}`, "// public exports\n");
  }
  return rootDir;
}

function snapshot(rootDir) {
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else {
        files.push([
          path.relative(rootDir, absolute),
          fs.readFileSync(absolute, "utf8"),
        ]);
      }
    }
  }
  visit(rootDir);
  return files.sort(([left], [right]) => left.localeCompare(right));
}

function runGeneratorScript(script, args, { rootDir, input } = {}) {
  return spawnSync(
    process.execPath,
    [tsxCli, path.join(scriptDirectory, script), ...args],
    {
      cwd: rootDir,
      encoding: "utf8",
      input,
    }
  );
}

const cases = [
  ["rooks", "state", "useStableFixture", "index.ts", "stable"],
  [
    "rooks/experimental",
    "experimental",
    "useExperimentalFixture",
    "experimental.ts",
    "experimental",
  ],
  ["rooks/temporal", "temporal", "useTemporalFixture", "temporal.ts", "stable"],
];

for (const [entrypoint, category, name, barrel, status] of cases) {
  test(`shared generator creates ${entrypoint} output`, () => {
    const rootDir = fixtureRoot();
    try {
      generateHook(
        {
          name,
          description: "A generated fixture hook.",
          category,
          entrypoint,
        },
        { rootDir }
      );
      const docs = fs.readFileSync(
        path.join(
          rootDir,
          `apps/website/content/docs/hooks/(${category})/${name}.mdx`
        ),
        "utf8"
      );
      assert.match(docs, new RegExp(`entrypoint: ${entrypoint}`));
      assert.match(docs, new RegExp(`status: ${status}`));
      assert.match(
        fs.readFileSync(
          path.join(rootDir, "packages/rooks/src", barrel),
          "utf8"
        ),
        new RegExp(`export \\{ ${name} \\}`)
      );
      const generated = snapshot(rootDir);
      assert.throws(
        () =>
          generateHook(
            {
              name,
              description: "A generated fixture hook.",
              category,
              entrypoint,
            },
            { rootDir }
          ),
        /Refusing to overwrite/
      );
      assert.deepEqual(snapshot(rootDir), generated);
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });
}

test("derives the selected barrel from the package export map", () => {
  const rootDir = fixtureRoot({ temporalBarrel: "custom-temporal.ts" });
  try {
    const output = getHookOutputPaths(rootDir, {
      name: "useMappedTemporal",
      category: "temporal",
      entrypoint: "rooks/temporal",
    });
    assert.equal(
      output.barrel,
      path.join(rootDir, "packages/rooks/src/custom-temporal.ts")
    );
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test("rejects invalid categories and incompatible entrypoints", () => {
  assert.ok(
    validateHookOptions({
      name: "useFixture",
      description: "Fixture",
      category: "not-real",
      entrypoint: "rooks",
    }).length > 0
  );
  assert.ok(
    validateHookOptions({
      name: "useFixture",
      description: "Fixture",
      category: "state",
      entrypoint: "rooks/temporal",
    }).some((error) => error.includes("temporal category"))
  );
});

const interfaces = [
  {
    label: "noninteractive",
    script: "cli.mjs",
    invocation(name, description, category, entrypoint) {
      return {
        args: [
          "--name",
          name,
          "--description",
          description,
          "--category",
          category,
          "--entrypoint",
          entrypoint,
        ],
      };
    },
  },
  {
    label: "interactive",
    script: "index.mjs",
    invocation(name, description, category, entrypoint) {
      return {
        args: [],
        input: `${name}\n${description}\n${entrypoint}\n${category}\n`,
      };
    },
  },
];

for (const generatorInterface of interfaces) {
  for (const [entrypoint, category, baseName, barrel] of cases) {
    test(`${generatorInterface.label} interface creates and collision-protects ${entrypoint}`, () => {
      const rootDir = fixtureRoot();
      const name = `${baseName}${
        generatorInterface.label === "interactive" ? "Interactive" : "Cli"
      }`;
      const invocation = generatorInterface.invocation(
        name,
        `Generated through the ${generatorInterface.label} interface.`,
        category,
        entrypoint
      );
      try {
        const first = runGeneratorScript(
          generatorInterface.script,
          invocation.args,
          { rootDir, input: invocation.input }
        );
        assert.equal(first.status, 0, first.stderr);
        assert.ok(
          fs.existsSync(
            path.join(rootDir, `packages/rooks/src/hooks/${name}.ts`)
          )
        );
        assert.match(
          fs.readFileSync(
            path.join(rootDir, "packages/rooks/src", barrel),
            "utf8"
          ),
          new RegExp(name)
        );

        const generated = snapshot(rootDir);
        const second = runGeneratorScript(
          generatorInterface.script,
          invocation.args,
          { rootDir, input: invocation.input }
        );
        assert.notEqual(second.status, 0);
        assert.match(second.stderr, /Refusing to overwrite/);
        assert.deepEqual(snapshot(rootDir), generated);
      } finally {
        fs.rmSync(rootDir, { recursive: true, force: true });
      }
    });
  }

  test(`${generatorInterface.label} interface rejects an invalid category`, () => {
    const rootDir = fixtureRoot();
    const invocation = generatorInterface.invocation(
      "useInvalidCategory",
      "Must not be generated.",
      "not-real",
      "rooks"
    );
    try {
      const run = runGeneratorScript(
        generatorInterface.script,
        invocation.args,
        { rootDir, input: invocation.input }
      );
      assert.notEqual(run.status, 0);
      assert.match(run.stderr, /--category must be one of/);
      assert.ok(
        !fs.existsSync(
          path.join(rootDir, "packages/rooks/src/hooks/useInvalidCategory.ts")
        )
      );
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });
}
