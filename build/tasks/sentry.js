const fs = require('fs');
const { exec } = require('child_process');

/**
 * Upload scripts + sourcemaps
 *
 * @param {Object} paths paths (src, base, dest, …)
 * @param {Object} env environment infos
 * @param {string} env.name serve|dev|staging|production
 * @param {string} env.test false|true
 * @param {Function} done callback
 * @returns {Stream} sentry stream
 */
export default function task(paths, env, done) {
  if (env.name === 'staging' || env.name === 'production') {
    // Get release from VERSION file
    fs.readFile(paths.version, 'utf8', (err, data) => {
      if (err) {
        done(err);
      } else {
        const release = data.trim();
        // Send files + sourcemaps via Sentry CLI
        const command = `sentry-cli releases files ${release} upload-sourcemaps ${paths.src}`;

        exec(command, (err, stdout, stderr) => {
          if (err) {
            console.info(stderr);
          } else {
            console.info(stdout);
          }
          done(err);
        });
      }
    });
  } else {
    // Nothing to do
    done();
  }
}
