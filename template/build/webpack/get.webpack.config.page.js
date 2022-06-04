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
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { __dirname } from './constants.js';
import { getTsCompilerOptions } from './utils.js';
import { getFileWithName } from 'simple_build_tools';

async function getEntry(inputFolderPath) {
  const scriptDir = path.resolve(inputFolderPath, 'js');

  const indexName = await getFileWithName(scriptDir, 'index', ['js', 'ts']);

  return {
    'js/index': path.resolve(inputFolderPath, 'js', indexName),
  };
}

const createHtmlWebpackPlugin = function (opts, inputFolderPath) {
  const config = {
    template: path.resolve(inputFolderPath, 'index.html'),
    filename: 'index.html',
  };
  if (opts) Object.assign(config, opts);
  return new HtmlWebpackPlugin(config);
};

const createSCSSModuleRule = function (cssLoader) {
  return {
    test: /\.scss$/,
    use: [cssLoader, 'css-loader', 'sass-loader'],
  };
};

function getPlugins(isProd, inputFolderPath) {
  const plugins = [];
  if (isProd) {
    plugins.push(
      ...[
        new MiniCssExtractPlugin({
          filename: 'css/styles_[fullhash].css',
        }),

        new CssMinimizerPlugin(),
      ]
    );
  }

  const htmlWebpackPluginOptions = isProd
    ? {
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: true,
          removeComments: true,
        },
      }
    : {};

  const htmlWebpackPlugin = createHtmlWebpackPlugin(
    htmlWebpackPluginOptions,
    inputFolderPath
  );
  plugins.push(htmlWebpackPlugin);

  return plugins;
}

export async function getConfig(isProd, inputFolderPath, outputFolderPath) {
  const entry = await getEntry(inputFolderPath);
  const mode = isProd ? 'production' : 'development';
  const tsCompilerOptions = getTsCompilerOptions(isProd);
  const plugins = getPlugins(isProd, inputFolderPath);

  const scssModuleRule = isProd
    ? createSCSSModuleRule(MiniCssExtractPlugin.loader)
    : createSCSSModuleRule('style-loader');

  const prodConfig = {
    entry,
    output: {
      filename: '[name].js',
      path: outputFolderPath,
      assetModuleFilename: 'images/[hash][ext][query]',
      clean: true,
    },
    plugins,
    mode,
    module: {
      rules: [
        scssModuleRule,
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
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
        {
          test: /\.html$/,
          use: ['html-loader'],
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
