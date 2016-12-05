'use strict';


/**
 * Config / paths
 */
const paths = require('../config').images;
const server =  require('../config').server;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const cache = require('gulp-cached');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');

// Others
const browserSync = require('browser-sync').get(server.name);


/**
 * Images task
 * All about perf, size, …
 */
function images() {
  return gulp.src(paths.src, {
    base: paths.base,
  })
  .pipe(cache('imagemin'))
  .pipe(imagemin({
    svgoPlugins: [
      { cleanupIDs: false },
      { collapseGroups: false },
      { removeUselessDefs: false },
    ],
  }))
  .pipe(gulpif(
    (global.env === 'staging' || global.env === 'production'),
    gulp.dest(paths.tmp),
    gulp.dest(paths.dest)
  ))
  .pipe(gulpif(global.env === 'serve', browserSync.stream()));
}

images.description = 'images optimization (.png, .jpg, .gif, .svg)';
gulp.task(images);
