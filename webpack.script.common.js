const path = require('path');

module.exports.commonConfig = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist', 'unpacked'),
    filename: '[name].js',
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
    ],
  },
};

module.exports.createEntries = function (extraEntries) {
  const entries = {
    'background/background': './background/background.ts',
    'injected/injected': './injected/injected.ts',
  };
  if (extraEntries) Object.assign(entries, extraEntries);
  return entries;
};
