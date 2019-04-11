module.exports = function({ config }) {
  config.module.rules.push({
    test: /\.jsx?$/,
    loaders: [require.resolve("@storybook/addon-storysource/loader")],
    enforce: "pre"
  });

  return config;
};
