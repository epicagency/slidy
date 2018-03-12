import gulp from 'gulp';

import task from './tasks/breakpoints-scripts';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function breakpointsScripts() {
  return task(paths.get('breakpoints'), env);
}

breakpointsScripts.description = 'copy breakpoints.json to src/assets/scripts/utils/';

gulp.task(breakpointsScripts);
