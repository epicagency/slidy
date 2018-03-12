/**
 * 1. Load everything…
 */
// Load config
import env from './build/config/env';
import server from './build/config/server';
import getWebpackConfig from './build/config/webpack';
import * as paths from './build/config/paths';
const config = require('./.epicrc.json').gulp;

// Load dependencies
import del from 'del';
import gulp from 'gulp';
const browserSync = require('browser-sync').create(server.name);
const requireDir = require('require-dir');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

// Load tasks
requireDir('./build');

/**
 * 2. Display infos
 */
console.log('ENV:', env.name);
console.log('RELEASE:', env.release);

/**
 * 3. Main tasks
 */


/**
 * 3.1 Watch task
 * Launch browsersync server + webpack middleware
 * Watch files and refresh browser
 * Delete removed files
 */
gulp.task('watch', () => {
  let webpackConfig = getWebpackConfig(paths.get('scripts'), env);

  // We need to add entries for webpack config with middleware
  // because scripts task use a Gulp stream (no entries)
  webpackConfig = Object.assign(webpackConfig, { entry: paths.get('scripts').entries.bundle});

  // Watch for deleted files
  const deleteRemovedFile = function deleteRemovedFile(path) {
    const toDelete = path.replace(paths.get('watch').src, paths.get('watch').dest);

    del(toDelete);
    console.log(
      `File ${path} was removed`,
      ` -> ${toDelete} was deleted`
    );
  };

  // Webpack
  const bundler = webpack(webpackConfig);

  bundler.plugin('done', () => {
    browserSync.reload();
  });

  // BrowserSync
  browserSync.init({
    proxy: {
      target: server.proxy,
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: paths.get('watch').scripts,
          stats: { colors: true },
        }),
      ],
    },
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
    .watch(paths.get('watch').copy, gulp.parallel('copy'))
    .on('unlink', deleteRemovedFile);

  // Images
  gulp
    .watch(paths.get('watch').images, gulp.parallel('images'))
    .on('unlink', deleteRemovedFile);

  // Media
  gulp
    .watch(paths.get('watch').media, gulp.parallel('media'))
    .on('unlink', deleteRemovedFile);

  // SVG
  gulp.watch(paths.get('watch').svg, gulp.parallel('svg'));

  // Styles
  gulp.watch(paths.get('watch').styles, gulp.parallel('styles'));

  if (config.wp) {
    // Override
    gulp
      .watch(paths.get('watch').override, gulp.parallel('override'))
      .on('unlink', deleteRemovedFile);

    // Plugins
    gulp
      .watch(paths.get('watch').plugins, gulp.parallel('plugins'))
      .on('unlink', deleteRemovedFile);
  }
});


/**
 * 3.2 Dev task
 * (all dev tasks without watch)
 *
 * @param {Function} done callback
 * @returns {Function} callback
 */
gulp.task('dev', gulp.series(
  'clean',
  gulp.parallel(
    'breakpointsStyles',
    'breakpointsScripts'
  ),
  'copy',
  config.wp ? 'override' : done => done(),
  gulp.parallel(
    config.wp ? 'plugins' : done => done(),
    'images',
    'media',
    'svg',
    'styles',
    'scripts'
  )
));


/**
 * 3.3 Serve task
 * Dev + watch
 */
gulp.task('serve', gulp.series(
  'dev',
  'watch'
));


/**
 * 3.4 Default = serve
 */
gulp.task('default', gulp.series('serve'));


/**
 * 3.5 Build task
 * Dev + assets revisioning
 */
gulp.task('initBuild', done => {
  console.time('BUILD TIME');
  done();
});

gulp.task('build', gulp.series(
  'initBuild',
  'dev',
  'revCreate',
  'revReplace',
  // If needed
  // 'zip',
  done => {
    console.timeEnd('BUILD TIME');
    console.log('BUILD task COMPLETE!');
    done();
  }
));
