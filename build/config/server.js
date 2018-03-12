import env from './env';

/**
 * Load infos from .env
 */
require('dotenv').config();

/**
 * BrowserSnc server settings
 */
let server = {};

if (env.name === 'serve') {
  // Config for watching tasks (dev)
  const host = 'localhost';
  const proxy = 'localhost:8080';
  const port = {
    default: parseInt(process.env.GULP_BS_DEFAULT, 10),
    ui: parseInt(process.env.GULP_BS_UI, 10),
    weinre: parseInt(process.env.GULP_BS_WEINRE, 10),
  };

  server = {
    name: 'gulp-server',
    proxy,
    host,
    port,
    open: false,
    timestamp: 1000,
  };
} else {
  server.name = 'gulp-server';
}

export default server;
