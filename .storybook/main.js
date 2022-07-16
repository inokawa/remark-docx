module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.js$/,
      loader: "babel-loader",
      exclude: [/node_modules[\\/](?!(@unified-latex))/],
    });
    return config;
  },
};
