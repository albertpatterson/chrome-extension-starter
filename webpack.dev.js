const path = require('path');
const merge = require("webpack-merge");
const buildResources = require("./buildResources");
const WebpackShellPlugin = require('webpack-shell-plugin');

const manifestTransforms = {
  "Background Scripts": ["background/background.js", "background/chromereload.js"]
};

module.exports = merge(buildResources.commonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  entry: buildResources.createEntries({'background/chromereload': './background/chromereload.js'}),
  plugins: [
    buildResources.createCopyManifestAndResourcesPlugin(manifestTransforms),
    ...buildResources.createHtmlWebpackPlugin(),
    new WebpackShellPlugin({
      onBuildEnd:["gulp reload"]
    })
  ],
  module: buildResources.createSCSSModule("style-loader")
});