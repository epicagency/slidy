import gulp from 'gulp';

import task from './tasks/svg';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function svg() {
  return task(paths.get('svg'), env);
}

svg.description = 'SVG sprite generator + optimisation';

gulp.task(svg);
