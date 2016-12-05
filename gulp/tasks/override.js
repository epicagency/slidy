'use strict';


/**
 * Config / paths
 */
const server =  require('../config').server;
const paths = require('../config').override;


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
function override() {
  return gulp
    .src(paths.src, {
      since: gulp.lastRun('override'),
    })
    .pipe(gulp.dest(paths.dest))
    .pipe(gulpif(global.env === 'serve', browserSync.stream()));
}

override.description = 'copy files form "override" into "dist"';
gulp.task(override);
