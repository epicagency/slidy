import gulp from 'gulp';

import task from './tasks/media';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function media() {
  return task(paths.get('media'), env, 'media');
}

media.description = 'media copy/versioning';

gulp.task(media);
