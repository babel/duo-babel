
/**
 * Module dependencies.
 */

var babel = require('babel-core');
var extend = require('extend');
var path = require('path');

/**
 * Helper methods.
 */

var compile = babel.transform;
var canCompile = babel.util.canCompile;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Babel plugin for Duo.
 *
 * Available options:
 *  - onlyLocals {Boolean}
 *  - only {Array:String}    List of modules to allow
 *  - ignore {Array:String}  List of modules to exclude
 *
 * All other options will be proxied to babel directly.
 *
 * @param {Object} o
 * @return {Function}
 */

function plugin(o) {
  if (!o) o = {};

  var onlyLocals = o.onlyLocals;
  delete o.onlyLocals;

  var only = o.only;
  delete o.only;

  var ignore = o.ignore;
  delete o.ignore;

  return function babel(file, entry) {
    // compile only what babel recognizes
    if (!canCompile(file.path)) return;

    // ignore remotes if configured to
    if (onlyLocals && file.remote()) return;

    var root = file.duo.root();

    var options = extend(true, {
      filename: file.path,
      filenameRelative: file.id,
      sourceMap: file.duo.sourceMap() ? 'inline' : false,
      sourceRoot: '/',
      only: prepend(only, root),
      ignore: prepend(ignore, root)
    }, o);

    try {
      var es5 = compile(file.src, options);
      file.type = 'js';
      file.src = es5.code;
    } catch (err) {
      throw new Error(err.message);
    }
  };
}

/**
 * Prepend a value to each item in the given array.
 *
 * @param {Array} list
 * @param {String} prefix
 * @returns {Boolean|Array}
 */

function prepend(list, prefix) {
  if (!list) return false;

  return list.map(function (item) {
    return path.resolve(prefix, item);
  });
}
