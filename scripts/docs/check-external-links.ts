import fs from "node:fs";
import path from "node:path";
import { findRepositoryRoot } from "./manifest";

interface Allowlist {
  ignore: string[];
}

function collectFiles(directory: string, extensions: Set<string>): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory()
      ? collectFiles(absolute, extensions)
      : extensions.has(path.extname(entry.name))
        ? [absolute]
        : [];
  });
}

function collectExternalLinks(rootDir: string): string[] {
  const files = [
    ...collectFiles(
      path.join(rootDir, "apps/website/content/docs"),
      new Set([".md", ".mdx"])
    ),
    ...collectFiles(path.join(rootDir, "docs"), new Set([".md", ".mdx"])),
    ...[
      "packages/rooks/README.md",
      "CONTRIBUTING.md",
      "MAINTENANCE.md",
      "SECURITY.md",
      "SUPPORT.md",
    ]
      .map((file) => path.join(rootDir, file))
      .filter((file) => fs.existsSync(file)),
  ];
  const links = new Set<string>();
  for (const file of files) {
    const source = fs
      .readFileSync(file, "utf8")
      .replace(
        /<!-- ALL-CONTRIBUTORS-LIST:START[\s\S]*?<!-- ALL-CONTRIBUTORS-LIST:END -->/g,
        ""
      )
      .replace(/```[\s\S]*?```/g, "")
      .replace(/~~~[\s\S]*?~~~/g, "")
      .replace(/`[^`\n]*`/g, "");
    for (const match of source.matchAll(/https?:\/\/[^\s<>"')\]]+/g)) {
      links.add(match[0].replace(/[.,;:]$/, ""));
    }
  }
  return [...links].sort();
}

function isCoveredByLocalValidation(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname === "rooks.vercel.app" &&
      parsed.pathname.startsWith("/docs")
    ) {
      return true;
    }
    return (
      parsed.hostname === "github.com" &&
      /^\/imbhargav5\/rooks\/(?:blob|tree)\/main\//.test(parsed.pathname)
    );
  } catch {
    return false;
  }
}

async function request(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "rooks-docs-link-checker" },
    });
    if (head.status !== 405 && head.status !== 501) return head;
    return fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "rooks-docs-link-checker" },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkWithRetries(url: string): Promise<string | undefined> {
  let last = "unknown error";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await request(url);
      if (response.ok || [401, 403, 429].includes(response.status))
        return undefined;
      last = `HTTP ${response.status}`;
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }
    if (attempt < 3)
      await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
  }
  return last;
}

async function main(): Promise<void> {
  const rootDir = findRepositoryRoot();
  const allowlistPath = path.join(
    rootDir,
    "scripts/docs/external-links-allowlist.json"
  );
  const allowlist = JSON.parse(
    fs.readFileSync(allowlistPath, "utf8")
  ) as Allowlist;
  const ignored = allowlist.ignore.map((pattern) => new RegExp(pattern));
  const links = collectExternalLinks(rootDir).filter((url) => {
    return (
      !isCoveredByLocalValidation(url) &&
      !ignored.some((pattern) => pattern.test(url))
    );
  });
  const failures: string[] = [];
  const queue = [...links];
  const workers = Array.from(
    { length: Math.min(8, queue.length) },
    async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (!url) return;
        const failure = await checkWithRetries(url);
        if (failure) failures.push(`${url} — ${failure}`);
      }
    }
  );
  await Promise.all(workers);
  console.log(`Checked ${links.length} external documentation links.`);
  if (failures.length > 0) {
    throw new Error(`External link failures:\n${failures.sort().join("\n")}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
