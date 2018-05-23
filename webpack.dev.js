const path = require('path');
const merge = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: 'popup/popup.html',
      filename: 'popup/popup.html',
      excludeAssets: [/(background)|(injected)/]
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
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  }
});