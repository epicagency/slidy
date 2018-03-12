import gulp from 'gulp';

import task from './tasks/rev-replace';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function revReplace() {
  return task(paths.get('rev'));
}

revReplace.description = 'static assets revisioning replacement';
gulp.task(revReplace);
