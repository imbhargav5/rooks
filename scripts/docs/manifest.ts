import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export const ENTRYPOINTS = [
  "rooks",
  "rooks/experimental",
  "rooks/temporal",
] as const;

export const HOOK_STATUSES = ["stable", "experimental", "deprecated"] as const;

export type Entrypoint = (typeof ENTRYPOINTS)[number];
export type HookStatus = (typeof HOOK_STATUSES)[number];
export type PublicExportKind = "value" | "type";

export interface HookPageMetadata {
  aliases: string[];
  category: string;
  description: string;
  entrypoint?: Entrypoint;
  filePath: string;
  related: string[];
  route: string;
  status?: HookStatus;
  title: string;
}

export interface PublicExport {
  canonicalName: string;
  entrypoint: Entrypoint;
  kind: PublicExportKind;
  name: string;
  sourceModule: string;
}

export interface PublicHook {
  aliases: string[];
  category: string;
  description: string;
  entrypoint: Entrypoint;
  name: string;
  pagePath?: string;
  related: string[];
  route: string;
  signature: string;
  sourceModule: string;
  status: HookStatus;
}

export interface HookReferenceCategory {
  category: string;
  label: string;
  hooks: Array<
    Pick<
      PublicHook,
      "aliases" | "description" | "entrypoint" | "name" | "route" | "status"
    >
  >;
}

export interface PublicTypeReferenceGroup {
  entrypoint: Entrypoint;
  types: Array<Pick<PublicExport, "name" | "sourceModule">>;
}

export interface DocumentationManifest {
  aliases: PublicExport[];
  byName: ReadonlyMap<string, PublicHook>;
  hookPages: HookPageMetadata[];
  publicExports: PublicExport[];
  publicHooks: PublicHook[];
  publicTypes: PublicExport[];
}

export interface ManifestOptions {
  rootDir?: string;
}

const ENTRYPOINT_EXPORT_KEYS: Record<Entrypoint, string> = {
  rooks: ".",
  "rooks/experimental": "./experimental",
  "rooks/temporal": "./temporal",
};

const CATEGORY_LABELS: Record<string, string> = {
  animation: "Animation & Timing",
  browser: "Browser APIs",
  dev: "Development & Debugging",
  events: "Event Handling",
  experimental: "Experimental Hooks",
  form: "Form & File Handling",
  keyboard: "Keyboard & Input",
  lifecycle: "Lifecycle & Effects",
  mouse: "Mouse & Touch",
  performance: "Performance & Optimization",
  state: "State Management",
  "state-history": "State History & Time Travel",
  temporal: "Temporal Hooks",
  ui: "UI & Layout",
  utilities: "Utilities & Refs",
  viewport: "Window & Viewport",
};

const manifestCache = new Map<string, DocumentationManifest>();

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

export function findRepositoryRoot(start = process.cwd()): string {
  let current = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(current, "pnpm-workspace.yaml")) &&
      fs.existsSync(path.join(current, "packages/rooks/package.json"))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(
        `Could not locate the Rooks repository root from ${start}`
      );
    }
    current = parent;
  }
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const body = trimmed.slice(1, -1).trim();
    if (!body) return [];
    return body
      .split(",")
      .map((item) => parseScalar(item))
      .map(String);
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontmatter(source: string): Record<string, unknown> {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return {};
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return {};
  const result: Record<string, unknown> = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    result[key] = parseScalar(line.slice(separator + 1));
  }
  return result;
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

function routeFromMdxPath(rootDir: string, filePath: string): string {
  const docsRoot = path.join(rootDir, "apps/website/content/docs");
  const relative = toPosix(path.relative(docsRoot, filePath)).replace(
    /\.mdx$/,
    ""
  );
  const parts = relative
    .split("/")
    .filter((part) => !(part.startsWith("(") && part.endsWith(")")))
    .filter(
      (part, index, all) => !(part === "index" && index === all.length - 1)
    );
  return `/docs${parts.length > 0 ? `/${parts.join("/")}` : ""}`;
}

export function loadHookPageMetadata(
  options: ManifestOptions = {}
): HookPageMetadata[] {
  const rootDir = findRepositoryRoot(options.rootDir);
  const hooksRoot = path.join(rootDir, "apps/website/content/docs/hooks");
  return collectFiles(hooksRoot, ".mdx")
    .filter((filePath) => {
      const relative = toPosix(path.relative(hooksRoot, filePath));
      return (
        relative.startsWith("(") && path.basename(filePath).startsWith("use")
      );
    })
    .map((filePath) => {
      const data = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
      const relative = toPosix(path.relative(hooksRoot, filePath));
      const category = relative.match(/^\(([^)]+)\)\//)?.[1] ?? "uncategorized";
      return {
        aliases: Array.isArray(data.aliases) ? data.aliases.map(String) : [],
        category,
        description:
          typeof data.description === "string" ? data.description : "",
        entrypoint: ENTRYPOINTS.includes(data.entrypoint as Entrypoint)
          ? (data.entrypoint as Entrypoint)
          : undefined,
        filePath: toPosix(path.relative(rootDir, filePath)),
        related: Array.isArray(data.related) ? data.related.map(String) : [],
        route: routeFromMdxPath(rootDir, filePath),
        status: HOOK_STATUSES.includes(data.status as HookStatus)
          ? (data.status as HookStatus)
          : undefined,
        title: typeof data.title === "string" ? data.title : "",
      };
    });
}

function exportSignature(
  checker: ts.TypeChecker,
  moduleExports: ReadonlyMap<string, ts.Symbol>,
  name: string
): string {
  const exported = moduleExports.get(name);
  if (!exported) return `${name}(...)`;
  let symbol = exported;
  if (symbol.flags & ts.SymbolFlags.Alias) {
    symbol = checker.getAliasedSymbol(symbol);
  }
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  if (!declaration) return `${name}(...)`;
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
  if (signatures.length === 0)
    return checker.typeToString(
      type,
      declaration,
      ts.TypeFormatFlags.NoTruncation
    );
  return signatures
    .map(
      (signature) =>
        `${name}${checker.signatureToString(
          signature,
          declaration,
          ts.TypeFormatFlags.NoTruncation |
            ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
          ts.SignatureKind.Call
        )}`
    )
    .join("\n");
}

function expectedStatus(entrypoint: Entrypoint): HookStatus {
  return entrypoint === "rooks/experimental" ? "experimental" : "stable";
}

interface PackageExportTarget {
  default?: string;
  import?: string;
  types?: string;
}

export function resolveEntrypointFiles(
  rootDir: string
): Record<Entrypoint, string> {
  const packagePath = path.join(rootDir, "packages/rooks/package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8")) as {
    exports?: Record<string, PackageExportTarget | string>;
  };
  const errors: string[] = [];
  const files = {} as Record<Entrypoint, string>;

  for (const entrypoint of ENTRYPOINTS) {
    const exportKey = ENTRYPOINT_EXPORT_KEYS[entrypoint];
    const target = packageJson.exports?.[exportKey];
    if (!target || typeof target === "string") {
      errors.push(
        `${packagePath}: export map entry ${exportKey} must define types, import, and default targets`
      );
      continue;
    }
    if (!target.import || !target.types || !target.default) {
      errors.push(
        `${packagePath}: export map entry ${exportKey} is missing types, import, or default`
      );
      continue;
    }
    if (target.default !== target.import) {
      errors.push(
        `${packagePath}: export map entry ${exportKey} default must match its ESM import target`
      );
    }
    const expectedTypes = target.import.replace(/\.js$/, ".d.ts");
    if (target.types !== expectedTypes) {
      errors.push(
        `${packagePath}: export map entry ${exportKey} types target must be ${expectedTypes}`
      );
    }
    const sourceName = path.basename(target.import).replace(/\.js$/, ".ts");
    const sourcePath = path.join(rootDir, "packages/rooks/src", sourceName);
    if (!fs.existsSync(sourcePath)) {
      errors.push(
        `${packagePath}: export map entry ${exportKey} resolves to missing source barrel ${sourcePath}`
      );
    }
    files[entrypoint] = toPosix(path.relative(rootDir, sourcePath));
  }

  if (errors.length > 0) {
    throw new Error(
      `Package export-map validation failed:\n${errors.join("\n")}`
    );
  }
  return files;
}

function explicitTypeOnlyExportNames(
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile
): Set<string> {
  const names = new Set<string>();
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement)) continue;
    if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const specifier of statement.exportClause.elements) {
        if (statement.isTypeOnly || specifier.isTypeOnly) {
          names.add(specifier.name.text);
        }
      }
      continue;
    }
    if (
      statement.isTypeOnly &&
      !statement.exportClause &&
      statement.moduleSpecifier
    ) {
      const moduleSymbol = checker.getSymbolAtLocation(
        statement.moduleSpecifier
      );
      if (moduleSymbol) {
        for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
          names.add(symbol.name);
        }
      }
    }
  }
  return names;
}

function resolveAliasedSymbol(
  checker: ts.TypeChecker,
  exported: ts.Symbol
): ts.Symbol {
  let symbol = exported;
  const visited = new Set<ts.Symbol>();
  while (symbol.flags & ts.SymbolFlags.Alias && !visited.has(symbol)) {
    visited.add(symbol);
    const target = checker.getAliasedSymbol(symbol);
    if (target === symbol) break;
    symbol = target;
  }
  return symbol;
}

function symbolSourceModule(rootDir: string, symbol: ts.Symbol): string {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  if (!declaration) return "<unknown>";
  const sourceFile = declaration.getSourceFile();
  return toPosix(path.relative(rootDir, sourceFile.fileName));
}

export function extractPublicApi(rootDir: string): {
  exports: PublicExport[];
  signatures: Map<string, string>;
} {
  const entrypointFiles = resolveEntrypointFiles(rootDir);
  const rootNames = ENTRYPOINTS.map((entrypoint) =>
    path.join(rootDir, entrypointFiles[entrypoint])
  );
  const program = ts.createProgram({
    rootNames,
    options: {
      allowJs: false,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const checker = program.getTypeChecker();
  const result: PublicExport[] = [];
  const signatures = new Map<string, string>();

  for (const entrypoint of ENTRYPOINTS) {
    const barrelPath = path.join(rootDir, entrypointFiles[entrypoint]);
    const sourceFile = program.getSourceFile(barrelPath);
    if (!sourceFile) throw new Error(`Manifest could not load ${barrelPath}`);
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) continue;
    const exportsByName = new Map(
      checker
        .getExportsOfModule(moduleSymbol)
        .filter((symbol) => symbol.name !== "default")
        .map((symbol) => [symbol.name, symbol])
    );
    const forcedTypes = explicitTypeOnlyExportNames(checker, sourceFile);

    for (const [name, exportedSymbol] of exportsByName) {
      const target = resolveAliasedSymbol(checker, exportedSymbol);
      const kind: PublicExportKind =
        forcedTypes.has(name) || !(target.flags & ts.SymbolFlags.Value)
          ? "type"
          : "value";
      result.push({
        canonicalName: target.getName(),
        entrypoint,
        kind,
        name,
        sourceModule: symbolSourceModule(rootDir, target),
      });
      if (kind === "value" && name.startsWith("use")) {
        signatures.set(
          `${entrypoint}:${name}`,
          exportSignature(checker, exportsByName, name)
        );
      }
    }
  }

  return { exports: result, signatures };
}

export function buildDocumentationManifest(
  options: ManifestOptions = {}
): DocumentationManifest {
  const rootDir = findRepositoryRoot(options.rootDir);
  const { exports: publicExports, signatures } = extractPublicApi(rootDir);
  const hookPages = loadHookPageMetadata({ rootDir });
  const pagesByTitle = new Map(hookPages.map((page) => [page.title, page]));
  const valueHooks = publicExports.filter(
    (item) => item.kind === "value" && item.name.startsWith("use")
  );
  const implementationGroups = new Map<string, PublicExport[]>();
  for (const item of valueHooks) {
    const key = `${item.entrypoint}:${item.sourceModule}:${item.canonicalName}`;
    implementationGroups.set(key, [
      ...(implementationGroups.get(key) ?? []),
      item,
    ]);
  }
  const canonical: PublicExport[] = [];
  const aliases: PublicExport[] = [];
  const aliasesByCanonical = new Map<string, string[]>();
  for (const group of implementationGroups.values()) {
    const ordered = [...group].sort((left, right) =>
      left.name.localeCompare(right.name)
    );
    const selected =
      ordered.find((item) => item.name === item.canonicalName) ?? ordered[0];
    if (!selected) continue;
    canonical.push({ ...selected, canonicalName: selected.name });
    const selectedAliases = ordered
      .filter((item) => item !== selected)
      .map((item) => ({ ...item, canonicalName: selected.name }));
    aliases.push(...selectedAliases);
    aliasesByCanonical.set(
      `${selected.entrypoint}:${selected.name}:${selected.sourceModule}`,
      selectedAliases.map((item) => item.name)
    );
  }
  const publicHooks = canonical
    .map((item): PublicHook => {
      const page = pagesByTitle.get(item.name);
      const aliasKey = `${item.entrypoint}:${item.canonicalName}:${item.sourceModule}`;
      return {
        aliases: (aliasesByCanonical.get(aliasKey) ?? []).sort(),
        category: page?.category ?? "uncategorized",
        description: page?.description ?? "",
        entrypoint: item.entrypoint,
        name: item.name,
        pagePath: page?.filePath,
        related: page?.related ?? [],
        route: page?.route ?? `/docs/hooks/${item.name}`,
        signature:
          signatures.get(`${item.entrypoint}:${item.name}`) ??
          `${item.name}(...)`,
        sourceModule: item.sourceModule,
        status: page?.status ?? expectedStatus(item.entrypoint),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
  const byName = new Map(publicHooks.map((hook) => [hook.name, hook]));
  for (const hook of publicHooks) {
    for (const alias of hook.aliases) byName.set(alias, hook);
  }

  return {
    aliases: aliases.sort((left, right) => left.name.localeCompare(right.name)),
    byName,
    hookPages,
    publicExports: publicExports.sort((left, right) =>
      `${left.entrypoint}:${left.name}`.localeCompare(
        `${right.entrypoint}:${right.name}`
      )
    ),
    publicHooks,
    publicTypes: publicExports.filter((item) => item.kind === "type"),
  };
}

export function getDocumentationManifest(
  options: ManifestOptions = {}
): DocumentationManifest {
  const rootDir = findRepositoryRoot(options.rootDir);
  const cached = manifestCache.get(rootDir);
  if (cached) return cached;
  const manifest = buildDocumentationManifest({ rootDir });
  manifestCache.set(rootDir, manifest);
  return manifest;
}

export function clearDocumentationManifestCache(): void {
  manifestCache.clear();
}

export function getHookManifest(
  name: string,
  options: ManifestOptions = {}
): PublicHook | undefined {
  return getDocumentationManifest(options).byName.get(name);
}

export function getHookReferenceIndex(
  options: ManifestOptions = {}
): HookReferenceCategory[] {
  const groups = new Map<string, PublicHook[]>();
  for (const hook of getDocumentationManifest(options).publicHooks) {
    groups.set(hook.category, [...(groups.get(hook.category) ?? []), hook]);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([category, hooks]) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      hooks: hooks.map(
        ({ aliases, description, entrypoint, name, route, status }) => ({
          aliases,
          description,
          entrypoint,
          name,
          route,
          status,
        })
      ),
    }));
}

export function getPublicTypeReference(
  options: ManifestOptions = {}
): PublicTypeReferenceGroup[] {
  const manifest = getDocumentationManifest(options);
  return ENTRYPOINTS.map((entrypoint) => ({
    entrypoint,
    types: manifest.publicTypes
      .filter((item) => item.entrypoint === entrypoint)
      .map(({ name, sourceModule }) => ({ name, sourceModule }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  })).filter((group) => group.types.length > 0);
}
