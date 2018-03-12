const { argv } = require('yargs');
const fs = require('fs');

/**
 * Environment global to be easily shared between tasks
 *
 * name:
 *   - serve                -> watch via browsersync
 *   - staging, production  -> revisioned assets
 *                          -> strip debug
 *                          -> uglified JS
 *   - production           -> no sourcemaps
 * release:
 *   - dev                  -> nothing to do
 *   - [xxx]                -> upload sourcemaps to sentry
 */

// Default
const env = {};

// Name
env.name = 'serve';

// `gulp dev` (no watching)
if (argv._[0] === 'dev') {
  env.name = 'dev';
}

// `gulp build` (for production by default)
// can also be used for staging (see below)
if (argv._[0] === 'build') {
  env.name = 'production';
}

// Use with node.js environment
// Example: NODE_ENV=env gulp [taskname]
// Do not work with docker…
if (process.env.NODE_ENV) {
  env.name = process.env.NODE_ENV;
}

// Or with an option/argument
// Example: gulp [taskname] --staging|production
if (argv.staging) {
  env.name = 'staging';
}

if (argv.production) {
  env.name = 'production';
}

// Release
env.release = 'dev';

if (env.name === 'staging' || env.name === 'production') {
  // Get release from VERSION file
  fs.readFile('VERSION', 'utf8', (err, data) => {
    if (err) {
      return;
    }

    env.release = data.trim();
  });
}

export default env;
