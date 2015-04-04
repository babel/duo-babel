
/**
 * Module dependencies.
 */

var compile = require('babel-core').transform;
var extend = require('extend');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * babel plugin
 *
 * @param {Object} o
 * @return {Function}
 */

function plugin(o) {
  if (!o) o = {};

  // extract the onlyLocals option
  var onlyLocals = o.onlyLocals || false;
  delete o.onlyLocals;

  return function babel(file, entry) {
    if (file.type !== 'js') return;          // ignore non-js
    if (onlyLocals && file.remote()) return; // ignore any remotes

    var options = extend(true, {
      filename: file.path,
      filenameRelative: file.id,
      sourceRoot: file.root,
      sourceMap: !!file.duo.sourceMap() ? 'inline' : false
    }, o);

    var es5 = compile(file.src, options);
    file.src = es5.code;
  }
}
