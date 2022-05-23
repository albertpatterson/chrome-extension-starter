const { merge } = require('webpack-merge');
const buildResources = require('./webpack.script.common');

module.exports.getConfig = (jsOnly) =>
  merge(buildResources.getCommonConfig(true, jsOnly), {
    mode: 'production',
  });
