import esbuild from "esbuild";
import fsNative from 'fs'
import { promises as fs } from "node:fs";
import * as terser from "terser";

const lib = new URL("./lib/", import.meta.url);


const build = async ({ outfile, format, minify = false, globalName, ...rest }) => {
    const { outputFiles } = await esbuild.build({
      bundle: true,
      minify,
      write: false,
      external: ['react','react-dom'],
      ...rest,
      format: format === "umd" ? "esm" : format,
      globalName: format === "umd" ? undefined : globalName,
    });
  
    let code = outputFiles[0].text;
  
    if (format === "umd") {
      // HACK: convert to UMD - only supports cjs and global var
      const varName = "__EXPORTS__";
      // Imports (not used atm)
      // code = code.replace(
      //   /import\s+(\w+)\s+from\s*"([^"]+)"/g,
      //   'var $1 = require("$2")'
      // );
      code = code.replace(/export\s*\{([^{}]+)\}/, (_, inner) => {
        const defaultExport = inner.match(/^(\w+) as default$/);
        return defaultExport != null
          ? `var ${varName}=${defaultExport[1]}`
          : `var ${varName}={${inner.replace(/(\w+) as (\w+)/g, "$2:$1")}}`;
      });
      code = `(()=>{${code};typeof module!=='undefined'?module.exports=${varName}:self.${globalName}=${varName}})()`;
    }
  
    // if (minify) {
    //   code = (await terser.minify(code)).code;
    // }
  
    await fs.writeFile(outfile, code);
  };

  if (!fsNative.existsSync(lib)){
    fsNative.mkdirSync(lib);
  }
  

  build({
    entryPoints: [new URL("src/index.ts", import.meta.url).pathname],
    outfile: new URL("rooks.esm.js", lib),
    format: "esm",
    //globalName: "Client",
    // plugins: [minifyDecimalJsPlugin, evalPlugin],
  });

  build({
    entryPoints: [new URL("src/index.ts", import.meta.url).pathname],
    outfile: new URL("rooks.umd.js", lib),
    format: "umd",
    globalName: "Rooks",    
  });

  build({
    entryPoints: [new URL("src/index.ts", import.meta.url).pathname],
    outfile: new URL("rooks.umd.min.js", lib),
    format: "umd",
    minify: true,
    globalName: "Rooks",    
  });

  build({
    entryPoints: [new URL("src/index.ts", import.meta.url).pathname],
    outfile: new URL("rooks.js", lib),
    format: "cjs",
    globalName: "Rooks",    
  });

  build({
    entryPoints: [new URL("src/index.ts", import.meta.url).pathname],
    outfile: new URL("rooks.min.js", lib),
    format: "cjs",
    minify: true,
    globalName: "Rooks",    
  });