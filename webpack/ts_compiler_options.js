const PROD_TS_COMPILER_OPTIONS = require('../tsconfig.json').compilerOptions;

function getCompilerOptions(isProd) {
  if (isProd) {
    return PROD_TS_COMPILER_OPTIONS;
  }

  return { ...PROD_TS_COMPILER_OPTIONS, sourceMap: true };
}

module.exports.getTSRules = (isProd) => {
  const compilerOptions = getCompilerOptions(isProd);

  return [
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
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: { compilerOptions },
    },
  ];
};
