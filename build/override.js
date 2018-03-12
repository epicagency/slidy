import gulp from 'gulp';

import task from './tasks/override';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function override() {
  return task(paths.get('override'), env, 'override');
}

override.description = 'copy files that override core/third-party code';

gulp.task(override);
