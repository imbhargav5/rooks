import path from "path";
import dts from "rollup-plugin-dts";

function getFolderNameFromPkgName(pkgName){
    return pkgName.startsWith('@rooks/use-')? pkgName.split(`@rooks/use-`)[1]: pkgName;
}

const pkg = require(path.resolve("./package.json"));
const pkgFolderName = getFolderNameFromPkgName(pkg.name);

const globals = { react: "React", "react-dom": "ReactDOM" };

const dtsBundleConfig = {
  input: `./dist/types/${pkgFolderName}/src/index.d.ts`,
  output: [{ file: "lib/types/index.d.ts", format: "es" }],
  plugins: [dts({
      respectExternal: true
  })],
  external: Object.keys(globals)
};

const config = [
  dtsBundleConfig,
];

export default config;
