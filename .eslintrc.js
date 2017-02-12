module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    // commonjs: true,
  },
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    // ecmaFeatures: {
    //   experimentalObjectRestSpread: true,
    // },
  },
  root: true,
  'rules': {
    'camelcase': 0,
    'comma-dangle': [1, 'always-multiline'],
    'eqeqeq': 2,
    'indent': [2, 2, {
      'SwitchCase': 1,
      'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3},
    }],
    'no-console': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-trailing-spaces': 1,
    'quotes': [2, 'single'],
    'space-before-blocks': 2,
  },
}
