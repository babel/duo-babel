
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
  debug('initialized with options', o);

  var extensions = extract(o, 'extensions');
  if (extensions) debug('extensions to compile', extensions);
  var onlyLocals = extract(o, 'onlyLocals');
  if (onlyLocals) debug('only compiling locals');

  var only = extract(o, 'only');
  if (only) debug('only compiling files matching', only);
  var ignore = extract(o, 'ignore');
  if (ignore) debug('not compiling files matching', ignore);

  return function* babel(file, entry) {
    // compile only what babel recognizes
    if (!canCompile(file.path, extensions)) return debug('ignoring file: %s', file.path);

    // ignore remotes if configured to
    if (onlyLocals && file.remote()) return debug('ignoring remote: %s', file.id);

    var duo = file.duo;
    var es5 = yield run(duo, file, o, only, ignore);
    file.src = es5.code;
    file.type = 'js';
  };
}

/**
 * Run the compilation, but utilizes the cache if available.
 *
 * @param {Duo} duo         Duo instance
 * @param {File} file       File to be compiled
 * @param {Object} options  User-defined config
 * @param {Array} only      User-defined whilelist
 * @param {Array} ignore    User-defined blacklist
 * @returns {Object}        Results of babel compile
 */

function* run(duo, file, options, only, ignore) {
  var cache = yield duo.getCache();
  if (!cache) {
    debug('cache not enabled for %s', file.id);
    return compile(duo, file, options, only, ignore);
  }

  var key = [ duo.hash(file.src), duo.hash(options) ];
  var cached = yield cache.plugin('babel', key);
  if (cached) {
    debug('retrieved %s from cache', file.id);
    return cached;
  }

  var results = compile(duo, file, options, only, ignore);
  yield cache.plugin('babel', key, results);
  debug('saved %s to cache', file.id);
  return results;
}

/**
 * Compiles the file given options from user.
 */

function compile(duo, file, options, only, ignore) {
  var root = duo.root();
  var sourceMap = duo.sourceMap();

  var o = extend(true, {
    ast: false,
    filename: file.path,
    filenameRelative: file.id,
    sourceMap: sourceMap ? 'inline' : false,
    sourceRoot: '/',
    only: prepend(only, root),
    ignore: prepend(ignore, root)
  }, options);

  debug('attempting to compile: %s', file.id, o);
  var es5 = babel.transform(file.src, o);
  if (file.src === es5.code) debug('did not compile: %s', file.id);
  return es5;
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
