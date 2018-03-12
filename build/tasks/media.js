import gulp from 'gulp';
import gulpif from 'gulp-if';

import server from '../config/server';
const browserSync = require('browser-sync').get(server.name);

/**
 * Media task
 * Copy media files
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @param {string} taskName name of the task
 * @returns {Stream} override stream
 */
export default function task(paths, env, taskName) {
  const isProd = env.name === 'staging' || env.name === 'production';

  return gulp
    .src(paths.src, {
      base: paths.base,
      since: gulp.lastRun(taskName, server.timestamp),
    })
    .pipe(gulpif(
      isProd,
      gulp.dest(paths.tmp),
      gulp.dest(paths.dest)
    ))
    .pipe(gulpif(env.name === 'serve', browserSync.stream()));
}
