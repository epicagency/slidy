const path = require('path');

const paths = {
  get(task, config = null) {
    this.config = config || require(path.join(__dirname, '../../.epicrc.json')).gulp; // eslint-disable-line
    this.init();

    if (!this[task]) {
      throw new Error(`Task '${task}' does not exist!`);
    }

    return this[task]();
  },

  init() {
    if (this.config.wp && !this.config.themes) {
      throw new Error('You need to specify, at least, one theme folder');
    }

    // Basic paths
    this.src = 'demo/src'; // (src)
    this.root = 'demo/dist'; // (dist)
    this.tmp = '.tmp';
    this.dist = this.config.wp ? `${this.root}/` : this.root; // (dist/wp)
    this.dest = this.config.wp ? `${this.dist}/` : this.dist; // (dist/wp/wp-content)

    // Assets path
    if (this.config.wp) {
      [this.parent] = this.config.themes;
      this.assets = `themes/${this.parent}*/assets`; // Asterisk handles single and multi themes
    } else {
      this.assets = 'assets';
    }

    // Scripts related paths
    if (this.config.wp) {
      this.jsFiles = this.config.themes.map(theme => this.config.scripts.files.reduce((acc, cur) => {
        acc[`themes/${theme}/assets/scripts/${cur}`] = `./${this.src}/themes/${theme}/assets/scripts/${cur}.js`;

        return acc;
      }, {}));
    } else {
      this.jsFiles = [this.config.scripts.files.reduce((acc, cur) => {
        acc[`assets/scripts/${cur}`] = `./${this.src}/assets/scripts/${cur}.js`;

        return acc;
      }, {})];
    }
    this.jsFolders = this.config.scripts.folders || [
      'components',
      'utils',
      'vendor',
      'views',
    ];

    // Plugins paths
    if (this.config.wp) {
      this.pluginsPaths = this.config.themes.map(theme => `${this.src}/plugins/${theme}/${this.parent}-*{,/**}`);

      if (this.config.plugins) {
        this.pluginsPaths = this.pluginsPaths.concat(
          this.config.plugins.map(plugin => `${this.src}/plugins/${plugin}{,/**}`)
        );
      }
    }

    // Files & clean paths
    this.filesPaths = [
      `!${this.src}/${this.assets}/images{,/**}`,
      `!${this.src}/${this.assets}/media{,/**}`,
      `!${this.src}/${this.assets}/styles{,/**}`,
      `!${this.src}/${this.assets}/scripts/*`,
      `!${this.src}/${this.assets}/svg{,/**}`,
    ];
    this.cleanPaths = [
      `${this.dest}/.*`,
      `!${this.dest}/.gitkeep`,
      `${this.tmp}/*`,
    ];
    if (this.config.wp) {
      // Copy all themes files
      this.filesPaths.unshift(`${this.src}/themes/${this.parent}*/**/*`);
      this.filesPaths.unshift(`${this.src}/themes/${this.parent}*/**/.*`);
      // Plugins files are processed
      this.filesPaths.push(`!${this.src}/plugins/${this.parent}*/**/*`);
      // Clean themes + plugins
      this.cleanPaths.unshift(`${this.dest}/themes/${this.parent}*/**`);
      this.cleanPaths.unshift(`${this.dest}/plugins/${this.parent}*/**`);

      if (this.config.plugins) {
        this.cleanPaths = this.config.plugins
          .map(plugin => `${this.dest}/plugins/${plugin}`)
          .concat(this.cleanPaths);
      }
    } else {
      this.filesPaths.unshift(`${this.src}/**/*`);
      this.filesPaths.unshift(`${this.src}/**/.*`);
      this.cleanPaths.unshift(`${this.dest}/*`);
    }
    this.jsFolders.forEach(folder => {
      this.filesPaths = this.filesPaths.concat(
        this.getMultiPaths(`!${this.src}`, `scripts/${folder}{,/**}`)
      );
    });

    // Override path
    if (this.config.wp) {
      this.overridePaths = ['override/**/*'];
    }

    // Manifest paths
    this.manifestPaths = ['rev-manifest.json'];
    if (this.config.wp) {
      this.config.themes.forEach((theme, i) => {
        if (i > 0) {
          this.manifestPaths.push(`rev-manifest${theme.replace(this.parent, '')}.json`);
        }
      });
    }
  },

  getMultiPaths(before = null, after = null, assets = true) {
    const pre = before ? `${before}/` : '';
    const post = after ? `/${after}` : '';
    const mid = assets ? this.assets : '';

    if (this.config.wp) {
      return this.config.themes.map(theme => {
        const mid = assets ? `themes/${theme}/assets` : `themes/${theme}`;

        return `${pre}${mid}${post}`;
      });
    }

    return [`${pre}${mid}${post}`];
  },

  // Tasks paths
  clean() {
    return {
      dist: this.cleanPaths,
    };
  },
  breakpoints() {
    return {
      src: 'build/inc/breakpoints.json',
      dest: {
        styles: this.getMultiPaths(this.src, 'styles/utils/'),
        scripts: this.getMultiPaths(this.src, 'scripts/utils/'),
      },
      file: 'breakpoints.json',
    };
  },
  copy() {
    return {
      src: this.filesPaths,
      base: this.src,
      dest: this.dest,
    };
  },
  override() {
    return {
      src: this.overridePaths,
      dest: this.dist,
    };
  },
  plugins() {
    return {
      src: this.pluginsPaths,
      dest: `${this.dest}/plugins/`,
    };
  },
  images() {
    return {
      src: `${this.src}/${this.assets}/images/**/*`,
      base: this.src,
      dest: this.dest,
      tmp: this.tmp,
    };
  },
  media() {
    return {
      src: `${this.src}/${this.assets}/media/**/*`,
      base: this.src,
      dest: this.dest,
      tmp: this.tmp,
    };
  },
  svg() {
    return {
      src: this.getMultiPaths(this.src, 'svg/**/*.svg'),
      base: this.getMultiPaths(this.src, 'svg'),
      dest: this.getMultiPaths(this.dest, 'svg'),
      tmp: this.getMultiPaths(this.tmp, 'svg'),
    };
  },
  styles() {
    return {
      src: `${this.src}/${this.assets}/styles/*.scss`,
      base: this.src,
      dest: this.dest,
      tmp: this.tmp,
    };
  },
  scripts() {
    return {
      entries: {
        task: this.jsFiles,
        bundle: this.jsFiles.reduce((acc, cur) => Object.assign(acc, cur), {}),
      },
      dest: this.getMultiPaths(this.dest, 'scripts'),
      tmp: this.getMultiPaths(this.tmp, 'scripts'),
      opts: this.getMultiPaths(this.src, 'scripts')
        .concat(this.getMultiPaths(this.src, 'styles/utils/')),
      include: this.config.scripts.include || [],
      public: this.root.replace(/^\//, ''),
    };
  },
  sentry() {
    return {
      version: 'VERSION',
      src: `${this.dest}/${this.assets}/scripts`,
    };
  },
  rev() {
    return {
      src: this.manifestPaths.map((path, i) => [
        this.getMultiPaths(this.tmp, 'styles/*.min.css')[i],
        this.getMultiPaths(this.tmp, 'styles/*.min.css.map')[i],
        this.getMultiPaths(this.tmp, 'scripts/*.min.js')[i],
        this.getMultiPaths(this.tmp, 'scripts/*.min.js.map')[i],
        this.getMultiPaths(this.tmp, 'images/**/*')[i],
        this.getMultiPaths(this.tmp, 'media/**/*')[i],
        this.getMultiPaths(this.tmp, 'svg/**/*')[i],
      ]),
      base: this.getMultiPaths(this.tmp),
      dest: this.getMultiPaths(this.dest),
      manifest: {
        files: this.manifestPaths,
        src: this.manifestPaths,
        dest: process.cwd(),
      },
      replace: this.manifestPaths.map((path, i) => [
        this.getMultiPaths(this.dest, 'styles/*.css')[i],
        this.getMultiPaths(this.dest, 'scripts/*.js')[i],
        this.getMultiPaths(this.dest, '**/*.+(html|php|twig|jade|info)', false)[i],
      ]),
      extensions: [
        '.js',
        '.css',
        '.html',
        '.php',
        '.twig',
        '.jade',
        '.info',
      ],
    };
  },
  zip() {
    return {
      src: [`${this.root}/**/*`, `${this.root}/**/.*`],
      dest: this.root,
      file: 'dist.zip',
    };
  },
  watch() {
    return {
      dist: this.dist,
      src: this.src,
      dest: this.dest,
      copy: this.filesPaths,
      plugins: this.pluginsPaths,
      override: this.overridePaths,
      styles: `${this.src}/${this.assets}/styles/**/*.scss`,
      scripts: this.dest.replace(new RegExp(`^${this.root}`), ''), // Strip root folder
      images: `${this.src}/${this.assets}/images/**/*`,
      media: `${this.src}/${this.assets}/media/**/*`,
      svg: `${this.src}/${this.assets}/svg/**/*`,
    };
  },
};

module.exports = paths;
