'use strict';

const _ = require('lodash');
require('dotenv').config();

let server = {};

if (global.env === 'serve') {
  // Config for watching tasks (dev)
  let subDomain = process.env.EPIC_NAME;
  let hostname = process.env.EPIC_USER;
  let domain = process.env.EPIC_DOMAIN || 'epic-sys.io';
  let port = {
    default: process.env.GULP_BS_DEFAULT,
    ui: process.env.GULP_BS_UI,
    weinre: process.env.GULP_BS_WEINRE,
  };

  server = {
    name: 'gulp-server',
    proxy: subDomain + '.' + hostname + '.' + domain,
    host: subDomain + '.' + hostname + '.' + domain,
    port: {
      default: port.default,
      ui: port.ui,
      weinre: port.weinre,
    },
    open: false,
  };
} else {
  server.name = 'gulp-server';
}

/**
 * Paths
 */
// Root
let dist = 'demo/dist/';
let src = 'demo/src/';

// Custom HERE!
let dest = dist + '';
let theme = '';
let folders = [];

// Don't touch this
let assets = theme + 'assets/';
let email = 'email/';
let override = ['override/**/*'];
let tmp = '.tmp/';
let files = [
  '!' + src + assets + 'styles{,/**}',
  '!' + src + assets + 'scripts/*',
  '!' + src + assets + 'scripts/components{,/**}',
  '!' + src + assets + 'scripts/shared{,/**}',
  '!' + src + assets + 'scripts/vendor{,/**}',
  '!' + src + assets + 'scripts/view{,/**}',
  '!' + src + assets + 'images{,/**}',
  '!' + src + assets + 'svg{,/**}',
  '!' + src + 'sync_*',
  '!' + src + 'sftp*',
];
let clean = [
  dest + '.*',
  tmp + '*',
  email + '*',
];

// Add folders dynamically
if (folders.length === 0) {
  files.unshift(src + '**/*');
  clean.unshift(dest + '*');
} else {
  // Add folders dynamically
  _.each(folders, function(item) {
    files.unshift(src + item + '**/*');
    clean.unshift(dest + item + '*');
  });
}

module.exports = {
  server: server,
  // !breakpoints
  breakpoints: {
    src: 'gulp/breakpoints.json',
    dest: {
      styles: src + assets + 'styles/utils/',
      scripts: src + assets + 'scripts/shared/',
    },
    file: 'breakpoints.json',
  },
  // !copy
  copy: {
    src: files,
    base: src.replace(/\/$/g, ''), // Strip last slash…
    dest: dest,
  },
  // !override
  override: {
    src: override,
    dest: dist,
  },
  // !clean
  clean: {
    dist: clean,
  },
  // !styles
  styles: {
    src: src + assets + 'styles/*.scss',
    base: src,
    dest: dest,
    tmp: tmp,
  },
  // !scripts
  scripts: {
    src: src + assets + 'scripts/*.js',
    base: src,
    dest: dest,
    tmp: tmp,
    opts: './' + src + assets + 'scripts/',
  },
  // !images
  images: {
    src: src + assets + 'images/**/*',
    base: src,
    dest: dest,
    tmp: tmp,
  },
  // !svg
  svg: {
    src: src + assets + 'svg/**/*.svg',
    base: src + assets + 'svg/',
    dest: dest + assets + 'svg/',
    tmp: tmp + assets + 'svg/',
  },
  // !images for email
  imagesEmail: {
    src: src + email + '**/*.+(jpg|png|gif|jpeg)',
    base: src,
    dest: email,
  },
  // !html for email
  htmlEmail: {
    src: src + email + '**/index.html',
    dest: email,
  },
  // !watch
  watch: {
    dist: dist,
    src: src,
    dest: dest,
    copy: files,
    override: override,
    styles: src + assets + 'styles/**/*.scss',
    scripts: src + assets + 'scripts/**/*.js',
    images: src + assets + 'images/**/*',
    svg: src + assets + 'svg/**/*',
    imagesEmail: src + email + '**/*.+(jpg|png|gif|jpeg)',
    htmlEmail: src + email + '**/*.html',
  },
  // !rev
  rev: {
    src: [
      tmp + assets + 'styles/*.min.css',
      tmp + assets + 'styles/*.min.css.map',
      tmp + assets + 'scripts/*.min.js',
      tmp + assets + 'scripts/*.min.js.map',
      tmp + assets + 'images/**/*',
      tmp + assets + 'svg/**/*',
    ],
    base: tmp + assets,
    dest: dest + assets,
    manifest: 'rev-manifest.json',
    replace: [
      dest + assets + 'styles/*.css',
      dest + assets + 'scripts/*.js',
      dest + '**/*.+(html|php|twig|jade|info)',
    ],
    extensions: [
      '.js',
      '.css',
      '.html',
      '.php',
      '.twig',
      '.jade',
      '.hbs',
      '.info',
    ],
  },
};
