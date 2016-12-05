'use strict';


/**
 * Config / paths
 */
const paths = require('../config').rev;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');



/**
 * Rev task
 * Static assets revisioning
 * Remove old revisioned files
 */

function revProcess() {
  return gulp
    .src(paths.src, { base: paths.base })
    .pipe(rev())
    .pipe(gulp.dest(paths.dest))
    .pipe(rev.manifest(paths.manifest))
    .pipe(gulp.dest(process.cwd()));
}

revProcess.description = 'static assets revisioning';
gulp.task(revProcess);


/**
 * Rev end task
 * Rewrite occurences of revisioned files
 */

function revEnd() {
  let manifest = gulp.src(paths.manifest);

  return gulp.src(paths.replace, { base: paths.dest })
    .pipe(revReplace({
      manifest: manifest,
      replaceInExtensions: paths.extensions,
    }))
    .pipe(gulp.dest(paths.dest));
}

revEnd.description = 'static assets references update';
gulp.task(revEnd);
