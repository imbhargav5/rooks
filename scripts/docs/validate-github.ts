import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";
import { findRepositoryRoot } from "./manifest";
import type { DocumentationIssue } from "./validate";

function collectYaml(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory()
      ? collectYaml(absolute)
      : /\.ya?ml$/.test(entry.name)
        ? [absolute]
        : [];
  });
}

export function validateGitHubConfiguration(
  rootDir = findRepositoryRoot()
): DocumentationIssue[] {
  const issues: DocumentationIssue[] = [];
  for (const filePath of collectYaml(path.join(rootDir, ".github"))) {
    const relative = path.relative(rootDir, filePath).split(path.sep).join("/");
    const document = parseDocument(fs.readFileSync(filePath, "utf8"), {
      prettyErrors: true,
      uniqueKeys: true,
    });
    for (const error of document.errors) {
      issues.push({
        code: "github/yaml",
        file: relative,
        message: error.message,
      });
    }
    if (document.errors.length > 0) continue;
    const data = document.toJS() as Record<string, unknown> | null;
    if (!data || typeof data !== "object") {
      issues.push({
        code: "github/yaml",
        file: relative,
        message: "file must contain a YAML object",
      });
      continue;
    }
    if (
      relative.startsWith(".github/ISSUE_TEMPLATE/") &&
      relative !== ".github/ISSUE_TEMPLATE/config.yml"
    ) {
      if (
        typeof data.name !== "string" ||
        typeof data.description !== "string"
      ) {
        issues.push({
          code: "github/issue-form",
          file: relative,
          message: "issue form requires string name and description fields",
        });
      }
      if (!Array.isArray(data.body) || data.body.length === 0) {
        issues.push({
          code: "github/issue-form",
          file: relative,
          message: "issue form requires a non-empty body array",
        });
      }
    }
    if (relative.startsWith(".github/workflows/")) {
      if (!("on" in data) || !data.jobs || typeof data.jobs !== "object") {
        issues.push({
          code: "github/workflow",
          file: relative,
          message: "workflow requires on and jobs mappings",
        });
      }
    }
  }
  return issues;
}
