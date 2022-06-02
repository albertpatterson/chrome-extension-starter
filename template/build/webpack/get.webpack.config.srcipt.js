import path from 'path';
import webpack from 'webpack';
import { getTsCompilerOptions } from './utils.js';

function getPlugins(replacements) {
  const plugins = [];
  for (const replacement of replacements) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(replacement[0], replacement[1])
    );
  }

  return plugins;
}

export function getConfig(isProd, entry, output, replacements) {
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
