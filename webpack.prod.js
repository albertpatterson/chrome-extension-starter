const { merge } = require('webpack-merge');
const buildResources = require('./buildResources');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const manifestTransforms = {
  'Background Scripts': ['background/background.js'],
};

module.exports = merge(buildResources.commonConfig, {
  mode: 'production',
  entry: buildResources.createEntries(),
  plugins: [
    buildResources.createCopyManifestAndResourcesPlugin(manifestTransforms),
    new MiniCssExtractPlugin({
      filename: 'popup/css/popup_[fullhash].css',
    }),
    new CssMinimizerPlugin(),
    ...buildResources.createHtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
      },
    }),
  ],
  module: buildResources.createSCSSModule(MiniCssExtractPlugin.loader),
});
