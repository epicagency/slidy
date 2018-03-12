import autoprefixer from 'autoprefixer';
import globImporter from 'node-sass-glob-importer';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import header from 'gulp-header';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';

import server from '../config/server';
const browserSync = require('browser-sync').get(server.name);

/**
 * Styles task
 * sass + sourcemaps + autoprefixer + min
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @returns {Stream} styles stream
 */
export default function task(paths, env) {
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
      grid: true,
    }),
  ];
  const isProd = env.name === 'staging' || env.name === 'production';

  return gulp
    .src(paths.src, {
      base: paths.base,
    })
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(header('$env: \'${env}\';\n', { env: env.name })) // eslint-disable-line
    .pipe(
      sass({
        outputStyle: 'compressed',
        importer: globImporter(),
      }).on('error', sass.logError)
    )
    .pipe(postcss(processors))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulpif(
      env.name === 'serve' || env.name === 'dev',
      sourcemaps.write()
    ))
    .pipe(gulpif(
      // !DEV sourcemaps on prod? that's the question…
      // env.name === 'staging',
      isProd,
      sourcemaps.write('./', {
        sourceMappingURLPrefix: '../styles',
      })
    ))
    .pipe(gulpif(
      isProd,
      gulp.dest(paths.tmp),
      gulp.dest(paths.dest)
    ))
    .pipe(gulpif(env.name === 'serve', browserSync.stream()));
}
