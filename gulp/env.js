'use strict';

const argv = require('yargs').argv;

/**
 * Environment global to be easily shared between tasks
 * accepted values: serve, dev, staging, production
 *
 * Main differences:
 *   - serve                -> watch via browsersync
 *   - staging, production  -> revisioned assets
 *                          -> strip debug
 *                          -> uglified JS
 *   - production           -> no sourcemaps
 */

// Default
let env = 'serve';

// `gulp dev` (no watching)
if (argv['_'][0] === 'dev') {
  env = 'dev';
}

// `gulp build` (for production by default)
// can also be used for staging (see below)
if (argv['_'][0] === 'build') {
  env = 'production';
}

// Use with node.js environment
// Example: NODE_ENV=env gulp [taskname]
// Do not work with docker…
if (process.env.NODE_ENV) {
  env = process.env.NODE_ENV;
}

// Or with an option/argument
// Example: gulp [taskname] --staging|production
if (argv.staging) {
  env = 'staging';
}

module.exports = env;
