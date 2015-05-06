
/**
 * Module dependencies.
 */

var compile = require('babel-core').transform;
var extend = require('extend');
var path = require('path');

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
    if (file.type !== 'js') return;           // ignore non-js
    if (onlyLocals && file.remote()) return;  // ignore remotes

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
