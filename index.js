
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

  var should = shouldTranspile(o.only, o.ignore);

  var only = o.only;
  delete o.only;

  var ignore = o.ignore;
  delete o.ignore;

  return function babel(file, entry) {
    if (file.type !== 'js') return;  // ignore non-js
    if (!should(file)) return;       // user-specified ignores

    var root = file.duo.root();

    var options = extend(true, {
      filename: file.path,
      filenameRelative: file.id,
      sourceMap: !!file.duo.sourceMap() ? 'inline' : false,
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
 * Return a helper function that tests if a file/module should be transpiled.
 *
 * This makes the following modifications to the input arrays:
 *  - extracts "locals" and "remotes" (as they are special cases here)
 *  - resolves from the duo root for each path
 *
 * The "locals" and "remotes" special cases will be tested by the returned
 * function, and any remaining options will be proxied to babel directly.
 *
 * @param {Object} file
 * @param {Array:String} only
 * @param {Array:String} ignore
 * @returns {Boolean}
 */

function shouldTranspile(only, ignore) {
  only = normalize(only);
  ignore = normalize(ignore);

  if (only) {
    return function (file) {
      if (only.locals && !file.local()) return false;
      if (only.remotes && !file.remote()) return false;
      return true;
    };
  } else if (ignore) {
    return function (file) {
      if (ignore.locals && file.local()) return false;
      if (ignore.remotes && file.remote()) return false;
      return true;
    };
  } else {
    return function () {
      return true;
    }
  }
}

/**
 * Normalizes a list of patterns.
 *
 * @param {Array:String} list
 * @returns {Object}
 */

function normalize(list) {
  if (!list || !list.length) return false;

  return {
    locals: extract(list, 'locals'),
    remotes: extract(list, 'remotes'),
    list: list
  };
}

/**
 * Extracts a set of values from an array.
 *
 * @param {Array} input
 * @param {Mixed} item
 * @returns {Array}
 */

function extract(input, item) {
  var x = input.indexOf(item);

  if (x > -1) {
    input.splice(x, 1);
    return true;
  } else {
    return false;
  }
}

function prepend(list, prefix) {
  if (!list) return false;

  return list.map(function (item) {
    return path.resolve(prefix, item);
  });
}
