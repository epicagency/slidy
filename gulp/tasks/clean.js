'use strict';


/**
 * Config / paths
 */
const paths = require('../config').clean;


/**
 * Load modules / packages
 */

// Gulp
const del = require('del');
const gulp = require('gulp');


/**
 * Clean task
 * Delete dist folder content…
 */
function clean() {
  return del(paths.dist);
}

clean.description = 'delete dist folder content';
gulp.task(clean);
