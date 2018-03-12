import gulp from 'gulp';

import task from './tasks/breakpoints-styles';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function breakpointsStyles() {
  return task(paths.get('breakpoints'), env);
}

breakpointsStyles.description = 'create src/assets/styles/utils/_breakpoints.scss';

gulp.task(breakpointsStyles);
