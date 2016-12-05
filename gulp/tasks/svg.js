'use strict';


/**
 * Config / paths
 */
const paths = require('../config').svg;
const server =  require('../config').server;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');

// const cache = require('gulp-cached');
// const imagemin = require('gulp-imagemin');

// Others
const browserSync = require('browser-sync').get(server.name);


/**
 * Images task
 * All about perf, size, …
 */
function svg() {
  return gulp.src(paths.src, {
    base: paths.base,
  })
  .pipe(svgmin({
    plugins: [
      {
        removeStyleElement: true,
      },
      {
        removeAttrs: {
          attrs: ['fill', 'stroke'],
        },
      },
    ],
  }))
  .pipe(rename(function(path) {
    var name = path.dirname.split(path.sep);
    name.push(path.basename);
    path.basename = name.join('-');
  }))
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite.svg'))
  .pipe(gulpif(
    (global.env === 'staging' || global.env === 'production'),
    gulp.dest(paths.tmp),
    gulp.dest(paths.dest)
  ))
  .pipe(gulpif(global.env === 'serve', browserSync.stream()));
}

svg.description = 'SVG sprite generator + optimisation';
gulp.task(svg);
