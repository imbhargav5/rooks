import { execFileSync } from "node:child_process";
import { generateDocumentation } from "./generate";
import { findRepositoryRoot } from "./manifest";
import { validateDocumentation } from "./validate";
import { validateGitHubConfiguration } from "./validate-github";

function formatIssue(
  issue: ReturnType<typeof validateDocumentation>[number]
): string {
  return `${issue.file}${issue.line ? `:${issue.line}` : ""} [${issue.code}] ${issue.message}`;
}

try {
  const rootDir = findRepositoryRoot();
  const allowed = new Set(["--no-snippets", "--no-format"]);
  const unexpected = process.argv
    .slice(2)
    .filter((argument) => !allowed.has(argument));
  if (unexpected.length > 0)
    throw new Error(`Unknown argument(s): ${unexpected.join(" ")}`);

  const issues = validateDocumentation({
    rootDir,
    typecheckSnippets: !process.argv.includes("--no-snippets"),
  });
  issues.push(...validateGitHubConfiguration(rootDir));
  if (issues.length > 0) {
    throw new Error(
      `Documentation validation found ${issues.length} issue(s):\n${issues
        .map(formatIssue)
        .join("\n")}`
    );
  }
  console.log(
    "Documentation schema, API parity, imports, snippets, sections, links, and GitHub YAML are valid."
  );

  generateDocumentation({ check: true, rootDir });

  if (!process.argv.includes("--no-format")) {
    execFileSync(
      "pnpm",
      [
        "exec",
        "prettier",
        "--check",
        "apps/website/content/docs/**/*.mdx",
        "packages/rooks/README.md",
        "CONTRIBUTING.md",
        "MAINTENANCE.md",
        "SECURITY.md",
        "SUPPORT.md",
        "code-style-guide.md",
        "docs/**/*.md",
      ],
      { cwd: rootDir, stdio: "inherit" }
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
