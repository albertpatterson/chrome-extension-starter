const { merge } = require('webpack-merge');
const buildResources = require('./webpack.script.common');

module.exports = merge(buildResources.getCommonConfig(true), {
  mode: 'production',
});
