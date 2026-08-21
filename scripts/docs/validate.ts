import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ts from "typescript";
import {
  ENTRYPOINTS,
  buildDocumentationManifest,
  findRepositoryRoot,
  parseFrontmatter,
  type DocumentationManifest,
  type Entrypoint,
  type HookPageMetadata,
} from "./manifest";

export interface DocumentationIssue {
  code: string;
  file: string;
  line?: number;
  message: string;
}

export interface ValidateDocumentationOptions {
  rootDir?: string;
  typecheckSnippets?: boolean;
}

interface Fence {
  code: string;
  language: string;
  line: number;
  start: number;
}

interface MdxDocument {
  data: Record<string, unknown>;
  filePath: string;
  relativePath: string;
  route: string;
  source: string;
}

interface LinkDocument {
  context: "repository" | "route";
  relativePath: string;
  route?: string;
  source: string;
}

interface RedirectDefinition {
  destination: string;
  permanent: boolean;
  source: string;
}

const REQUIRED_SECTIONS = [
  "about",
  "parameters",
  "return value",
  "behavior and lifecycle",
  "compatibility and accessibility",
  "related",
];

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function collectFiles(directory: string, suffix: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolute = path.join(directory, entry.name);
      return entry.isDirectory()
        ? collectFiles(absolute, suffix)
        : entry.name.endsWith(suffix)
          ? [absolute]
          : [];
    })
    .sort();
}

function routeFor(relativePath: string): string {
  const withoutExtension = toPosix(relativePath).replace(/\.mdx$/, "");
  const parts = withoutExtension
    .split("/")
    .filter((part) => !(part.startsWith("(") && part.endsWith(")")))
    .filter(
      (part, index, all) => !(part === "index" && index === all.length - 1)
    );
  return `/docs${parts.length > 0 ? `/${parts.join("/")}` : ""}`;
}

function loadMdxDocuments(rootDir: string): MdxDocument[] {
  const docsRoot = path.join(rootDir, "apps/website/content/docs");
  return collectFiles(docsRoot, ".mdx").map((filePath) => {
    const relativePath = toPosix(path.relative(docsRoot, filePath));
    const source = fs.readFileSync(filePath, "utf8");
    return {
      data: parseFrontmatter(source),
      filePath,
      relativePath,
      route: routeFor(relativePath),
      source,
    };
  });
}

export function extractFences(source: string): Fence[] {
  const fences: Fence[] = [];
  const opening = /^```([^\s`]*)[^\n]*\n/gm;
  let match: RegExpExecArray | null;
  while ((match = opening.exec(source))) {
    const close = source.indexOf("\n```", opening.lastIndex);
    if (close === -1) break;
    fences.push({
      code: source.slice(opening.lastIndex, close),
      language: match[1].toLowerCase(),
      line: source.slice(0, opening.lastIndex).split("\n").length,
      start: match.index,
    });
    opening.lastIndex = close + 4;
  }
  return fences;
}

function lineAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function issue(
  document: Pick<MdxDocument, "relativePath">,
  code: string,
  message: string,
  line?: number
): DocumentationIssue {
  return { code, file: document.relativePath, line, message };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function equalStrings(left: string[], right: string[]): boolean {
  return [...left].sort().join("\0") === [...right].sort().join("\0");
}

export function validateHookPageContract(
  document: MdxDocument,
  page: HookPageMetadata,
  manifest: DocumentationManifest
): DocumentationIssue[] {
  const issues: DocumentationIssue[] = [];
  const hook = manifest.publicHooks.find((item) => item.name === page.title);
  const requiredFrontmatter = [
    "title",
    "description",
    "entrypoint",
    "status",
    "aliases",
    "related",
  ];
  for (const field of requiredFrontmatter) {
    if (!(field in document.data)) {
      issues.push(
        issue(
          document,
          "frontmatter/missing",
          `missing required frontmatter field: ${field}`,
          1
        )
      );
    }
  }
  for (const redundant of ["id", "sidebar_label"]) {
    if (redundant in document.data) {
      issues.push(
        issue(
          document,
          "frontmatter/redundant",
          `remove redundant frontmatter field: ${redundant}`,
          1
        )
      );
    }
  }
  const filename = path.basename(document.relativePath, ".mdx");
  if (filename !== page.title) {
    issues.push(
      issue(
        document,
        "frontmatter/title",
        `filename ${filename}.mdx must match title ${page.title}`,
        1
      )
    );
  }
  if (!hook) return issues;
  if (page.entrypoint !== hook.entrypoint) {
    issues.push(
      issue(
        document,
        "frontmatter/entrypoint",
        `entrypoint ${String(page.entrypoint)} does not match public export ${hook.entrypoint}`,
        1
      )
    );
  }
  const allowedStatus =
    hook.entrypoint === "rooks/experimental"
      ? page.status === "experimental"
      : page.status === "stable" || page.status === "deprecated";
  if (!allowedStatus) {
    issues.push(
      issue(
        document,
        "frontmatter/status",
        `${hook.entrypoint} page has invalid status ${String(page.status)}`,
        1
      )
    );
  }
  if (!equalStrings(stringArray(document.data.aliases), hook.aliases)) {
    issues.push(
      issue(
        document,
        "frontmatter/aliases",
        `aliases must exactly match barrel aliases: [${hook.aliases.join(", ")}]`,
        1
      )
    );
  }
  const canonicalNames = new Set(manifest.publicHooks.map((item) => item.name));
  for (const related of stringArray(document.data.related)) {
    if (!canonicalNames.has(related)) {
      issues.push(
        issue(
          document,
          "frontmatter/related",
          `related hook is not a canonical public hook: ${related}`,
          1
        )
      );
    }
  }

  const headings = [...document.source.matchAll(/^##\s+(.+?)\s*$/gm)].map(
    (match) => ({
      name: match[1].trim().toLowerCase(),
      start: match.index ?? 0,
    })
  );
  for (const match of document.source.matchAll(/^#\s+(.+?)\s*$/gm)) {
    const index = match.index ?? 0;
    const fenceMarkersBefore =
      document.source.slice(0, index).match(/^```/gm)?.length ?? 0;
    if (fenceMarkersBefore % 2 === 0) {
      issues.push(
        issue(
          document,
          "sections/duplicate-title",
          "remove the Markdown H1; the hook title is rendered centrally",
          lineAt(document.source, index)
        )
      );
    }
  }
  for (const section of REQUIRED_SECTIONS) {
    if (!headings.some((heading) => heading.name === section)) {
      issues.push(
        issue(
          document,
          "sections/missing",
          `missing required H2 section: ${section}`
        )
      );
    }
  }
  const exampleHeading = headings.find(
    (heading) => heading.name === "example" || heading.name === "examples"
  );
  let primary: Fence | undefined;
  if (!exampleHeading) {
    issues.push(
      issue(
        document,
        "sections/missing",
        "missing required H2 section: Example or Examples"
      )
    );
  } else {
    const nextHeading = headings.find(
      (heading) => heading.start > exampleHeading.start
    );
    primary = extractFences(document.source).find(
      (fence) =>
        fence.start > exampleHeading.start &&
        (!nextHeading || fence.start < nextHeading.start)
    );
    if (!primary) {
      issues.push(
        issue(
          document,
          "examples/missing",
          "Example section must contain a fenced example"
        )
      );
    } else if (primary.language !== "tsx") {
      issues.push(
        issue(
          document,
          "examples/language",
          `primary example must use a tsx fence, found ${primary.language || "unlabeled"}`,
          primary.line
        )
      );
    }
  }
  const placeholderPatterns: Array<{
    code: string;
    message: string;
    pattern: RegExp;
  }> = [
    {
      code: "content/placeholder-signature",
      message:
        "document concrete parameters, defaults, constraints, or return values instead of deferring to the generated signature",
      pattern: /The generated TypeScript signature above/i,
    },
    {
      code: "content/placeholder-lifecycle",
      message:
        "replace the generic lifecycle placeholder with behavior derived from the hook source and tests",
      pattern:
        /(?:Document execution timing, cleanup, concurrency, and error behavior while implementing the hook\.|The hook follows React['’]s render and effect lifecycle)/i,
    },
    {
      code: "content/placeholder-compatibility",
      message:
        "replace the generic compatibility placeholder with hook-specific SSR, browser, permission, or accessibility facts",
      pattern:
        /(?:This hook can depend on DOM or browser APIs\. Keep server output deterministic|No additional permission requirement is implied beyond the platform APIs shown in the examples|Verify SSR, browser support, permissions, cleanup, errors, and accessibility for the environments your product supports)/i,
    },
  ];
  for (const placeholder of placeholderPatterns) {
    const match = placeholder.pattern.exec(document.source);
    if (match) {
      issues.push(
        issue(
          document,
          placeholder.code,
          placeholder.message,
          lineAt(document.source, match.index)
        )
      );
    }
  }
  return issues;
}

function validateParity(
  documents: MdxDocument[],
  manifest: DocumentationManifest
): DocumentationIssue[] {
  const issues: DocumentationIssue[] = [];
  const hookDocuments = documents.filter((document) =>
    document.relativePath.startsWith("hooks/(")
  );
  const documentsByTitle = new Map<string, MdxDocument[]>();
  for (const document of hookDocuments) {
    const title =
      typeof document.data.title === "string" ? document.data.title : "";
    documentsByTitle.set(title, [
      ...(documentsByTitle.get(title) ?? []),
      document,
    ]);
  }
  for (const hook of manifest.publicHooks) {
    const pages = documentsByTitle.get(hook.name) ?? [];
    if (pages.length === 0) {
      issues.push({
        code: "api/missing-page",
        file: hook.sourceModule,
        message: `public hook ${hook.name} from ${hook.entrypoint} has no canonical MDX page`,
      });
    } else if (pages.length > 1) {
      issues.push({
        code: "api/duplicate-page",
        file: pages.map((page) => page.relativePath).join(", "),
        message: `public hook ${hook.name} has ${pages.length} pages`,
      });
    }
  }
  const canonical = new Set(manifest.publicHooks.map((hook) => hook.name));
  for (const [title, pages] of documentsByTitle) {
    if (!canonical.has(title)) {
      for (const page of pages) {
        issues.push(
          issue(
            page,
            "api/orphan-page",
            `hook page title is not a canonical public hook: ${title || "<missing>"}`,
            1
          )
        );
      }
    }
  }
  return issues;
}

function validateImports(
  documents: MdxDocument[],
  manifest: DocumentationManifest
): DocumentationIssue[] {
  const issues: DocumentationIssue[] = [];
  const exportsByEntrypoint = new Map(
    ENTRYPOINTS.map((entrypoint) => [
      entrypoint,
      new Set(
        manifest.publicExports
          .filter((item) => item.entrypoint === entrypoint)
          .map((item) => item.name)
      ),
    ])
  );
  const importPattern =
    /import\s+(type\s+)?\{([^}]*)\}\s+from\s+["'](rooks(?:\/[^"']+)*)["']/g;
  const defaultPattern =
    /import\s+(?!type\s+\{)([A-Za-z_$][\w$]*)\s+from\s+["'](rooks(?:\/[^"']+)*)["']/g;

  for (const document of documents) {
    for (const match of document.source.matchAll(importPattern)) {
      const entrypoint = match[3] as Entrypoint;
      if (!ENTRYPOINTS.includes(entrypoint)) {
        issues.push(
          issue(
            document,
            "imports/entrypoint",
            `unknown Rooks entrypoint: ${entrypoint}`,
            lineAt(document.source, match.index ?? 0)
          )
        );
        continue;
      }
      const names = match[2]
        .split(",")
        .map(
          (part) =>
            part
              .trim()
              .replace(/^type\s+/, "")
              .split(/\s+as\s+/)[0]
        )
        .filter(Boolean);
      for (const name of names) {
        if (!exportsByEntrypoint.get(entrypoint)?.has(name)) {
          issues.push(
            issue(
              document,
              "imports/symbol",
              `${name} is not exported by ${entrypoint}`,
              lineAt(document.source, match.index ?? 0)
            )
          );
        }
      }
    }
    for (const match of document.source.matchAll(defaultPattern)) {
      issues.push(
        issue(
          document,
          "imports/default",
          `${match[2]} has no default export (${match[1]})`,
          lineAt(document.source, match.index ?? 0)
        )
      );
    }
  }
  return issues;
}

function validateExecutableFenceImports(
  documents: MdxDocument[]
): DocumentationIssue[] {
  const issues: DocumentationIssue[] = [];
  for (const document of documents) {
    for (const fence of extractFences(document.source)) {
      if (
        (fence.language === "ts" || fence.language === "tsx") &&
        /(?:\bfrom\s*|\bimport\s*)["']\.\.?\//.test(fence.code)
      ) {
        issues.push(
          issue(
            document,
            "examples/local-import",
            "executable examples must be self-contained and cannot import relative local files",
            fence.line
          )
        );
      }
    }
  }
  return issues;
}

function normalizeRoute(route: string): string {
  const withoutQuery = route.split(/[?#]/)[0];
  return withoutQuery.length > 1
    ? withoutQuery.replace(/\/$/, "")
    : withoutQuery;
}

function loadRedirects(rootDir: string): {
  redirects: RedirectDefinition[];
  issues: DocumentationIssue[];
} {
  const relativePath = "apps/website/redirects.json";
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) {
    return {
      redirects: [],
      issues: [
        {
          code: "redirects/missing-config",
          file: relativePath,
          message:
            "shared redirect registry is missing; Next.js and docs validation must use the same registry",
        },
      ],
    };
  }
  try {
    const value = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    if (!Array.isArray(value)) throw new Error("expected a JSON array");
    const redirects: RedirectDefinition[] = [];
    for (const [index, item] of value.entries()) {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof (item as RedirectDefinition).source !== "string" ||
        typeof (item as RedirectDefinition).destination !== "string" ||
        typeof (item as RedirectDefinition).permanent !== "boolean"
      ) {
        throw new Error(
          `entry ${index + 1} must define string source/destination and boolean permanent`
        );
      }
      redirects.push(item as RedirectDefinition);
    }
    return { redirects, issues: [] };
  } catch (error) {
    return {
      redirects: [],
      issues: [
        {
          code: "redirects/invalid-config",
          file: relativePath,
          message: `invalid shared redirect registry: ${(error as Error).message}`,
        },
      ],
    };
  }
}

function loadRepositoryLinkDocuments(rootDir: string): LinkDocument[] {
  const rootFiles = [
    "README.md",
    "packages/rooks/README.md",
    "CONTRIBUTING.md",
    "MAINTENANCE.md",
    "SECURITY.md",
    "SUPPORT.md",
    "code-style-guide.md",
  ];
  const docsFiles = collectFiles(path.join(rootDir, "docs"), ".md").map(
    (filePath) => toPosix(path.relative(rootDir, filePath))
  );
  const navigationFiles = ["apps/website/src/app/layout.config.tsx"];
  return [...new Set([...rootFiles, ...docsFiles, ...navigationFiles])]
    .filter((relativePath) => fs.existsSync(path.join(rootDir, relativePath)))
    .map((relativePath) => ({
      context: "repository" as const,
      relativePath,
      source: fs.readFileSync(path.join(rootDir, relativePath), "utf8"),
    }));
}

function extractLinkTargets(
  document: LinkDocument
): Array<{ index: number; target: string }> {
  const markdownLink =
    /(?<!!)\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  const propertyLink = /\b(?:href|url)\s*(?:=|:)\s*["']([^"']+)["']/g;
  const targets = [
    ...[...document.source.matchAll(markdownLink)].map((match) => ({
      index: match.index ?? 0,
      target: match[1],
    })),
    ...[...document.source.matchAll(propertyLink)].map((match) => ({
      index: match.index ?? 0,
      target: match[1],
    })),
  ];
  const seen = new Set<string>();
  return targets.filter(({ index, target }) => {
    const key = `${index}:${target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function localSiteRoute(target: string): string | undefined {
  try {
    const url = new URL(target);
    if (url.hostname === "rooks.vercel.app")
      return normalizeRoute(url.pathname);
  } catch {
    // Relative targets are handled by their document context.
  }
  return undefined;
}

function githubRepositoryPath(target: string): string | undefined {
  try {
    const url = new URL(target);
    const match = url.pathname.match(
      /^\/imbhargav5\/rooks\/(?:blob|tree)\/main\/(.+)$/
    );
    return match ? decodeURIComponent(match[1]) : undefined;
  } catch {
    return undefined;
  }
}

function validateLinks(
  rootDir: string,
  documents: MdxDocument[],
  manifest: DocumentationManifest
): DocumentationIssue[] {
  const redirectData = loadRedirects(rootDir);
  const issues: DocumentationIssue[] = [...redirectData.issues];
  const routes = new Set(
    documents.map((document) => normalizeRoute(document.route))
  );
  const redirectsBySource = new Map<string, RedirectDefinition>();
  for (const redirect of redirectData.redirects) {
    const source = normalizeRoute(redirect.source);
    if (redirectsBySource.has(source)) {
      issues.push({
        code: "redirects/duplicate",
        file: "apps/website/redirects.json",
        message: `duplicate redirect source: ${redirect.source}`,
      });
    }
    redirectsBySource.set(source, redirect);
    routes.add(source);
  }
  for (const redirect of redirectData.redirects) {
    if (
      redirect.destination.startsWith("/") &&
      !routes.has(normalizeRoute(redirect.destination))
    ) {
      issues.push({
        code: "redirects/destination",
        file: "apps/website/redirects.json",
        message: `redirect destination does not resolve to a documentation route: ${redirect.destination}`,
      });
    }
  }
  for (const alias of manifest.aliases) {
    const source = `/docs/hooks/${alias.name}`;
    const expected = manifest.byName.get(alias.name)?.route;
    const redirect = redirectsBySource.get(source);
    if (!redirect) {
      issues.push({
        code: "redirects/alias",
        file: "apps/website/redirects.json",
        message: `public alias ${alias.name} requires a redirect from ${source}`,
      });
    } else if (
      expected &&
      normalizeRoute(redirect.destination) !== normalizeRoute(expected)
    ) {
      issues.push({
        code: "redirects/alias",
        file: "apps/website/redirects.json",
        message: `public alias ${alias.name} must redirect to ${expected}`,
      });
    } else if (!redirect.permanent) {
      issues.push({
        code: "redirects/alias",
        file: "apps/website/redirects.json",
        message: `public alias ${alias.name} must use a permanent redirect`,
      });
    }
  }

  const linkDocuments: LinkDocument[] = [
    ...documents.map((document) => ({
      context: "route" as const,
      relativePath: document.relativePath,
      route: document.route,
      source: document.source,
    })),
    ...loadRepositoryLinkDocuments(rootDir),
  ];
  for (const document of linkDocuments) {
    for (const { index, target } of extractLinkTargets(document)) {
      if (
        !target ||
        target.startsWith("#") ||
        target.startsWith("mailto:") ||
        target.startsWith("tel:")
      ) {
        continue;
      }
      const repositoryPath = githubRepositoryPath(target);
      if (repositoryPath) {
        if (!fs.existsSync(path.join(rootDir, repositoryPath))) {
          issues.push(
            issue(
              document,
              "links/repository",
              `GitHub repository target does not exist: ${repositoryPath}`,
              lineAt(document.source, index)
            )
          );
        }
        continue;
      }
      const absoluteSiteRoute = localSiteRoute(target);
      if (target.startsWith("http://") || target.startsWith("https://")) {
        if (!absoluteSiteRoute) continue;
      }
      if (document.context === "repository" && !target.startsWith("/")) {
        if (absoluteSiteRoute) {
          if (!routes.has(absoluteSiteRoute)) {
            issues.push(
              issue(
                document,
                "links/local",
                `documentation route does not exist: ${target} (resolved to ${absoluteSiteRoute})`,
                lineAt(document.source, index)
              )
            );
          }
          continue;
        }
        const fileTarget = decodeURIComponent(target.split(/[?#]/)[0]);
        const resolvedFile = path.resolve(
          rootDir,
          path.dirname(document.relativePath),
          fileTarget
        );
        if (!fs.existsSync(resolvedFile)) {
          issues.push(
            issue(
              document,
              "links/repository",
              `repository link target does not exist: ${target}`,
              lineAt(document.source, index)
            )
          );
        }
        continue;
      }
      const resolved =
        absoluteSiteRoute ??
        (target.startsWith("/")
          ? normalizeRoute(target)
          : normalizeRoute(
              path.posix.resolve(
                path.posix.dirname(document.route ?? "/"),
                target
              )
            ));
      if (!routes.has(resolved)) {
        issues.push(
          issue(
            document,
            "links/local",
            `local route does not exist: ${target} (resolved to ${resolved})`,
            lineAt(document.source, index)
          )
        );
      }
    }
  }
  return issues;
}

interface SnippetSource {
  code: string;
  file: string;
  language: "ts" | "tsx";
  line: number;
}

export function typecheckSnippetSources(
  snippets: SnippetSource[],
  rootDir = findRepositoryRoot()
): DocumentationIssue[] {
  if (snippets.length === 0) return [];
  const temporary = fs.mkdtempSync(
    path.join(rootDir, "packages/rooks/.docs-check-")
  );
  const metadata = new Map<string, SnippetSource>();
  try {
    const rootNames = snippets.map((snippet, index) => {
      const filePath = path.join(
        temporary,
        `snippet-${index}.${snippet.language}`
      );
      fs.writeFileSync(filePath, snippet.code);
      metadata.set(path.resolve(filePath), snippet);
      return filePath;
    });
    const program = ts.createProgram({
      rootNames,
      options: {
        allowSyntheticDefaultImports: true,
        baseUrl: rootDir,
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        lib: [
          "lib.es2022.d.ts",
          "lib.dom.d.ts",
          "lib.dom.iterable.d.ts",
          "lib.esnext.disposable.d.ts",
        ],
        module: ts.ModuleKind.ESNext,
        moduleDetection: ts.ModuleDetectionKind.Force,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        noEmit: true,
        paths: {
          rooks: ["packages/rooks/src/index.ts"],
          "rooks/experimental": ["packages/rooks/src/experimental.ts"],
          "rooks/temporal": ["packages/rooks/src/temporal.ts"],
        },
        skipLibCheck: true,
        strict: true,
        target: ts.ScriptTarget.ES2022,
        typeRoots: [
          path.join(rootDir, "packages/rooks/node_modules/@types"),
          path.join(rootDir, "node_modules/@types"),
        ],
        types: ["node", "react", "react-dom"],
      },
    });
    return ts
      .getPreEmitDiagnostics(program)
      .filter(
        (diagnostic) =>
          diagnostic.file &&
          metadata.has(path.resolve(diagnostic.file.fileName))
      )
      .map((diagnostic) => {
        const source = metadata.get(path.resolve(diagnostic.file!.fileName))!;
        const location = diagnostic.file!.getLineAndCharacterOfPosition(
          diagnostic.start ?? 0
        );
        return {
          code: "snippets/typescript",
          file: source.file,
          line: source.line + location.line,
          message: ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            "\n"
          ),
        };
      });
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

export function validateDocumentation(
  options: ValidateDocumentationOptions = {}
): DocumentationIssue[] {
  const rootDir = findRepositoryRoot(options.rootDir);
  const manifest = buildDocumentationManifest({ rootDir });
  const documents = loadMdxDocuments(rootDir);
  const hookDocumentsByPath = new Map(
    documents
      .filter((document) => document.relativePath.startsWith("hooks/("))
      .map((document) => [document.relativePath, document])
  );
  const issues = [
    ...validateParity(documents, manifest),
    ...validateImports(documents, manifest),
    ...validateExecutableFenceImports(documents),
    ...validateLinks(rootDir, documents, manifest),
  ];
  for (const page of manifest.hookPages) {
    const relative = toPosix(
      path.relative("apps/website/content/docs", page.filePath)
    );
    const document = hookDocumentsByPath.get(relative);
    if (document)
      issues.push(...validateHookPageContract(document, page, manifest));
  }
  if (options.typecheckSnippets !== false) {
    const snippets: SnippetSource[] = documents.flatMap((document) =>
      extractFences(document.source)
        .filter(
          (fence): fence is Fence & { language: "ts" | "tsx" } =>
            fence.language === "ts" || fence.language === "tsx"
        )
        .map((fence) => ({
          code: fence.code,
          file: document.relativePath,
          language: fence.language,
          line: fence.line,
        }))
    );
    issues.push(...typecheckSnippetSources(snippets, rootDir));
  }
  return issues.sort((left, right) =>
    `${left.file}:${left.line ?? 0}:${left.code}`.localeCompare(
      `${right.file}:${right.line ?? 0}:${right.code}`
    )
  );
}
