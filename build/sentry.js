import gulp from 'gulp';

import task from './tasks/sentry';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @param {Function} done callback
 * @returns {Function} gulp task
 */
function sentry(done) {
  return task(paths.get('sentry'), env, done);
}

sentry.description = 'upload scripts + sourcemaps to Sentry';

gulp.task(sentry);
