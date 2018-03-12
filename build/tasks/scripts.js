import gulp from 'gulp';
import gulpif from 'gulp-if';
import { map } from 'lodash';
import merge from 'merge-stream';
import named from 'vinyl-named';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import header from 'gulp-header';
const fs = require('fs');
const path = require('path');

import getWebpackConfig from '../config/webpack';

/**
 * Scripts task
 * sourcemaps + webpack + uglify + min
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @returns {Stream} images stream
 */
export default function task(paths, env) {
  const webpackConfig = getWebpackConfig(paths, env);
  const isProd = env.name === 'staging' || env.name === 'production';

  const tasks = paths.dest.map((dest, i) => gulp
    .src(map(paths.entries.task[i], item => item))
    .pipe(named())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulpif(
      isProd,
      header(
        fs.readFileSync(path.join(__dirname, '../inc/epic-console.js'), 'utf-8')
      )
    ))
    .pipe(gulpif(
      isProd,
      gulp.dest(paths.tmp[i]),
      gulp.dest(dest)
    ))
  );

  return merge(tasks);
}
