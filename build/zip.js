import gulp from 'gulp';

import task from './tasks/zip';
import * as paths from './config/paths';

/**
 * Wrapper
 *
 * @returns {Function} gulp task
 */
function zip() {
  return task(paths.get('zip'));
}

zip.description = 'Zip dist folder';

gulp.task(zip);
