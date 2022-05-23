const PROD_TS_COMPILER_OPTIONS = require('../tsconfig.json').compilerOptions;

function getTsCompilerOptions(isProd) {
  if (isProd) {
    return PROD_TS_COMPILER_OPTIONS;
  }

  return { ...PROD_TS_COMPILER_OPTIONS, sourceMap: true };
}

module.exports.getScriptRules = (isProd, jsOnly) => {
  const rules = [
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
  ];

  if (jsOnly) {
    return rules;
  }

  const compilerOptions = getTsCompilerOptions(isProd);

  return [
    ...rules,
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: { compilerOptions },
    },
  ];
};
