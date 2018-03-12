import gulp from 'gulp';
import jsonSass from 'json-sass';
import rename from 'gulp-rename';
import source from 'vinyl-source-stream';

const fs = require('fs');

/**
 * Breakpoints task for styles
 * Create src/assets/styles/utils/_breakpoints.scss
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @returns {ReadStream} breakpointsStyles stream
 */
export default function task(paths) {
  let stream = fs
    .createReadStream(paths.src)
    .pipe(jsonSass({
      prefix: '$mq-breakpoints: ',
      suffix: ';\r',
    }))
    .pipe(source(paths.file))
    .pipe(rename({
      prefix: '_',
      extname: '.scss',
    }));

  paths.dest.styles.forEach(path => {
    stream = stream.pipe(gulp.dest(path));
  });

  return stream;
}
