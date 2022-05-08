const { merge } = require('webpack-merge');
const buildResources = require('./webpack.script.common');

module.exports = merge(buildResources.commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
});
