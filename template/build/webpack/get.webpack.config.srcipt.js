/**
 * @file
 * @author Albert Patterson <albert.patterson.code@gmail.com>
 * @see [Linkedin]{@link https://www.linkedin.com/in/apattersoncmu/}
 * @see [Github]{@link https://github.com/albertpatterson}
 * @see [npm]{@link https://www.npmjs.com/~apatterson189}
 * @see [Youtube]{@link https://www.youtube.com/channel/UCrECEffgWKBMCvn5tar9bYw}
 * @see [Medium]{@link https://medium.com/@albert.patterson.code}
 *
 * Free software under the GPLv3 licence. Permissions of this strong copyleft
 * license are conditioned on making available complete source code of
 * licensed works and modifications, which include larger works using a
 * licensed work, under the same license. Copyright and license notices must
 * be preserved. Contributors provide an express grant of patent rights.
 */

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
