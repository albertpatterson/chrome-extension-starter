import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getContext() {
  return path.resolve(__dirname, '..', '..', 'src', 'popup');
}

function getEntry(useJs, isProd) {
  const context = getContext();

  const suffix = useJs ? 'js' : 'ts';

  return {
    'js/popup': path.resolve(context, 'js', `popup.${suffix}`),
  };
}

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

const createHtmlWebpackPlugin = function (useJs, opts) {
  const context = getContext(useJs);

  const config = {
    template: path.resolve(context, 'popup.html'),
    filename: 'popup.html',
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

function getPlugins(useJs, isProd) {
  const plugins = [];
  if (isProd) {
    plugins.push(
      ...[
        new MiniCssExtractPlugin({
          filename: 'css/popup_[fullhash].css',
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
    htmlWebpackPluginOptions
  );
  plugins.push(htmlWebpackPlugin);

  return plugins;
}

export function getConfig(useJs, isProd) {
  const entry = getEntry(useJs, isProd);
  const mode = isProd ? 'production' : 'development';
  const tsCompilerOptions = getTsCompilerOptions(isProd);
  const plugins = getPlugins(useJs, isProd);

  const scssModuleRule = isProd
    ? createSCSSModuleRule(MiniCssExtractPlugin.loader)
    : createSCSSModuleRule('style-loader');

  const prodConfig = {
    entry,
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '..', '..', 'dist', 'unpacked', 'popup'),
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
