import path from 'path';

function getTsCompilerOptions(isProd) {
  const prodOptions = {
    outDir: './dist/unpacked',
    noImplicitAny: true,
    module: 'es6',
    target: 'es5',
    jsx: 'react',
    allowJs: true,
    moduleResolution: 'node',
  };

  if (isProd) {
    return prodOptions;
  }

  return { ...prodOptions, sourceMap: true };
}

export function getConfig(useJs, isProd, entry, output) {
  const mode = isProd ? 'production' : 'development';
  const tsCompilerOptions = getTsCompilerOptions(isProd);

  const prodConfig = {
    entry,
    output,
    mode,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            compilerOptions: tsCompilerOptions,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };

  if (isProd) {
    return prodConfig;
  }

  return { ...prodConfig, devtool: 'inline-source-map' };
}
