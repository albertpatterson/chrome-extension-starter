const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

module.exports.commonConfig = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist', 'unpacked'),
    filename: '[name].js',
    // assetModuleFilename: 'images/[hash][ext][query]',
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
      // {
      //   test: /\.html$/,
      //   use: ['html-loader'],
      // },
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: 'asset/resource',
      // },
    ],
  },
};

module.exports.createEntries = function (extraEntries) {
  const entries = {
    'background/background': './background/background.js',
    'injected/injected': './injected/injected.js',
    // 'popup/js/popup': './popup/js/popup.js',
  };
  if (extraEntries) Object.assign(entries, extraEntries);
  return entries;
};

// module.exports.createCopyManifestAndResourcesPlugin = function (map) {
//   return new CopyWebpackPlugin({
//     patterns: [
//       {
//         from: 'manifest.json',
//         transform: manifestTransformation(map),
//       },
//       {
//         from: 'icon.png',
//       },
//     ],
//   });
// };

// function manifestTransformation(map) {
//   // todo handle case where a match is split across buffers
//   return function (buffer) {
//     let text = buffer.toString();
//     Object.getOwnPropertyNames(map).forEach((key) => {
//       text = replaceWithJSON(text, key, map[key]);
//     });
//     return text;
//   };
// }

// function replaceWithJSON(text, search, replacement) {
//   const json = JSON.stringify(replacement);
//   return text.replace(
//     new RegExp(`[\"\']\\*\\*\\* ${search} \\*\\*\\*[\"\']`, 'g'),
//     json
//   );
// }

// module.exports.createHtmlWebpackPlugin = function (opts) {
//   const config = {
//     template: 'popup/popup.html',
//     filename: 'popup/popup.html',
//     excludeAssets: [/(background)|(injected)/],
//   };
//   if (opts) Object.assign(config, opts);
//   return [
//     new HtmlWebpackPlugin(config),
//     // new HtmlWebpackExcludeAssetsPlugin()
//   ];
// };

// module.exports.createSCSSModule = function (cssLoader) {
//   return {
//     rules: [
//       {
//         test: /\.scss$/,
//         use: [cssLoader, 'css-loader', 'sass-loader'],
//       },
//     ],
//   };
// };
