'use strict';


/**
 * Config / paths
 */
const paths = require('../config').styles;
const server =  require('../config').server;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const gulpif = require('gulp-if');
const header = require('gulp-header');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

// Others
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').get(server.name);


/**
 * Styles task
 * sass + sourcemaps + autoprefixer + min
 */
function styles() {
  const processors = [
    autoprefixer({
      browsers: [
        'last 2 versions',
        '> 5%',
        'ios >= 8',
        'ie >= 10',
        'Firefox ESR',
      ],
      cascade: false,
    }),
  ];

  return gulp
    .src(paths.src, {
      base: paths.base,
    })
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(header('$env: \'${env}\';\n', { env: global.env }))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulpif(
      (global.env === 'serve' || global.env === 'dev'),
      sourcemaps.write()
    ))
    .pipe(gulpif(
      (global.env === 'staging' || global.env === 'production'),
      sourcemaps.write('./', {
        sourceMappingURLPrefix: '../styles',
      })
    ))
    .pipe(gulpif(
      (global.env === 'staging' || global.env === 'production'),
      gulp.dest(paths.tmp),
      gulp.dest(paths.dest)
    ))
    .pipe(gulpif(global.env === 'serve', browserSync.stream()));
}

styles.description = 'sass + sourcemaps + autoprefixer + min';
gulp.task(styles);
