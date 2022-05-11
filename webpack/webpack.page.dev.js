const { merge } = require('webpack-merge');
const buildResources = require('./webpack.page.common');

module.exports = merge(buildResources.getCommonConfig(false), {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: buildResources.createEntries(),
  plugins: [...buildResources.createHtmlWebpackPlugin()],
  module: buildResources.createSCSSModule('style-loader'),
});
