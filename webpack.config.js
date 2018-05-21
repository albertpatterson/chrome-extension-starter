
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'background/background': './background/background.js',
    'background/chromereload': './background/chromereload.js',
    'injected/injected': './injected/injected.js',
    'popup/js/popup': './popup/js/popup.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'popup/popup.html',
      filename: 'popup/popup.html',
      excludeAssets: [/(background)|(injected)/]
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'popup/css/popup.css'
    }),
    new WebpackShellPlugin({
      onBuildStart:['echo "Webpack Start"'], 
      onBuildEnd:["gulp post-bundle"]})
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test:/\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader', 'sass-loader'
        ],
      },
      {
        test: /\.(jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './popup/media/',
              publicPath: 'media'
            }
          }
        ]
      }
    ]
  }
};

module.exports = config;