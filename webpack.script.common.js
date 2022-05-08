const path = require('path');

module.exports.commonConfig = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist', 'unpacked'),
    filename: '[name].js',
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
    ],
  },
};

module.exports.createEntries = function (extraEntries) {
  const entries = {
    'background/background': './background/background.js',
    'injected/injected': './injected/injected.js',
  };
  if (extraEntries) Object.assign(entries, extraEntries);
  return entries;
};
