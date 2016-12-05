'use strict';


/**
 * Config / paths
 */
const paths = require('../config').breakpoints;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const rename = require('gulp-rename');

// Others
const fs = require('fs');
const jsonSass = require('json-sass');
const source = require('vinyl-source-stream2');


/**
 * Breakpoints task for styles
 * Create src/assets/styles/utils/_breakpoints.scss
 */
function breakpointsStyles() {
  return fs.createReadStream(paths.src)
    .pipe(jsonSass({
      prefix: '$mq-breakpoints: ',
      suffix: ';\r',
    }))
    .pipe(source(paths.file))
    .pipe(rename({
      prefix: '_',
      extname: '.scss',
    }))
    .pipe(gulp.dest(paths.dest.styles));
}

breakpointsStyles.description = 'create src/assets/styles/utils/_breakpoints.scss';
gulp.task(breakpointsStyles);


/**
 * Breakpoints task for scripts
 * Copy breakpoints.json to src/assets/scripts/lib/
 */
function breakpointsScripts() {
  return gulp.src(paths.src)
    .pipe(gulp.dest(paths.dest.scripts));
}

breakpointsScripts.description = 'copy breakpoints.json to src/assets/scripts/lib/';
gulp.task(breakpointsScripts);


/**
 * Breakpoints task (one task to rule them all)
 */
gulp.task(
  'breakpoints',
  gulp.parallel('breakpointsStyles', 'breakpointsScripts')
);
