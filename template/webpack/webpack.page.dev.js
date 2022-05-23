const { merge } = require('webpack-merge');
const buildResources = require('./webpack.page.common');

module.exports.getConfig = (jsOnly) =>
  merge(buildResources.getCommonConfig(false, jsOnly), {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: buildResources.createEntries({}, jsOnly),
    plugins: [...buildResources.createHtmlWebpackPlugin(jsOnly)],
    module: buildResources.createSCSSModule('style-loader'),
  });
