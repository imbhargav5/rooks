/* eslint-disable no-inner-declarations */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { packageDirectory } from "pkg-dir";
import { remark } from "remark";
import frontmatter from "remark-frontmatter";
import { zone } from "mdast-zone";
import { fromMarkdown } from "mdast-util-from-markdown";
import { dirname } from "path";
import { fileURLToPath } from "url";
import lodash from "lodash";
import type { Root, RootContent } from "mdast";

// Handle both ES modules and TypeScript compilation
const getModuleInfo = () => {
  try {
    if (import.meta.url) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      return { __filename, __dirname };
    }
  } catch (error) {
    // Fallback for tsx compilation - use process.cwd() as base
    return { __filename: "index.ts", __dirname: process.cwd() };
  }
  // Default fallback
  return { __filename: "index.ts", __dirname: process.cwd() };
};

const { __filename, __dirname } = getModuleInfo();

interface Hook {
  name: string;
  description: string;
  category: string;
}

interface HooksData {
  hooks: Hook[];
}

interface HooksByCategory {
  [category: string]: Hook[];
}

const CATEGORY_TITLES: Record<string, string> = {
  "ui": "UI",
  "state-history": "State History & Time Travel",
  "dev": "Development & Debugging",
  "browser": "Browser APIs",
  "performance": "Performance & Optimization",
  "utilities": "Utilities & Refs",
  "keyboard": "Keyboard & Input",
  "mouse": "Mouse & Touch",
  "form": "Form & File Handling",
  "animation": "Animation & Timing",
  "viewport": "Window & Viewport",
  "lifecycle": "Lifecycle & Effects",
  "experimental": "Experimental Hooks",
};

const emojiByCategory: Record<string, string> = {
  // Core State Management
  "state": "❇️",                    // State Management
  "state-history": "🔄",            // State History & Time Travel
  
  // Component Lifecycle
  "lifecycle": "🔥",                // Lifecycle & Effects
  
  // User Interactions
  "events": "🚀",                   // Event Handling
  "keyboard": "⌨️",                 // Keyboard & Input
  "mouse": "🖱️",                   // Mouse & Touch
  "form": "📝",                     // Form & File Handling
  
  // UI & Visual
  "ui": "⚛️",                      // UI & Layout
  "animation": "🎬",                // Animation & Timing
  "viewport": "📱",                 // Window & Viewport
  
  // Performance & Optimization
  "performance": "⚡",              // Performance & Optimization
  
  // Browser APIs
  "browser": "🌐",                 // Browser APIs
  
  // Development Tools
  "dev": "🛠️",                    // Development & Debugging
  
  // Utilities
  "utilities": "🔧",               // Utilities & Refs
  
  // Experimental
  "experimental": "🧪",            // Experimental Hooks
};

class PackageListUpdater {
  private projectRoot: string | null = null;

  constructor() {
    this.projectRoot = null;
  }

  async initialize(): Promise<void> {
    try {
      this.projectRoot = await packageDirectory({ cwd: __dirname });
      if (!this.projectRoot) {
        throw new Error("Could not find project root directory");
      }
    } catch (error) {
      throw new Error(`Failed to initialize: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private createZoneReplacePlugin(commentName: string, mdastToInject: RootContent) {
    const plugin = () => {
      function mutate(start: RootContent, _nodes: RootContent[], end: RootContent): RootContent[] {
        return [start, mdastToInject, end];
      }

      function transform(tree: Root): void {
        zone(tree, commentName, mutate);
      }

      return transform;
    };

    return plugin;
  }

  private loadHooksData(): HooksData {
    if (!this.projectRoot) {
      throw new Error("Project root not initialized");
    }

    try {
      const hooksListJSON = join(this.projectRoot, "./data/hooks-list.json");
      const hooksData = readFileSync(hooksListJSON, "utf8");
      return JSON.parse(hooksData) as HooksData;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(`Hooks list file not found at ./data/hooks-list.json. Please ensure the file exists.`);
      }
      throw new Error(`Failed to load hooks data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private groupHooksByCategory(hooks: Hook[]): HooksByCategory {
    return hooks.reduce((acc: HooksByCategory, hook: Hook) => {
      const { category } = hook;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(hook);
      return acc;
    }, {});
  }

  private createHooksTableMDAST(hooks: Hook[]): RootContent {
    const header = `| Hook | Description |\n|------|-------------|`;
    const rows = hooks
      .map(
        (hook) =>
          `| [**${hook.name}**](https://rooks.vercel.app/docs/hooks/${hook.name}) | ${hook.description} |`
      )
      .join("\n");

    return fromMarkdown(`${header}\n${rows}`) as unknown as RootContent;
  }

  private createCategoryHeading(category: string, hookCount: number): RootContent {
    const emoji = emojiByCategory[category] ?? "✅";
    const title = CATEGORY_TITLES[category] || lodash.startCase(category);
    // Determine which categories should be open by default
    const defaultOpenCategories = ['state', 'events', 'lifecycle', 'browser'];
    const isOpen = defaultOpenCategories.includes(category);

    return {
      type: "html",
      value: `<details${isOpen ? ' open' : ''}>
<summary><h3>${emoji} ${title} <sup>${hookCount}</sup></h3></summary>

`,
    };
  }

  private createCategoryClosing(): RootContent {
    return {
      type: "html",
      value: `
</details>

`,
    };
  }

  private createHooksListByCategoryMDAST(hooksByCategory: HooksByCategory): Root {
    const allCategories = Object.keys(hooksByCategory);

    // Separate experimental hooks from regular categories
    const experimentalCategories = allCategories.filter(category => category === "experimental");
    const regularCategories = allCategories.filter(category => category !== "experimental").sort();

    // Process regular categories first (alphabetically), then experimental categories at the end
    const orderedCategories = [...regularCategories, ...experimentalCategories];

    const hooksListByCategoryMDAST: Root = {
      type: "root",
      children: [],
    };

    for (const category of orderedCategories) {
      const hooks = hooksByCategory[category];
      if (!hooks || hooks.length === 0) {
        console.warn(`No hooks found for category: ${category}`);
        continue;
      }

      const headingMDAST = this.createCategoryHeading(category, hooks.length);
      const hooksTableMDAST = this.createHooksTableMDAST(hooks);

      hooksListByCategoryMDAST.children.push(headingMDAST);
      hooksListByCategoryMDAST.children.push(hooksTableMDAST);

      // Add experimental hooks disclaimer before closing
      if (category === "experimental") {
        const disclaimerMDAST: RootContent = {
          type: "html",
          value: `
<p align="center"><em>⚠️ Experimental hooks may be removed or significantly changed in any release without notice. Use with caution in production.</em></p>
`,
        };
        hooksListByCategoryMDAST.children.push(disclaimerMDAST);
      }

      // Close the details tag
      const closingMDAST = this.createCategoryClosing();
      hooksListByCategoryMDAST.children.push(closingMDAST);
    }

    return hooksListByCategoryMDAST;
  }

  private createHooksCountMDAST(totalHooks: number): RootContent {
    return {
      children: [
        {
          type: "text",
          value: `✅ Collection of ${totalHooks} hooks as standalone modules.`,
        },
      ],
      type: "paragraph",
    };
  }

  private updateMarkdownFile(filePath: string, hooksListMDAST: Root, hooksCountMDAST: RootContent, dryRun = false): void {
    if (!this.projectRoot) {
      throw new Error("Project root not initialized");
    }

    try {
      const fullPath = join(this.projectRoot, filePath);
      const fileContent = readFileSync(fullPath, "utf8");

      const processedFile = remark()
        .use(frontmatter)
        .use(this.createZoneReplacePlugin("hookslist", hooksListMDAST))
        .use(this.createZoneReplacePlugin("hookscount", hooksCountMDAST))
        .processSync(fileContent);

      if (dryRun) {
        console.log(`[DRY RUN] Would update ${filePath}`);
        return;
      }

      writeFileSync(fullPath, String(processedFile), "utf8");
      console.log(`✅ Updated ${filePath}`);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(`Markdown file not found: ${filePath}`);
      }
      throw new Error(`Failed to update ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async updatePackageListToMarkdown(options: { dryRun?: boolean } = {}): Promise<void> {
    const { dryRun = false } = options;

    try {
      console.log(`🚀 Starting package list update...${dryRun ? ' (DRY RUN)' : ''}`);

      await this.initialize();

      console.log("📖 Loading hooks data...");
      const { hooks: hooksList } = this.loadHooksData();

      if (!hooksList || hooksList.length === 0) {
        throw new Error("No hooks found in the hooks list");
      }

      console.log(`📦 Found ${hooksList.length} hooks`);

      const hooksByCategory = this.groupHooksByCategory(hooksList);
      const hooksListByCategoryMDAST = this.createHooksListByCategoryMDAST(hooksByCategory);
      const hooksCountMDAST = this.createHooksCountMDAST(hooksList.length);

      const filesToUpdate = [
        "./README.md",
        "./packages/rooks/README.md",
        "./apps/website/src/pages/list-of-hooks.md",
      ];

      console.log("📝 Updating markdown files...");

      for (const filePath of filesToUpdate) {
        try {
          this.updateMarkdownFile(filePath, hooksListByCategoryMDAST, hooksCountMDAST, dryRun);
        } catch (error) {
          console.error(`⚠️  Failed to update ${filePath}:`, error instanceof Error ? error.message : String(error));
          // Continue with other files even if one fails
        }
      }

      console.log(`✅ Package list update completed successfully!${dryRun ? ' (no files were modified)' : ''}`);
    } catch (error) {
      console.error("❌ Failed to update package list:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }
}

const updatePackageListToMarkdown = async (): Promise<void> => {
  const dryRun = process.argv.includes('--dry-run');
  const updater = new PackageListUpdater();
  await updater.updatePackageListToMarkdown({ dryRun });
};

export default updatePackageListToMarkdown;

// Execute the function directly since this is the main script
updatePackageListToMarkdown().catch((error) => {
  console.error("❌ Script failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});