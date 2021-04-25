import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';

const globals = { react: 'React', 'react-dom': 'ReactDOM' };

const esm = {
  format: 'esm',
  sourcemap: true,
};

const getESM = (override) => ({ ...esm, ...override });

const configBase = {
  input: './src/index.ts',
  output: [
    getESM({ file: 'lib/rooks.esm.js', sourcemap: false }),
    {
      file: 'lib/rooks.js',
      format: 'umd',
      globals,
      name: 'rooks',
      sourcemap: true,
    },
  ],
  // \0 is rollup convention for generated in memory modules
  //    external: Object.keys(globals),

  // \0 is rollup convention for generated in memory modules
  external: (id) => {
    console.log(id);
    if (id.startsWith('@rooks') || id.startsWith('shared')) {
      return false;
    }
    return !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');
  },
};

export default {
  ...configBase,
  plugins: [
    esbuild({
      // All options are optional
      //   include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      //   exclude: /node_modules/, // default
      sourceMap: false, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es2017', // default, or 'es20XX', 'esnext'
      // Like @rollup/plugin-replace
      //   define: {
      //     __VERSION__: '"x.y.z"',
      //   },
      // tsconfig: 'tsconfig.json', // default
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json',
        // Enable JSX in .js files too
        '.js': 'jsx',
      },
    }),
  ],
};
