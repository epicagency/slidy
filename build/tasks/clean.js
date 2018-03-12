import del from 'del';

/**
 * Clean task
 * Delete dist folder content…
 *
 * @export
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @returns {Promise} array of deleted paths
 */
export default function task(paths, env) {
  // If test, allow to delete files/folders
  // outside the current working directory.
  const opts = {
    dot: true,
    force: env.test,
  };

  return del(paths.dist, opts);
}
