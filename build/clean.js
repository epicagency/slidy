import gulp from 'gulp';

import task from './tasks/clean';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function clean() {
  return task(paths.get('clean'), env);
}

clean.description = 'delete dist folder content';
gulp.task(clean);
