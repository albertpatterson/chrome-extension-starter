const { merge } = require('webpack-merge');
const buildResources = require('./webpack.script.common');

module.exports = merge(buildResources.commonConfig, {
  mode: 'production',
  entry: buildResources.createEntries(),
});
