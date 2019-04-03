const { BABEL_ENV, NODE_ENV } = process.env;
const modules = BABEL_ENV === "cjs" || NODE_ENV === "test" ? "commonjs" : false;

const loose = true;

module.exports = {
  presets: [
    ["@babel/preset-env", { modules, loose }],
    "@babel/preset-react",
    "babel-preset-minify"
  ]
};
