import { writeFileSync, readFileSync } from "fs";
import pkgDir from "pkg-dir";
import { join } from "path";
import { readFileSync as _readFileSync } from "fs";

async function updateDocusaurusSidebars() {
  const PROJECT_ROOT: string | any = await pkgDir(__dirname);
  const hooksListJSONFilePath = join(PROJECT_ROOT, "./helpers/hooks-list.json");
  const { hooks: hooksList } = JSON.parse(
    _readFileSync(hooksListJSONFilePath, "utf-8")
  );
  const hookNames = hooksList.map(({ name }) => name);
  let CUSTOM_HOOKS_SIDEBAR_INDEX = 1;
  let currentSidebarJson;
  let fileContent;
  try {
    fileContent = readFileSync(join(PROJECT_ROOT, `./sidebars.json`), "utf8");
    currentSidebarJson = JSON.parse(fileContent);

    const customHooks = {
      ...currentSidebarJson.docs[CUSTOM_HOOKS_SIDEBAR_INDEX],
      items: Array.from(new Set([...hookNames])).sort(),
    };
    const newSidebarJson = {
      ...currentSidebarJson,
      docs: [
        ...currentSidebarJson.docs.slice(0, CUSTOM_HOOKS_SIDEBAR_INDEX),
        customHooks,
        ...currentSidebarJson.docs.slice(CUSTOM_HOOKS_SIDEBAR_INDEX + 1),
      ],
    };
    writeFileSync(
      join(PROJECT_ROOT, `./sidebars.json`),
      JSON.stringify(newSidebarJson, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.log("----");
    console.log(err);
    console.log("----");
  }
}

export default updateDocusaurusSidebars;

if (require.main === module) {
  updateDocusaurusSidebars();
}
