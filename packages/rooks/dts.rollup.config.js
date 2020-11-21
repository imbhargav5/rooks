import dts from "rollup-plugin-dts";

const globals = { react: "React", "react-dom": "ReactDOM" };

const dtsBundleConfig = {
  input: `./dist/types/rooks/src/index.d.ts`,
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
