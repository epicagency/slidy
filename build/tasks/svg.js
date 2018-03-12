import gulp from 'gulp';
import gulpif from 'gulp-if';
import merge from 'merge-stream';
import rename from 'gulp-rename';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';

import server from '../config/server';
const browserSync = require('browser-sync').get(server.name);

/**
 * Svg task
 * Create optimized SVG sprite
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @returns {Stream} images stream
 */
export default function task(paths, env) {
  const isProd = env.name === 'staging' || env.name === 'production';

  const tasks = paths.src.map((src, i) => gulp
    .src(src, {
      base: paths.base[i],
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
    .pipe(rename(path => {
      const name = path.dirname.split(path.sep);

      name.push(path.basename);
      path.basename = name.join('-');
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulpif(
      isProd,
      gulp.dest(paths.tmp[i]),
      gulp.dest(paths.dest[i])
    ))
    .pipe(gulpif(env.name === 'serve', browserSync.stream()))
  );

  return merge(tasks);
}
