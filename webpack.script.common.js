const path = require('path');

module.exports.commonConfig = {
  context: path.resolve(__dirname, 'src'),
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
