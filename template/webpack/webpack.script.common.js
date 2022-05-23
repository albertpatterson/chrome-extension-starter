const path = require('path');
const { getScriptRules } = require('./get_script_rules');

module.exports.getCommonConfig = (isProd, jsOnly) => ({
  context: path.resolve(__dirname, '../src'),
  resolve: {
    extensions: jsOnly ? ['.js'] : ['.ts', '.js'],
  },
  plugins: [],
  module: {
    rules: [...getScriptRules(isProd, jsOnly)],
  },
});
