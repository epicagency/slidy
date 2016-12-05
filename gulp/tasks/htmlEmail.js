'use strict';


/**
 * Config / paths
 */
const paths = require('../config').htmlEmail;
const server =  require('../config').server;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const fileinclude = require('gulp-file-include');

// Others
const browserSync = require('browser-sync').get(server.name);


/**
 * Html task
 * Including..
 */
function htmlEmail() {
  return gulp.src(paths.src)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(
      gulp.dest(paths.dest)
    )
    .pipe(browserSync.stream());
}

htmlEmail.description = 'Including html for email';
gulp.task(htmlEmail);
