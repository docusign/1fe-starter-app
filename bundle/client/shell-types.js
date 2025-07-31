const { shouldUseDevelopmentMode } = require('./utils');
const { resolve } = require('path');
const shellTypesTsConfig = resolve(
  __dirname,
  '../../tsconfig-shell.types.json',
);

const shellTypesConfig = /** @type {import('webpack').Configuration} */ {
  mode: shouldUseDevelopmentMode ? 'development' : 'production',
  devtool: shouldUseDevelopmentMode ? 'source-map' : false,
  entry: [resolve(__dirname, '../../src/shell/index.ts')],
  output: {
    path: resolve(__dirname, '../../dist/shell'),
    filename: '[name].js',
    publicPath: '',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: shellTypesTsConfig,
          },
        },
      },
    ],
  },
};

module.exports = shellTypesConfig;
