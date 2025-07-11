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

const emojiByCategory: Record<string, string> = {
  state: "❇️",
  effects: "🔥",
  navigator: "🚃",
  misc: "✨",
  form: "📝",
  events: "🚀",
  ui: "⚛️",
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

  private createHookEntry(hook: Hook): string {
    return `[${hook.name}](https://rooks.vercel.app/docs/${hook.name}) - ${hook.description}`;
  }

  private createHooksListMDAST(hooks: Hook[]): RootContent {
    return {
      children: hooks.map((hook) => ({
        children: [fromMarkdown(this.createHookEntry(hook))],
        spread: false,
        type: "listItem",
      })),
      ordered: false,
      spread: false,
      start: 1,
      type: "list",
    };
  }

  private createCategoryHeading(category: string): RootContent {
    const emoji = emojiByCategory[category] ?? "✅";
    const title = category === "ui" ? "UI" : lodash.startCase(category);
    
    return {
      type: "strong",
      children: [
        {
          type: "text",
          value: `<h3 align="center">${emoji} ${title}</h3>`,
        },
      ],
    };
  }

  private createHooksListByCategoryMDAST(hooksByCategory: HooksByCategory): Root {
    const hooksByCategoryKeys = Object.keys(hooksByCategory).sort();
    const hooksListByCategoryMDAST: Root = {
      type: "root",
      children: [],
    };

    for (const category of hooksByCategoryKeys) {
      const hooks = hooksByCategory[category];
      if (!hooks || hooks.length === 0) {
        console.warn(`No hooks found for category: ${category}`);
        continue;
      }

      const headingMDAST = this.createCategoryHeading(category);
      const hooksListMDAST = this.createHooksListMDAST(hooks);

      hooksListByCategoryMDAST.children.push(headingMDAST);
      hooksListByCategoryMDAST.children.push(hooksListMDAST);
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

  private updateMarkdownFile(filePath: string, hooksListMDAST: Root, hooksCountMDAST: RootContent): void {
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

      writeFileSync(fullPath, String(processedFile), "utf8");
      console.log(`✅ Updated ${filePath}`);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(`Markdown file not found: ${filePath}`);
      }
      throw new Error(`Failed to update ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async updatePackageListToMarkdown(): Promise<void> {
    try {
      console.log("🚀 Starting package list update...");
      
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
          this.updateMarkdownFile(filePath, hooksListByCategoryMDAST, hooksCountMDAST);
        } catch (error) {
          console.error(`⚠️  Failed to update ${filePath}:`, error instanceof Error ? error.message : String(error));
          // Continue with other files even if one fails
        }
      }

      console.log("✅ Package list update completed successfully!");
    } catch (error) {
      console.error("❌ Failed to update package list:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }
}

const updatePackageListToMarkdown = async (): Promise<void> => {
  const updater = new PackageListUpdater();
  await updater.updatePackageListToMarkdown();
};

export default updatePackageListToMarkdown;

// Execute the function directly since this is the main script
updatePackageListToMarkdown().catch((error) => {
  console.error("❌ Script failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});