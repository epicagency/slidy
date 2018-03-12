import gulp from 'gulp';

/**
 * Breakpoints task for scripts
 * Copy breakpoints.json to src/assets/scripts/utils/
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @returns {Stream} breakpointsScripts stream
 */
export default function task(paths) {
  let stream = gulp.src(paths.src);

  paths.dest.scripts.forEach(path => {
    stream = stream.pipe(gulp.dest(path));
  });

  return stream;
}
