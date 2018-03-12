import gulp from 'gulp';

import task from './tasks/rev-create';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function revCreate() {
  return task(paths.get('rev'));
}

revCreate.description = 'static assets revisioning creation';
gulp.task(revCreate);
