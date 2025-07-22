import fs from "fs";
import path from "path";

/**
 * This function performs a global string replace
 * @param string String to perform the replacement on
 * @param needle Value to replace
 * @param replacement Replacement value
 * @returns The first argument with all occurrences of the needle changed to the replacement
 */
export const replaceString = (string, needle, replacement) =>
  string.split(needle).join(replacement);

/**
 * Truncate a string to a maximum length
 * @param {string} str - String to truncate
 * @param {object} options - Options object
 * @param {number} options.length - Maximum length
 * @returns {string} Truncated string
 */
function truncate(str, { length }) {
  if (str.length <= length) return str;
  return str.substring(0, length - 3) + "...";
}

/**
 * Ensure a file exists by creating its directory structure
 * @param {string} filePath - Path to the file
 */
function ensureFileSync(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Add hook to the hooks list and update the JSON file
 * @param {object} hookInfo - Hook information
 * @param {string} hookInfo.name - Hook name
 * @param {string} hookInfo.description - Hook description
 * @param {string} hookInfo.category - Hook category
 */
function addHookToListAndUpdate({ name, description, category }) {
  const PROJECT_ROOT = process.cwd();
  const listOfHooksJsonPath = path.join(PROJECT_ROOT, "./data/hooks-list.json");

  try {
    const listOfHooksJson = fs.readFileSync(listOfHooksJsonPath, "utf-8");
    const obj = JSON.parse(listOfHooksJson);
    obj.hooks.push({ name, description, category });
    // Sort hooks by name using native sort
    obj.hooks.sort((a, b) => a.name.localeCompare(b.name));
    fs.writeFileSync(
      listOfHooksJsonPath,
      JSON.stringify(obj, null, 2),
      "utf-8"
    );
    console.log(`✓ Updated hooks list: ${listOfHooksJsonPath}`);
  } catch (error) {
    console.warn(`Warning: Could not update hooks list: ${error.message}`);
  }
}

const PROJECT_ROOT = process.cwd();

const filesToRead = [
  "./template/index.spec.template",
  "./template/shared.template",
  "./template/README.md",
];
const filesToWrite = [
  ({ name }) => `./packages/rooks/src/__tests__/${name}.spec.ts`,
  ({ name }) => `./packages/rooks/src/hooks/${name}.ts`,
  ({ name }) => `./apps/website/content/docs/hooks/${name}.mdx`,
];

function readFileAsString(relativeFilePath) {
  return fs.readFileSync(path.join(PROJECT_ROOT, relativeFilePath), "utf-8");
}

function injectValuesIntoTemplate(
  src,
  { name, packageName, directoryName, description, category }
) {
  const trimmedDescription = truncate(description, {
    length: 130,
  });
  const descriptionWords = trimmedDescription.split(/\s+/);
  const descriptionSplitUp = descriptionWords.reduce(
    (acc, descriptionWord) => {
      let { currentAccIndex, values } = acc;
      const descriptionArray = [...values];
      let currentItem = descriptionArray[currentAccIndex] || "";
      if (currentItem.length + descriptionWord.length > 50) {
        currentAccIndex = currentAccIndex + 1;
        currentItem = "";
        descriptionArray[currentAccIndex] = currentItem;
      }
      currentItem = `${currentItem} ${descriptionWord}`;
      descriptionArray[currentAccIndex] = currentItem;
      return {
        currentAccIndex,
        values: [...descriptionArray],
      };
    },
    {
      values: ["", "", ""],
      currentAccIndex: 0,
    }
  );

  const { values: descriptionArray } = descriptionSplitUp;

  let result = src;
  result = replaceString(result, "%name%", name);
  result = replaceString(result, "%directoryName%", directoryName ?? "");
  result = replaceString(result, "%packageName%", packageName ?? "");
  result = replaceString(result, "%description%", description);
  result = replaceString(result, "%description0%", descriptionArray[0]);
  result = replaceString(result, "%description1%", descriptionArray[1]);
  result = replaceString(result, "%description2%", descriptionArray[2]);
  result = replaceString(result, "%category%", category);
  return result;
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  const parsedArgs = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, "");
    const value = args[i + 1];
    if (key && value) {
      parsedArgs[key] = value;
    }
  }

  return parsedArgs;
}

function validateArgs({ packageName, name, description, category }) {
  const errors = [];

  if (!packageName) {
    errors.push("--packageName is required");
  } else if (
    !(
      packageName.length > 4 &&
      packageName.startsWith("use-") &&
      packageName.toLowerCase() === packageName
    )
  ) {
    errors.push(
      "--packageName must be longer than 4 characters, start with 'use-', and be lowercase with hyphens"
    );
  }

  if (!name) {
    errors.push("--name is required");
  } else if (!(name.length > 3 && name.startsWith("use"))) {
    errors.push("--name must be longer than 3 characters and start with 'use'");
  }

  if (!description) {
    errors.push("--description is required");
  }

  const validCategories = [
    "ui",
    "misc",
    "state",
    "effects",
    "navigator",
    "form",
    "events",
    "experimental",
  ];
  if (!category) {
    errors.push("--category is required");
  } else if (!validCategories.includes(category)) {
    errors.push(`--category must be one of: ${validCategories.join(", ")}`);
  }

  return errors;
}

function showUsage() {
  console.log(`
Usage: node scripts/create/cli.mjs --packageName <package-name> --name <hook-name> --description <description> --category <category>

Arguments:
  --packageName   Name of the package in hyphen separated words starting with use (e.g., use-my-hook)
  --name          Name of the hook in camelCase starting with use (e.g., useMyHook)
  --description   Description of the hook
  --category      Category of the hook (ui, misc, state, effects, navigator, form, events, experimental)

Example:
  node scripts/create/cli.mjs --packageName use-idle --name useIdle --description "Hook to detect when user is idle" --category misc
`);
}

// Main execution
const args = parseCliArgs();

if (args.help || Object.keys(args).length === 0) {
  showUsage();
  process.exit(0);
}

const { packageName, name, description, category } = args;
const errors = validateArgs({ packageName, name, description, category });

if (errors.length > 0) {
  console.error("Validation errors:");
  errors.forEach((error) => console.error(`  - ${error}`));
  console.log();
  showUsage();
  process.exit(1);
}

// Generate the hook
const directoryName = packageName.substring(4);
const transformedSources = filesToRead.map((filePath) => {
  const src = readFileAsString(filePath);
  return injectValuesIntoTemplate(src, {
    name,
    packageName,
    directoryName,
    description,
    category,
  });
});

filesToWrite.map((relativeFilePathFromRootOfModule, index) => {
  const srcToWrite = transformedSources[index];
  if (typeof relativeFilePathFromRootOfModule === "function") {
    relativeFilePathFromRootOfModule = relativeFilePathFromRootOfModule({
      name,
    });
  }
  const pathToWriteTo = path.join(
    PROJECT_ROOT,
    relativeFilePathFromRootOfModule
  );
  ensureFileSync(pathToWriteTo);
  fs.writeFileSync(pathToWriteTo, srcToWrite);
  console.log(`✓ Created: ${relativeFilePathFromRootOfModule}`);
});

addHookToListAndUpdate({ name, description, category });
console.log(`✓ Hook ${name} created successfully!`);
