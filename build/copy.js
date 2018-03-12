import gulp from 'gulp';

import task from './tasks/copy';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function copy() {
  return task(paths.get('copy'), env, 'copy');
}

copy.description = 'copy all "non-processed" files';

gulp.task(copy);
