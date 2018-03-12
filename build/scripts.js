import gulp from 'gulp';

import task from './tasks/scripts';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function scripts() {
  return task(paths.get('scripts'), env);
}

scripts.description = 'webpack + sourcemaps + strip-debug + uglify + min';

gulp.task(scripts);
