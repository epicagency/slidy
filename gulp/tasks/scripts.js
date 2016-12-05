'use strict';


/**
 * Config / paths
 */
const paths = require('../config').scripts;
const server =  require('../config').server;


/**
 * Load modules / packages
 */

// Gulp
const gulp = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');

// Others
const assign = require('lodash.assign');
const browserify = require('browserify');
const browserSync = require('browser-sync').get(server.name);
const buffer = require('vinyl-buffer');
const es = require('event-stream');
const glob = require('glob');
const path = require('path');
const source = require('vinyl-source-stream2');
const stringify = require('stringify');
const watchify = require('watchify');


/**
 * Scripts task
 * sourcemaps + browserify + uglify + min
 */
function scripts(done) {
  glob(paths.src, function(err, files) {
    if (err) { done(err); }

    // Needed for multiple files (entries AND outputs)
    const tasks = files.map(function(entry) {

      let browserifyOpts = {
        entries: [entry],
        debug: true,
        paths: ['./node_modules', paths.opts],
      }; // Add custom browserify options here
      let opts = assign({}, watchify.args, browserifyOpts);
      let b;

      if (global.env === 'serve') {
        b = watchify(browserify(opts));
      } else {
        b = browserify(opts);
      }

      const bundle = () => {
        return b
          .bundle()
          // Log errors if they happen
          .on('error', gutil.log.bind(gutil, 'Browserify Error'))
          // Use conventional text streams at the start of gulp task
          .pipe(source({
            path: entry,
            base: paths.base,
          }))
          // Optional, remove if you don't need to buffer file contents
          // Here, used for sourcemaps…
          .pipe(buffer())
          // Loads map from browserify
          .pipe(gulpif(
            global.env !== 'production',
            sourcemaps.init({
              loadMaps: true,
            }))
          )
          .pipe(gulpif(
            global.env === 'production',
            stripDebug()
          ))
          .pipe(gulpif(
            (global.env === 'staging' || global.env === 'production'),
            uglify()
          ))
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
              sourceMappingURLPrefix: '../scripts',
            })
          ))
          .pipe(gulpif(
            (global.env === 'staging' || global.env === 'production'),
            gulp.dest(paths.tmp),
            gulp.dest(paths.dest)
          ))
          .pipe(gulpif(global.env === 'serve', browserSync.stream()))
          .on('end', function() {
            gutil.log('Finished \'' +
              gutil.colors.cyan('bundle') +
              '\' [' + path.parse(entry).name + '.min.js]'
            );
          });
      };
      // Add your transforms here or try via package.json (sometimes buggy)
      // Ability to require() text files (.json)
      b.transform(stringify(['.json']));
      // On any dep update, runs the bundler
      b.on('update', bundle);
      b.on('log', function() {
        gutil.log('Starting \'' +
          gutil.colors.cyan('bundle') +
          '\' [' + path.basename(entry) + ']'
        );
      });
      return bundle();
    });
    // Create a merged stream
    es.merge(tasks).on('end', done);
  });
}

scripts.description = 'browserify + sourcemaps + strip-debug + uglify + min';
gulp.task(scripts);
