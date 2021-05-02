import dts from 'rollup-plugin-dts';

const globals = { react: 'React', 'react-dom': 'ReactDOM' };

const dtsBundleConfig = {
  input: `./dist/esm/index.d.ts`,
  output: [{ file: './dist/types/index.d.ts', format: 'es' }],
  plugins: [
    dts({
      respectExternal: true,
    }),
  ],
  external: Object.keys(globals),
};

const config = [dtsBundleConfig];

export default config;
