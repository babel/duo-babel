
/**
 * Module dependencies.
 */

var babel = require('babel-core');
var debug = require('debug')('duo-babel');
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
  debug('initialized with options', o);
  if (!o) o = {};

  var extensions = extract(o, 'extensions');
  if (extensions) debug('extensions to compile', extensions);
  var onlyLocals = extract(o, 'onlyLocals');
  if (onlyLocals) debug('only compiling locals');

  var only = extract(o, 'only');
  if (only) debug('only compiling files matching', only);
  var ignore = extract(o, 'ignore');
  if (ignore) debug('not compiling files matching', ignore);

  return function babel(file, entry) {
    // compile only what babel recognizes
    if (!canCompile(file.path, extensions)) return debug('ignoring file: %s', file.path);

    // ignore remotes if configured to
    if (onlyLocals && file.remote()) return debug('ignoring remote: %s', file.id);

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
      debug('attempting to compile: %s', file.id, options);
      var es5 = compile(file.src, options);
      file.type = 'js';
      file.src = es5.code;
    } catch (err) {
      debug('failed to compile: %s', file.id);
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
  if (!list) return null;

  return list.map(function (item) {
    return path.resolve(prefix, item);
  });
}

/**
 * Extracts a value from the input object, deleting the property afterwards.
 *
 * @param {Object} object
 * @param {String} key
 * @returns {Mixed}
 */

function extract(object, key) {
  var value = object[key];
  delete object[key];
  return value;
}
