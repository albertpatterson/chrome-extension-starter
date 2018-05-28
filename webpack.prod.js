const merge = require("webpack-merge");
const buildResources = require("./buildResources");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const manifestTransforms = {
  "Background Scripts": ["background/background.js"]
};

module.exports = merge(buildResources.commonConfig, {
  mode: "production",
  entry: buildResources.createEntries(),
  plugins: [
    buildResources.createCopyManifestAndResourcesPlugin(manifestTransforms),
    new MinifyPlugin(),
    new MiniCssExtractPlugin({
      filename: 'popup/css/popup_[hash].css'
    }),
    new OptimizeCSSAssetsPlugin({}),
    ...buildResources.createHtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
      }
    }),
  ],
  module: buildResources.createSCSSModule(MiniCssExtractPlugin.loader)
});