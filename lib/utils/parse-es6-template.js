'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Source: https://gist.github.com/smeijer/6580740a0ff468960a5257108af1384e
 */

function get(path, obj) {
  var fb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '${' + path + '}';

  return path.split('.').reduce(function (res, key) {
    return res[key] || fb;
  }, obj);
}

function parseTpl(template, map, fallback) {
  return template.replace(/\$\{.+?}/g, function (match) {
    var path = match.substr(2, match.length - 3).trim();
    return get(path, map, fallback);
  });
}

exports.default = parseTpl;