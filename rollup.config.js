import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import typescript2 from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

const commonPlugins = [
  nodeResolve(),
  typescript2(),
  sourceMaps(),
  json(),
  babel({
    exclude: ['node_modules/**'],
    plugins: ['@babel/plugin-external-helpers'],
  }),
  commonjs({
    ignoreGlobal: true,
  }),
  replace({
    __VERSION__: JSON.stringify(pkg.version),
  }),
];

const prodPlugins = [terser()];

const globals = { react: 'React', 'react-dom': 'ReactDOM' };

const config = {
  input: './src/index.ts',

  // \0 is rollup convention for generated in memory modules
  external: Object.keys(globals),
  plugins: commonPlugins,
  output: [
    {
      file: 'dist/umd/rooks.js',
      format: 'umd',
      globals,
      name: 'rooks',
      sourcemap: true,
    },
    {
      file: 'dist/umd/rooks.min.js',
      format: 'umd',
      globals,
      name: 'rooks',
      sourcemap: true,
      plugins: prodPlugins,
    },
  ],
};

export default config;
