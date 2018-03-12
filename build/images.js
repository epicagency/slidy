import gulp from 'gulp';

import task from './tasks/images';
import env from './config/env';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function images() {
  return task(paths.get('images'), env);
}

images.description = 'images optimization (.png, .jpg, .gif, .svg)';

gulp.task(images);
