import gulp from 'gulp';
import gulpif from 'gulp-if';

import server from '../config/server';
const browserSync = require('browser-sync').get(server.name);

/**
 * Plugins task
 * Copy plugins files
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @param {string} taskName name of the task
 * @returns {Stream} plugins stream
 */
export default function task(paths, env, taskName) {
  return gulp
    .src(paths.src, {
      base: paths.base,
      since: gulp.lastRun(taskName, server.timestamp),
    })
    .pipe(gulp.dest(paths.dest))
    .pipe(gulpif(env.name === 'serve', browserSync.stream()));
}