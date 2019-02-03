var path = require("path");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "lib"),
    library: "rooks",
    filename: "index.js",
    libraryTarget: "umd",
    auxiliaryComment: "Rooks"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  externals: {
    react: "react"
  }
};
