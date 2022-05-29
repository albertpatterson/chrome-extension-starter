import path from 'path';
import webpack from 'webpack';

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

function getPlugins(replacements) {
  const plugins = [];
  for (const replacement of replacements) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(replacement[0], replacement[1])
    );
  }

  return plugins;
}

export function getConfig(useJs, isProd, entry, output, replacements) {
  const mode = isProd ? 'production' : 'development';
  const tsCompilerOptions = getTsCompilerOptions(isProd);
  const plugins = getPlugins(replacements);

  const prodConfig = {
    entry,
    output,
    mode,
    plugins,
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
