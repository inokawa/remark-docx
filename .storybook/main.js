module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.js$/,
      loader: "babel-loader",
      exclude: [/node_modules[\\/](?!(@unified-latex))/],
    });
    return config;
  },
};
