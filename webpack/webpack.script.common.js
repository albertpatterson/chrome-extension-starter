const path = require('path');
const { getTSRules } = require('./ts_compiler_options');

module.exports.getCommonConfig = (isProd) => ({
  context: path.resolve(__dirname, '../src'),
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [],
  module: {
    rules: [...getTSRules(isProd)],
  },
});
