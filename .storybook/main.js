const cracoConfig = require('./../craco.config');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
  ],
  // Add same configuration options to storybook, as we use for the app itself
  webpackFinal: async (config) => cracoConfig.webpack.configure(config)
}