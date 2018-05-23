const merge = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new MinifyPlugin(),
    new MiniCssExtractPlugin({
      filename: 'popup/css/popup.css'
    }),
    new OptimizeCSSAssetsPlugin({}),
    new HtmlWebpackPlugin({
      template: 'popup/popup.html',
      filename: 'popup/popup.html',
      excludeAssets: [/(background)|(injected)/],
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
      },
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    new WebpackShellPlugin({
      onBuildStart:['echo "Webpack Start"'],
      onBuildEnd:["gulp post-bundle"]
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  }
});