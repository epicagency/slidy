/**
 * Load modules / packages
 */

// Gulp
const path = require('path');
const webpack = require('webpack');

/**
 * Get webpack config
 * function is needed for modular/testing (passing paths params)
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @returns {Object} webpack.config
 */
export default function getWebpackConfig(paths, env) {
  const isProd = env.name === 'staging' || env.name === 'production';

  const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'eval-source-map',
    optimization: {
      minimize: isProd,
    },
    output: {
      filename: '[name].min.js',
      path: `/${paths.path}`,
      publicPath: `/${paths.public}`,
      sourceMapFilename: '../scripts/[file].map',
    },
    resolve: {
      modules: paths.opts
        .map(p => path.resolve(process.cwd(), p))
        .concat(['node_modules']),
    },
    resolveLoader: {
      modules: [
        'node_modules',
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          name: JSON.stringify(env.name),
          release: JSON.stringify(env.release),
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths.opts.concat(paths.include)
            .map(p => path.resolve(process.cwd(), p)),
          use: [
            { loader: 'babel-loader' },
          ],
        },
        {
          test: /\.json$/,
          use: [
            { loader: 'json-loader'},
          ],
        },
        {
          test: /export\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(glsl|frag|vert)$/,
          exclude: /node_modules/,
          use: [
            'raw-loader',
            'glslify-loader',
          ],
        },
      ],
    },
  };

  if (process.env.NODE_PATH) {
    config.resolve.modules.push(process.env.NODE_PATH);
    config.resolveLoader.modules.push(process.env.NODE_PATH);
  }

  return config;
}


