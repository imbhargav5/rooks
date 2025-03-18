import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { register } from "ts-node";

// Enable TypeScript
register({
  transpileOnly: true,
  compilerOptions: {
    module: "NodeNext",
    moduleResolution: "NodeNext",
  },
});

// Enable require for ESM
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the TypeScript config
export default require("./rollup.config.ts");
