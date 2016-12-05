'use strict';


/**
 * Config / paths
 */
const paths = require('../config').imagesEmail;
const server =  require('../config').server;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const cache = require('gulp-cached');
const imagemin = require('gulp-imagemin');

// Others
const browserSync = require('browser-sync').get(server.name);


/**
 * Images task
 * All about perf, size, …
 */
function imagesEmail() {
  return gulp.src(paths.src, {
    base: paths.base,
  })
  .pipe(cache('imagemin'))
  .pipe(imagemin())
  .pipe(
    gulp.dest(paths.dest)
  )
  .pipe(browserSync.stream());
}

imagesEmail.description = 'Images optimization for email (.png, .jpg, .gif)';
gulp.task(imagesEmail);
