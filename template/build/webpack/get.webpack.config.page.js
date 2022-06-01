import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { __dirname } from './constants.js';
import { getTsCompilerOptions } from './utils.js';

function getEntry(useJs, isProd, inputFolderPath) {
  const suffix = useJs ? 'js' : 'ts';

  return {
    'js/index': path.resolve(inputFolderPath, 'js', `index.${suffix}`),
  };
}

const createHtmlWebpackPlugin = function (useJs, opts, inputFolderPath) {
  const config = {
    template: path.resolve(inputFolderPath, 'index.html'),
    filename: 'index.html',
    excludeAssets: [/(background)|(injected)/],
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

function getPlugins(useJs, isProd, inputFolderPath) {
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
    useJs,
    htmlWebpackPluginOptions,
    inputFolderPath
  );
  plugins.push(htmlWebpackPlugin);

  return plugins;
}

export function getConfig(useJs, isProd, inputFolderPath, outputFolderPath) {
  const entry = getEntry(useJs, isProd, inputFolderPath);
  const mode = isProd ? 'production' : 'development';
  const tsCompilerOptions = getTsCompilerOptions(isProd);
  const plugins = getPlugins(useJs, isProd, inputFolderPath);

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
