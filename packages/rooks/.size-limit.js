module.exports = [
  {
    name: 'ESM bundle size',
    path: ['dist/esm/index.js', 'dist/esm/hooks/**/*.js'],
    limit: '40KB',
  },
  {
    name: 'CJS bundle size',
    path: ['dist/cjs/index.js', 'dist/cjs/hooks/**/*.js'],
    limit: '45KB',
  },
  {
    name: 'UMD bundle size',
    path: ['dist/umd/rooks.umd.js'],
    limit: '10KB',
  },
];
