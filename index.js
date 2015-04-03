
/**
 * Module dependencies.
 */

var compile = require('babel-core').transform;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * babel plugin
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin(opts){
  opts = opts || {};

  var onlyLocals = !!opts.onlyLocals;
  delete opts.onlyLocals;

  return function babel(file){
    if ('js' !== file.type) return;
    if (onlyLocals && file.remote()) return; // ignore any remotes
    var es5 = compile(file.src, opts);
    file.src = es5.code;
  }
}
