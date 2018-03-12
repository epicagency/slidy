import cached from 'gulp-cached';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';

import server from '../config/server';
const browserSync = require('browser-sync').get(server.name);

/**
 * Images task
 * All about perf, size, …
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @returns {Stream} images stream
 */
export default function task(paths, env) {
  const isProd = env.name === 'staging' || env.name === 'production';

  return gulp
    .src(paths.src, {
      base: paths.base,
    })
    .pipe(cached('imagemin'))
    .pipe(imagemin([
      imagemin.gifsicle({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 2}),
      imagemin.svgo({
        plugins: [
          { cleanupIDs: false },
          { collapseGroups: false },
          { removeUselessDefs: false },
        ],
      }),
    ]))
    .pipe(gulpif(
      isProd,
      gulp.dest(paths.tmp),
      gulp.dest(paths.dest)
    ))
    .pipe(gulpif(env.name === 'serve', browserSync.stream()));
}
