#!/usr/bin/env tsx

import { execSync } from "child_process";
import fs from "fs";

console.log("🔍 Sanity Check: TypeScript Definition Files");
console.log("=".repeat(50));

// Check if dist directory exists
if (!fs.existsSync("dist")) {
  console.error("❌ Error: dist directory not found. Run `pnpm build` first.");
  process.exit(1);
}

// Check if type definition files exist
const typeFiles = [
  "dist/esm/index.d.ts",
  "dist/esm/experimental.d.ts",
  "dist/esm/temporal.d.ts",
];

const missingFiles = typeFiles.filter((file) => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error("❌ Error: Missing type definition files:");
  missingFiles.forEach((file) => console.error(`   - ${file}`));
  process.exit(1);
}

console.log("✅ All expected .d.ts files exist");

// Create a temporary TypeScript file to test imports
const testFile = "temp-type-test.ts";
const testContent = `
// Test main exports
import { useCounter } from './dist/esm/index.js';

// Test experimental exports  
import {
  useSuspenseNavigatorUserAgentData,
  useBrowserCookieState,
  useEventListener,
  useRequest,
  useVirtualList,
  useWebSocket
} from './dist/esm/experimental.js';
import type {
  PermissionDescriptorLike,
  UseRequestOptions,
  UseWebSocketOptions,
  VirtualListItem
} from './dist/esm/experimental.js';

// Test Temporal exports and their public option types
import { useTemporalNow } from './dist/esm/temporal.js';
import type { TemporalNowOptions } from './dist/esm/temporal.js';

// Test that types are properly exported
const hook1: typeof useCounter = useCounter;
const hook2: typeof useSuspenseNavigatorUserAgentData = useSuspenseNavigatorUserAgentData;
const hook3: typeof useEventListener = useEventListener;
const hook4: typeof useRequest = useRequest;
const hook5: typeof useVirtualList = useVirtualList;
const hook6: typeof useWebSocket = useWebSocket;
const hook7: typeof useBrowserCookieState = useBrowserCookieState;
const hook8: typeof useTemporalNow = useTemporalNow;
const temporalOptions: TemporalNowOptions = { precision: "second" };
const permissionDescriptor: PermissionDescriptorLike = {
  name: "clipboard-read"
};
const requestOptions: UseRequestOptions<string, [string]> = {
  manual: true
};
const websocketOptions: UseWebSocketOptions<{ value: string }> = {
  parseMessage: (event) => ({ value: String(event.data) })
};
const virtualItem: VirtualListItem<string> = {
  item: "item",
  index: 0,
  key: "item",
  start: 0,
  size: 20,
  end: 20,
  style: { position: "absolute" }
};

useTemporalNow(temporalOptions);
void permissionDescriptor;
void requestOptions;
void websocketOptions;
void virtualItem;

declare const htmlDivRef: { current: HTMLDivElement | null };

useEventListener("click", (event) => {
  event.clientX;
}, { target: window });

useEventListener("visibilitychange", (event) => {
  event.type;
}, { target: document });

useEventListener("click", (event) => {
  event.clientY;
}, { target: htmlDivRef });

useEventListener("change", (event) => {
  event.matches;
}, { target: window.matchMedia("(max-width: 600px)") });

declare const customTarget: EventTarget;
useEventListener("rooks:custom", (event) => {
  event.type;
}, { target: customTarget });

// @ts-expect-error MediaQueryList only accepts MediaQueryListEventMap names.
useEventListener("click", () => {}, {
  target: window.matchMedia("(max-width: 600px)")
});

// @ts-expect-error Window targets reject unknown native event names.
useEventListener("rooks:custom", () => {}, { target: window });

useRequest(async (id: string) => id, { manual: true });
useRequest(async (id: string) => id, { defaultParams: ["initial"] });

// @ts-expect-error Required service parameters need manual mode or defaultParams.
useRequest(async (id: string) => id);

// @ts-expect-error Non-JSON values require an explicit cookie codec.
useBrowserCookieState("date", new Date());

console.log('Types resolved successfully');
`;

try {
  // Write test file
  fs.writeFileSync(testFile, testContent);

  // Run TypeScript compiler on test file
  console.log("🔍 Testing type resolution...");
  execSync(
    `npx tsc --noEmit --skipLibCheck --moduleResolution node --esModuleInterop ${testFile}`,
    {
      stdio: "pipe",
    }
  );

  console.log(
    "✅ TypeScript definitions are valid and imports resolve correctly"
  );
} catch (error) {
  console.error("❌ TypeScript validation failed:");
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
} finally {
  // Clean up test file
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
}

// Additional validation: Check for common issues in .d.ts files
console.log("🔍 Checking for common type definition issues...");

typeFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");

  // Check for missing exports
  if (!content.includes("export")) {
    console.error(`❌ Error: ${file} has no exports`);
    process.exit(1);
  }

  // Check for syntax errors (basic check)
  if (content.includes("export {") && !content.includes("} from")) {
    // This is a re-export, check it's properly formatted
    const reExportRegex = /export\s*{\s*[^}]+\s*}\s*from\s*["'][^"']+["']/;
    if (!reExportRegex.test(content)) {
      console.warn(`⚠️  Warning: ${file} may have malformed re-exports`);
    }
  }

  console.log(`✅ ${file} passed basic validation`);
});

console.log("🎉 All TypeScript definition files are valid!");
