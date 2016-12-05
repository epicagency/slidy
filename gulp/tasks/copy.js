'use strict';


/**
 * Config / paths
 */
const server =  require('../config').server;
const paths = require('../config').copy;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const gulpif = require('gulp-if');

// Others
const browserSync = require('browser-sync').get(server.name);


/**
 * Copy task
 * All "non-processed" files from src to dest
 */
function copy() {
  return gulp
    .src(paths.src, {
      base: paths.base,
      since: gulp.lastRun('copy'),
    })
    .pipe(gulp.dest(paths.dest))
    .pipe(gulpif(global.env === 'serve', browserSync.stream()));
}

copy.description = 'copy all "non-processed" files';
gulp.task(copy);
