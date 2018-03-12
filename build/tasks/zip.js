import gulp from 'gulp';
import zip from 'gulp-zip';

/**
 * Zip task
 * Copy dist files into dist folder
 *
 * @export
 * @param {Object} paths paths (src, dest)
 * @returns {Stream} zip stream
 */
export default function task(paths) {
  return gulp
    .src(paths.src)
    .pipe(zip(paths.file))
    .pipe(gulp.dest(paths.dest));
}
