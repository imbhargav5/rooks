import esbuild from "esbuild";
import fsNative from "fs";
import { promises as fs } from "node:fs";
import * as terser from "terser";

const lib = new URL("./lib/", import.meta.url);

const build = async ({ outfile, format, minify = false, ...rest }) => {
  const { outputFiles } = await esbuild.build({
    bundle: true,
    minify,
    write: false,
    external: ["react", "react-dom"],
    ...rest,
    format,
  });

  const code = outputFiles[0].text;
  await fs.writeFile(outfile, code);
};

if (!fsNative.existsSync(lib)) {
  fsNative.mkdirSync(lib);
}

build({
  entryPoints: [new URL("src/index.ts", import.meta.url).pathname],
  outfile: new URL("rooks.esm.js", lib),
  format: "esm",
});
