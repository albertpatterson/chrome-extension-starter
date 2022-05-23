const { merge } = require('webpack-merge');
const buildResources = require('./webpack.page.common');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports.getConfig = (jsOnly) =>
  merge(buildResources.getCommonConfig(true, jsOnly), {
    mode: 'production',
    entry: buildResources.createEntries(jsOnly),
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'popup/css/popup_[fullhash].css',
      }),
      new CssMinimizerPlugin(),
      ...buildResources.createHtmlWebpackPlugin(
        {
          minify: {
            collapseWhitespace: true,
            preserveLineBreaks: true,
            removeComments: true,
          },
        },
        jsOnly
      ),
    ],
    module: buildResources.createSCSSModule(MiniCssExtractPlugin.loader),
  });
