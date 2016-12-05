'use strict';


/**
 * Config / paths
 */
global.env = require('./gulp/env');
console.log('ENV:', global.env);

const paths = require('./gulp/config').watch;
const server =  require('./gulp/config').server;

const browserSync = require('browser-sync').create(server.name);
const del = require('del');
const gulp = require('gulp');

const requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });


/**
 * Main tasks
 */

/**
 * Watch task
 * Launch browsersync server
 * Watch files and refresh browser
 * Delete removed files
 */
gulp.task('watch', function() {

  var deleteRemovedFile = function(path) {
    let toDelete = path.replace(paths.src, paths.dest);
    del(toDelete);
    console.log(
      'File ' + path + ' was removed',
      ' -> ' + toDelete + ' was deleted'
    );
  };

  browserSync.init({
    proxy: server.proxy,
    host: server.host,
    port: server.port.default,
    ui: {
      port: server.port.ui,
      weinre: {
        port: server.port.weinre,
      },
    },
    open: server.open,
  });

  // Copy
  gulp
    .watch(paths.copy, gulp.parallel('copy'))
    .on('unlink', deleteRemovedFile);

  // Override
  gulp
    .watch(paths.override, gulp.parallel('override'))
    .on('unlink', deleteRemovedFile);

  // Images
  gulp
    .watch(paths.images, gulp.parallel('images'))
    .on('unlink', deleteRemovedFile);

  // SVG
  gulp.watch(paths.svg, gulp.parallel('svg'));

  // Styles
  gulp.watch(paths.styles, gulp.parallel('styles'));

  // Scripts uses his own 'watchify'
});


/**
 * Dev task (all dev tasks without watch)
 */
gulp.task('dev', gulp.series(
  'clean',
  'breakpoints',
  'copy',
  'override',
  gulp.parallel(
    'images',
    'svg',
    'styles',
    'scripts'
  )
));


/**
 * Serve task
 * Dev + watch
 */
gulp.task('serve', gulp.series(
  'dev',
  'watch'
));


/**
 * Default = serve
 */
gulp.task('default', gulp.series('serve'));


/**
 * Build task
 * Dev + assets revisioning
 */
gulp.task('initBuild', function init(done) {
  console.time('BUILD TIME');
  done();
});

gulp.task('build', gulp.series(
  'initBuild',
  'dev',
  'revProcess',
  'revEnd',
  function complete(done) {
    console.timeEnd('BUILD TIME');
    console.log('BUILD task COMPLETE!');
    done();
  }
));



/**
 * Mail tasks
 */


/**
 * Email watch task
 * Launch browsersync server
 * Watch files and refresh browser
 * Delete removed files
 */
gulp.task('watchEmail', function() {
  var deleteRemovedFile = function(path) {
    let toDelete = path.replace(paths.src, paths.dest);
    del(toDelete);
    console.log(
      'File ' + path + ' was removed',
      ' -> ' + toDelete + ' was deleted'
    );
  };

  browserSync.init({
    proxy: server.proxy,
    host: server.host,
    port: server.port.default,
    ui: {
      port: server.port.ui,
      weinre: {
        port: server.port.weinre,
      },
    },
  });

  // Copy
  gulp
    .watch(paths.htmlMail, gulp.parallel('htmlEmail'))
    .on('unlink', deleteRemovedFile);

  // Images
  gulp
    .watch(paths.imagesMail, gulp.parallel('imagesEmail'))
    .on('unlink', deleteRemovedFile);
});

gulp.task('email', gulp.series(
  'clean',
  gulp.parallel(
    'htmlEmail',
    'imagesEmail'
  ),
  'watchEmail'
));
