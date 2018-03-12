import gulp from 'gulp';
import merge from 'merge-stream';
import replace from 'gulp-rev-replace';

/**
 * Rev replace task
 * Static assets revisioning
 * Replace all "hashed" filename occurences
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @returns {Stream} revisioned files stream
 */
export default function task(paths) {
  const tasks = paths.manifest.src.map((manifest, i) => gulp
    .src(paths.replace[i], { base: paths.dest[i] })
    .pipe(replace({
      manifest: gulp.src(paths.manifest.src[i]),
      replaceInExtensions: paths.extensions,
    }))
    .pipe(gulp.dest(paths.dest[i]))
  );

  return merge(tasks);
}
