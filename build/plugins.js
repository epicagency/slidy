import gulp from 'gulp';

import task from './tasks/plugins';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function plugins() {
  return task(paths.get('plugins'), env, 'plugins');
}

plugins.description = 'copy plugins files';

gulp.task(plugins);
