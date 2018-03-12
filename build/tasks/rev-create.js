import gulp from 'gulp';
import merge from 'merge-stream';
import rev from 'gulp-rev';

/**
 * Rev create task
 * Static assets revisioning
 * "Hash" filenames for stylesheets, scripts, images and svg
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @returns {Stream} revisioned files stream
 */
export default function task(paths) {
  const tasks = paths.src.map((src, i) => gulp
    .src(src, { base: paths.base[i] })
    .pipe(rev())
    .pipe(gulp.dest(paths.dest[i]))
    .pipe(rev.manifest(paths.manifest.files[i]))
    .pipe(gulp.dest(paths.manifest.dest))
  );

  return merge(tasks);

  // DEV
  // return gulp
  //   .src(paths.src, { base: paths.base })
  //   .pipe(rev())
  //   .pipe(gulp.dest(paths.dest))
  //   .pipe(rev.manifest(paths.manifest.file))
  //   .pipe(gulp.dest(paths.manifest.dest));
}
