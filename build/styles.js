import gulp from 'gulp';

import task from './tasks/styles';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function styles() {
  return task(paths.get('styles'), env);
}

styles.description = 'sass + sourcemaps + autoprefixer + min';

gulp.task(styles);
