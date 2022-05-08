const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports.commonConfig = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist', 'unpacked'),
    filename: '[name].js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};

module.exports.createEntries = function (extraEntries) {
  const entries = {
    'popup/js/popup': './popup/js/popup.ts',
  };
  if (extraEntries) Object.assign(entries, extraEntries);
  return entries;
};

module.exports.createHtmlWebpackPlugin = function (opts) {
  const config = {
    template: 'popup/popup.html',
    filename: 'popup/popup.html',
    excludeAssets: [/(background)|(injected)/],
  };
  if (opts) Object.assign(config, opts);
  return [new HtmlWebpackPlugin(config)];
};

module.exports.createSCSSModule = function (cssLoader) {
  return {
    rules: [
      {
        test: /\.scss$/,
        use: [cssLoader, 'css-loader', 'sass-loader'],
      },
    ],
  };
};
